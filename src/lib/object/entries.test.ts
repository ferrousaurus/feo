import { describe, expect, it } from "bun:test";

import entries from "#/lib/object/entries";

describe("entries", () => {
  it("returns entries of an object with known keys", () => {
    const obj = { a: 1, b: 2 };
    const result = entries(obj);
    expect(result.sort((a, b) => a[0].localeCompare(b[0]))).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
  });

  it("returns an empty array for an empty object", () => {
    const result = entries({});
    expect(result).toEqual([]);
  });

  it("returns [string, unknown][] for Record<string, unknown>", () => {
    const obj: Record<string, unknown> = { x: 1, y: 2 };
    const result = entries(obj);
    expect(result.sort((a, b) => a[0].localeCompare(b[0]))).toEqual([
      ["x", 1],
      ["y", 2],
    ]);
  });
});
