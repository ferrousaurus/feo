import { describe, expect, it } from "bun:test";

import values from "#/lib/object/values";

describe("values", () => {
  it("returns values of an object with known keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = values(obj);
    expect(result.sort()).toEqual([1, 2, 3]);
  });

  it("returns an empty array for an empty object", () => {
    const result = values({});
    expect(result).toEqual([]);
  });

  it("returns unknown[] for Record<string, unknown>", () => {
    const obj: Record<string, unknown> = { x: "hello", y: 42 };
    const result = values(obj);
    expect(result.sort()).toEqual([42, "hello"]);
  });
});
