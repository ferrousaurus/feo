import { describe, expect, test } from "bun:test";
import { $ZodError } from "zod/v4/core";

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
  { input: ';;;\n{"key": "value"}\n;;;\nbody', expected: { frontmatter: { key: "value" }, content: "body" } },
  {
    input: ';;;\n{"title": "Hello", "tags": ["a", "b"]}\n;;;\n# Body',
    expected: { frontmatter: { title: "Hello", tags: ["a", "b"] }, content: "# Body" },
  },
  { input: ';;;\n{"key": "value"}\n;;;\n', expected: { frontmatter: { key: "value" }, content: "" } },
  { input: '+++\nkey = "value"\n+++\nbody', expected: { frontmatter: { key: "value" }, content: "body" } },
  {
    input: '+++\ntitle = "Hello"\ntags = ["a", "b"]\n+++\n# Body',
    expected: { frontmatter: { title: "Hello", tags: ["a", "b"] }, content: "# Body" },
  },
  { input: '+++\nkey = "value"\n+++\n', expected: { frontmatter: { key: "value" }, content: "" } },
] as const;

const unparsableCases = [
  { input: "---\n42\n---\nbody", error: $ZodError },
  { input: '---\n"hello"\n---\nbody', error: $ZodError },
  { input: "---\ntrue\n---\nbody", error: $ZodError },
  { input: "---\nnull\n---\nbody", error: $ZodError },
  { input: "---\n[1, 2, 3]\n---\nbody", error: $ZodError },
  { input: "---\n: invalid yaml\n---\nbody", error: SyntaxError },
  { input: "---\nkey: : :\n---\nbody", error: SyntaxError },
  { input: "---\n  - a\n  bad indent\n---\nbody", error: SyntaxError },
  { input: ";;;\n{invalid json}\n;;;\nbody", error: SyntaxError },
  { input: ";;;\n42\n;;;\nbody", error: $ZodError },
  { input: ';;;\n"hello"\n;;;\nbody', error: $ZodError },
  { input: ";;;\ntrue\n;;;\nbody", error: $ZodError },
  { input: ";;;\nnull\n;;;\nbody", error: $ZodError },
  { input: '+++\nkey = "unclosed\n+++\nbody', error: SyntaxError },
  { input: "+++\n42\n+++\nbody", error: SyntaxError },
  { input: '+++\n"hello"\n+++\nbody', error: SyntaxError },
  { input: "+++\ntrue\n+++\nbody", error: SyntaxError },
  { input: "+++\nnull\n+++\nbody", error: SyntaxError },
] as const;

describe("parse", () => {
  for (const { input, expected } of successCases) {
    test(`parse('${input.replace(/\n/g, "\\n")}') returns the expected object`, () => {
      const parsed = md.parse(input);
      expect(parsed).toEqual(expected);
    });
  }

  for (const { input, error } of unparsableCases) {
    test(`parse('${input.replace(/\n/g, "\\n")}') throws a SyntaxError`, () => {
      expect(() => md.parse(input)).toThrow(error);
    });
  }
});
