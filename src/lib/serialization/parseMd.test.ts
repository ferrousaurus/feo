import { describe, expect, test } from "vitest";
import { $ZodError } from "zod/v4/core";
import { parseMd } from "./parseMd";

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
] as const;

const nonRecordCases = [
  { input: "---\n42\n---\nbody" },
  { input: '---\n"hello"\n---\nbody' },
  { input: "---\ntrue\n---\nbody" },
  { input: "---\nnull\n---\nbody" },
  { input: "---\n[1, 2, 3]\n---\nbody" },
] as const;

const unparsableCases = [
  { input: "---\n: invalid yaml\n---\nbody" },
  { input: "---\nkey: : :\n---\nbody" },
  { input: "---\n  - a\n  bad indent\n---\nbody" },
] as const;

describe("parseMd", () => {
  for (const { input, expected } of successCases) {
    test(`parseMd frontmatter content overwrites body when present`, () => {
      const parsed = parseMd(input);
      expect(parsed).toEqual(expected);
    });
  }

  for (const { input } of nonRecordCases) {
    test(`parseMd('${input.replace(/\n/g, "\\n")}') throws a $ZodError (not a record)`, () => {
      expect(() => parseMd(input)).toThrow($ZodError);
    });
  }

  for (const { input } of unparsableCases) {
    test(`parseMd('${input.replace(/\n/g, "\\n")}') throws a SyntaxError`, () => {
      expect(() => parseMd(input)).toThrow(SyntaxError);
    });
  }
});
