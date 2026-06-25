import { describe, expect, test } from "vitest";
import { $ZodError } from "zod/v4/core";
import json from "./json";

const successCases = [
  { input: "{}", expected: {} },
  { input: '{ "a": 1 }', expected: { a: 1 } },
  { input: '{ "a": { "b": [1, 2, 3] } }', expected: { a: { b: [1, 2, 3] } } },
  { input: '{ "a": 1, }', expected: { a: 1 } },
  { input: '// header\n{ "a": 1 }', expected: { a: 1 } },
  { input: '{ /* note */ "a": 1 }', expected: { a: 1 } },
  { input: '{ "a": 1, /* mid */ "b": 2 }', expected: { a: 1, b: 2 } },
  { input: '{ "a": /* inner */ 1 }', expected: { a: 1 } },
  { input: '/*\n  multi\n  line\n*/ { "a": 1 }', expected: { a: 1 } },
  {
    input: '{\n  "a": 1, // trailing\n  "b": 2\n}',
    expected: { a: 1, b: 2 },
  },
  { input: '/* outer */ { "a": /* inner */ 1, }', expected: { a: 1 } },
] as const;

const nonRecordCases = [
  { input: "null" },
  { input: '"hello"' },
  { input: "42" },
  { input: "3.14" },
  { input: "true" },
  { input: "false" },
  { input: "[]" },
  { input: "[1, 2, 3]" },
] as const;

const unparsableCases = [
  { input: "" },
  { input: "{" },
  { input: "[" },
  { input: '"unterminated' },
  { input: "{]" },
  { input: "{,}" },
  { input: '{ "a": }' },
  { input: '{ "a" 1 }' },
  { input: "{} trailing" },
  { input: "'hello'" },
  { input: "01" },
  { input: "NaN" },
  { input: "undefined" },
] as const;

describe("parse", () => {
  for (const { input, expected } of successCases) {
    test(`parse('${input}') returns the expected object`, () => {
      const parsed = json.parse(input);
      expect(parsed).toEqual(expected);
    });
  }

  for (const { input } of nonRecordCases) {
    test(`parse('${input}') throws a $ZodError (not a record)`, () => {
      expect(() => json.parse(input)).toThrow($ZodError);
    });
  }

  for (const { input } of unparsableCases) {
    test(`parse('${input}') throws a SyntaxError`, () => {
      expect(() => json.parse(input)).toThrow(SyntaxError);
    });
  }
});
