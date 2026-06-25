import { describe, expect, test } from "vitest";

import md from "./md";

const successCases = [
  { input: "", expected: { content: "" } },
  { input: "hello world", expected: { content: "hello world" } },
  {
    input: "# Title\n\nSome paragraph.",
    expected: { content: "# Title\n\nSome paragraph." },
  },
  { input: "---\nkey: value\n---\nbody", expected: { frontmatter: { key: "value" }, content: "body" } },
  {
    input: "---\ntitle: Hello\ntags:\n  - a\n  - b\n---\n# Body",
    expected: { frontmatter: { title: "Hello", tags: ["a", "b"] }, content: "# Body" },
  },
  {
    input: "---\nkey: value\n---\n",
    expected: { frontmatter: { key: "value" }, content: "" },
  },
  { input: "---\n42\n---\nbody", expected: { frontmatter: 42, content: "body" } },
  { input: '---\n"hello"\n---\nbody', expected: { frontmatter: "hello", content: "body" } },
  { input: "---\ntrue\n---\nbody", expected: { frontmatter: true, content: "body" } },
  { input: "---\nnull\n---\nbody", expected: { frontmatter: null, content: "body" } },
  { input: "---\n[1, 2, 3]\n---\nbody", expected: { frontmatter: [1, 2, 3], content: "body" } },
] as const;

const unparsableCases = [
  { input: "---\n: invalid yaml\n---\nbody" },
  { input: "---\nkey: : :\n---\nbody" },
  { input: "---\n  - a\n  bad indent\n---\nbody" },
] as const;

describe("parse", () => {
  for (const { input, expected } of successCases) {
    test(`parse('${input.replace(/\n/g, "\\n")}') returns the expected object`, () => {
      const parsed = md.parse(input);
      expect(parsed).toEqual(expected);
    });
  }

  for (const { input } of unparsableCases) {
    test(`parse('${input.replace(/\n/g, "\\n")}') throws a SyntaxError`, () => {
      expect(() => md.parse(input)).toThrow(SyntaxError);
    });
  }
});
