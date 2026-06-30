import { beforeEach, describe, expect, it, vi } from "vitest";

import { sourceValidator } from "#/data/feoConfig";
import readFile from "#/lib/io/readFile";
import loadSourceContent from "#/lib/source/loadSourceContent";

vi.mock("#/lib/io/readFile", () => ({
  default: vi.fn(),
}));

describe("loadSourceContent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("reads and parses a local path source by extension", async () => {
    vi.mocked(readFile).mockResolvedValue({ ok: true, text: async () => '{"a":1}', status: 200 });
    const result = await loadSourceContent(sourceValidator.parse({ path: "config.json" }));
    expect(result).toEqual({ a: 1 });
    expect(readFile).toHaveBeenCalledWith("config.json");
  });

  it("reads and parses a remote url source by extension", async () => {
    vi.mocked(readFile).mockResolvedValue({ ok: true, text: async () => '{"b":2}', status: 200 });
    const result = await loadSourceContent(sourceValidator.parse({ url: "https://example.com/config.json" }));
    expect(result).toEqual({ b: 2 });
    expect(readFile).toHaveBeenCalledWith("https://example.com/config.json");
  });

  it("returns inline data directly without I/O", async () => {
    const data = { key: "value" };
    const result = await loadSourceContent({ data });
    expect(result).toBe(data);
    expect(readFile).not.toHaveBeenCalled();
  });
});
