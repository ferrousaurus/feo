import fs from "node:fs/promises";

import { z } from "zod";

import getProtocol from "#/lib/fs/getProtocol";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";

export class NotFoundError extends Error {
  constructor(filename: string | URL) {
    super(`${filename} was not found.`);
  }
}

export class AccessError extends Error {
  constructor(filename: string | URL) {
    super(`${filename} could not be accessed.`);
  }
}

export class UnsupportedProtocolError extends Error {
  protocol: string;
  constructor(protocol: string) {
    super(`The ${protocol} protocol is not supported`);
    this.protocol = protocol;
  }
}

export class ResponseError extends Error {
  response: Response;
  constructor(response: Response) {
    super(`An HTTP request failed`);
    this.response = response;
  }
}

function isErrnoException(e: unknown): e is Error & { code: string } {
  return e instanceof Error && "code" in e && typeof e.code === "string";
}

async function readLocalFile(path: string | URL) {
  try {
    return await fs.readFile(path);
  } catch (e) {
    if (isErrnoException(e)) {
      if (e.code === "ENOENT") {
        throw new NotFoundError(path);
      }
      if (e.code === "EACCES") {
        throw new AccessError(path);
      }
    }
    throw e;
  }
}

async function readHttpFile(input: string | URL) {
  const response = await fetch(input);
  if (response.status === 404) {
    throw new NotFoundError(input);
  }
  if (response.status === 401 || response.status === 403) {
    throw new AccessError(input);
  }
  if (!response.ok) {
    throw new ResponseError(response);
  }
  return response;
}

export default async function readFile(input: string | URL) {
  if (typeof input === "string") {
    const absolutePath = resolveAbsolutePath(input);

    const protocol = getProtocol(absolutePath);
    const validatedProtocol = z.enum(["file:", "http:", "https:"]).safeParse(protocol);
    if (!validatedProtocol.success) {
      throw new UnsupportedProtocolError(protocol);
    }
    switch (protocol) {
      case "file:":
        try {
          const file = await readLocalFile(absolutePath);
          const text = file.toString();
          return { ok: true, text: async () => text, status: 200 } as const;
        } catch {
          return { ok: false, text: async () => await Promise.reject(), status: 404 } as const;
        }
      case "http:":
      case "https:":
        return await readHttpFile(absolutePath);
    }
  }

  return await readHttpFile(input);
}
