import { afterEach, describe, expect, it, mock } from "bun:test";

import { sourceValidator } from "#/data/feoConfig";
import readFile, { readHttpFile } from "#/lib/io/readFile";
import loadSourceContent from "#/lib/source/loadSourceContent";

afterEach(() => {
  mock.restore();
  mock.clearAllMocks();
});

describe("loadSourceContent", () => {
  it("reads and parses a local path source by extension", async () => {
    mock.module("#/lib/io/readFile", () => ({
      default: mock(async () => ({ ok: true, text: async () => '{"a":1}', status: 200 })),
      readHttpFile: mock(async () => ({
        ok: true,
        status: 200,
        text: async () => '{"a":1}',
        headers: new Headers({ "content-type": "application/json" }),
      })),
    }));

    const result = await loadSourceContent(sourceValidator.parse({ path: "config.json" }), ".");

    expect(result).toEqual({ a: 1 });
    expect(readFile).toHaveBeenCalledWith("config.json");
    expect(readHttpFile).not.toHaveBeenCalled();
  });

  it("joins the local path with configPath", async () => {
    mock.module("#/lib/io/readFile", () => ({
      default: mock(async () => ({ ok: true, text: async () => '{"a":1}', status: 200 })),
      readHttpFile: mock(async () => ({
        ok: true,
        status: 200,
        text: async () => '{"a":1}',
        headers: new Headers({ "content-type": "application/json" }),
      })),
    }));

    await loadSourceContent(sourceValidator.parse({ path: "config.json" }), "/etc/feo/config.jsonc");

    // configPath is a file path; the source path is resolved relative to its dir.
    expect(readFile).toHaveBeenCalledWith("/etc/feo/config.json");
  });

  it("reads and parses a remote url source by extension", async () => {
    mock.module("#/lib/io/readFile", () => ({
      default: mock(async () => ({ ok: true, text: async () => '{"b":2}', status: 200 })),
      readHttpFile: mock(async () => ({
        ok: true,
        status: 200,
        text: async () => '{"b":2}',
        headers: new Headers({ "content-type": "application/json" }),
      })),
    }));

    const result = await loadSourceContent(sourceValidator.parse({ url: "https://example.com/config.json" }), ".");

    expect(result).toEqual({ b: 2 });
    expect(readHttpFile).toHaveBeenCalledWith("https://example.com/config.json");
    expect(readFile).not.toHaveBeenCalled();
  });

  it("returns inline data directly without I/O", async () => {
    mock.module("#/lib/io/readFile", () => ({
      default: mock(async () => ({ ok: true, text: async () => "", status: 200 })),
      readHttpFile: mock(async () => ({
        ok: true,
        status: 200,
        text: async () => "",
        headers: new Headers(),
      })),
    }));

    const data = { key: "value" };
    const result = await loadSourceContent({ data }, ".");

    expect(result).toBe(data);
    expect(readFile).not.toHaveBeenCalled();
    expect(readHttpFile).not.toHaveBeenCalled();
  });
});
