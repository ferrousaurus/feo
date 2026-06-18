import { describe, expect, it } from "vitest";

import keys from "#/lib/object/keys";

describe("keys", () => {
  it("returns keys of an object with known keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = keys(obj);
    expect(result.sort()).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array for an empty object", () => {
    const result = keys({});
    expect(result).toEqual([]);
  });

  it("returns string[] for Record<string, unknown>", () => {
    const obj: Record<string, unknown> = { x: 1, y: 2 };
    const result = keys(obj);
    expect(result.sort()).toEqual(["x", "y"]);
  });
});
