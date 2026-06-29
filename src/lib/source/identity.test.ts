import { describe, expect, it } from "vitest";

import { sourceValidator } from "#/data/feoConfig";
import { sourceId, sourceLabel } from "#/lib/source/identity";

describe("sourceId", () => {
  it("returns a path-prefixed id for a local source", () => {
    expect(sourceId(sourceValidator.parse({ path: "foo" }))).toBe("path:foo");
  });

  it("returns a url-prefixed id for a remote source", () => {
    expect(sourceId(sourceValidator.parse({ url: "https://x/y" }))).toBe("url:https://x/y");
  });

  it("returns a data-prefixed sha for an inline source", () => {
    expect(sourceId({ data: { a: 1, b: 2 } })).toBe("data:43258cff783fe703");
  });

  it("is key-order independent for inline data", () => {
    expect(sourceId({ data: { b: 2, a: 1 } })).toBe(sourceId({ data: { a: 1, b: 2 } }));
  });
});

describe("sourceLabel", () => {
  it("returns the raw path for a local source", () => {
    expect(sourceLabel(sourceValidator.parse({ path: "foo" }))).toBe("foo");
  });

  it("returns the raw url for a remote source", () => {
    expect(sourceLabel(sourceValidator.parse({ url: "https://x/y" }))).toBe("https://x/y");
  });

  it("returns the data-prefixed sha for an inline source", () => {
    expect(sourceLabel({ data: { a: 1, b: 2 } })).toBe("data:43258cff783fe703");
  });
});
