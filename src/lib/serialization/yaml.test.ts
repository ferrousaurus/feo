import { describe, expect, test } from "vitest";
import { $ZodError } from "zod/v4/core";
import yaml from "./yaml";

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

const stringifyCases = [
  { input: {}, expected: "{}\n" },
  { input: { a: 1 }, expected: "a: 1\n" },
  { input: { a: 1, b: 2 }, expected: "a: 1\nb: 2\n" },
  { input: { a: { b: 2 } }, expected: "a:\n  b: 2\n" },
] as const;

describe("parse", () => {
  for (const { input, expected } of successCases) {
    test(`parse('${input.replace(/\n/g, "\\n")}') returns the expected object`, () => {
      const parsed = yaml.parse(input);
      expect(parsed).toEqual(expected);
    });
  }

  for (const { input } of nonRecordCases) {
    test(`parse('${input.replace(/\n/g, "\\n")}') throws a $ZodError (not a record)`, () => {
      expect(() => yaml.parse(input)).toThrow($ZodError);
    });
  }

  for (const { input } of unparsableCases) {
    test(`parse('${input.replace(/\n/g, "\\n")}') throws a SyntaxError`, () => {
      expect(() => yaml.parse(input)).toThrow(SyntaxError);
    });
  }
});

describe("stringify", () => {
  for (const { input, expected } of stringifyCases) {
    test(`stringify(${JSON.stringify(input)}) returns the expected output`, () => {
      const result = yaml.stringify(input);
      expect(result).toBe(expected);
    });
  }
});
