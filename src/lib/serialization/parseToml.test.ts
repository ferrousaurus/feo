import { describe, expect, test } from "vitest";
import { parseToml } from "./parseToml";

const successCases = [
  { input: "", expected: {} },
  { input: "a = 1", expected: { a: 1 } },
  { input: "a = 1\nb = 2", expected: { a: 1, b: 2 } },
  { input: '[section]\nkey = "value"', expected: { section: { key: "value" } } },
  {
    input: "a = 1\n[section]\nb = 2",
    expected: { a: 1, section: { b: 2 } },
  },
  { input: "[a.b]\nc = 1", expected: { a: { b: { c: 1 } } } },
  {
    input: 'a = 1\nb = "str"\nc = true\nd = [1, 2]',
    expected: { a: 1, b: "str", c: true, d: [1, 2] },
  },
  { input: "a = { x = 1, y = 2 }", expected: { a: { x: 1, y: 2 } } },
  { input: "# comment\na = 1", expected: { a: 1 } },
  { input: "a = 0xFF", expected: { a: 255 } },
] as const;

const unparsableCases = [
  { input: "=" },
  { input: "a =" },
  { input: "= 1" },
  { input: 'a = "unterminated' },
  { input: "[unclosed" },
  { input: "a = 1\n[" },
  { input: "no equals" },
] as const;

describe("parseToml", () => {
  for (const { input, expected } of successCases) {
    test(`parseToml('${input.replace(/\n/g, "\\n")}') returns the expected object`, () => {
      const parsed = parseToml(input);
      expect(parsed).toEqual(expected);
    });
  }

  for (const { input } of unparsableCases) {
    test(`parseToml('${input.replace(/\n/g, "\\n")}') throws a SyntaxError`, () => {
      expect(() => parseToml(input)).toThrow(SyntaxError);
    });
  }
});
