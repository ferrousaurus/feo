import { describe, expect, test } from "vitest";
import { $ZodError } from "zod/v4/core";
import { parseYaml } from "./parseYaml";

const successCases = [
  { input: "a: 1", expected: { a: 1 } },
  { input: "a: 1\nb: 2", expected: { a: 1, b: 2 } },
  { input: "a:\n  b: 2", expected: { a: { b: 2 } } },
  {
    input: "a: 1\nsection:\n  b: 2",
    expected: { a: 1, section: { b: 2 } },
  },
  { input: "# comment\na: 1", expected: { a: 1 } },
  { input: "a: 1 # inline", expected: { a: 1 } },
  { input: "a:\n  - 1\n  - 2", expected: { a: [1, 2] } },
  {
    input: "a: |\n  literal\n  block",
    expected: { a: "literal\nblock\n" },
  },
  { input: "a: &anchor 1\nb: *anchor", expected: { a: 1, b: 1 } },
] as const;

const nonRecordCases = [
  { input: "null" },
  { input: "'hello'" },
  { input: "42" },
  { input: "true" },
  { input: "[]" },
  { input: "[1, 2, 3]" },
] as const;

const unparsableCases = [
  { input: "a: 1\n  bad indent: 2" },
  { input: "a: : b" },
  { input: "[unclosed" },
  { input: "{ unclosed" },
  { input: "a: 1\n: b" },
  { input: "a: 1\nb: 2\n  c: 3" },
] as const;

describe("parseYaml", () => {
  for (const { input, expected } of successCases) {
    test(`parseYaml('${input.replace(/\n/g, "\\n")}') returns the expected object`, () => {
      const parsed = parseYaml(input);
      expect(parsed).toEqual(expected);
    });
  }

  for (const { input } of nonRecordCases) {
    test(`parseYaml('${input.replace(/\n/g, "\\n")}') throws a $ZodError (not a record)`, () => {
      expect(() => parseYaml(input)).toThrow($ZodError);
    });
  }

  for (const { input } of unparsableCases) {
    test(`parseYaml('${input.replace(/\n/g, "\\n")}') throws a SyntaxError`, () => {
      expect(() => parseYaml(input)).toThrow(SyntaxError);
    });
  }
});
