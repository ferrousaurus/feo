import type { FeoSource } from "#/data/feoConfig";
import sha from "#/lib/crypto/hash";

function dataHash(data: Record<string, unknown>): string {
  return sha(JSON.stringify(data, Object.keys(data).sort()));
}

export function sourceId(source: FeoSource): string {
  if ("path" in source) return `path:${source.path}`;
  if ("url" in source) return `url:${source.url}`;
  return `data:${dataHash(source.data)}`;
}

export function sourceLabel(source: FeoSource): string {
  if ("path" in source) return source.path;
  if ("url" in source) return source.url;
  return `data:${dataHash(source.data)}`;
}
