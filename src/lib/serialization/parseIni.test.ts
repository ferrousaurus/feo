import { describe, expect, test } from "vitest";
import { parseIni } from "./parseIni";

const successCases = [
  { input: "", expected: {} },
  { input: "a = 1", expected: { a: "1" } },
  { input: "a = 1\nb = 2", expected: { a: "1", b: "2" } },
  { input: "[section]\nkey = value", expected: { section: { key: "value" } } },
  {
    input: "a = 1\n[section]\nb = 2",
    expected: { a: "1", section: { b: "2" } },
  },
  { input: "; comment\na = 1", expected: { a: "1" } },
  { input: "a = 1\n; comment\nb = 2", expected: { a: "1", b: "2" } },
  { input: "[s.c]\nkey = v", expected: { "s.c": { key: "v" } } },
  { input: "a =\nb = 2", expected: { a: "", b: "2" } },
  { input: "[s1]\n[s2]\n[s1]\nkey = v", expected: { s1: { key: "v" }, s2: {} } },
  { input: "key with spaces = v", expected: { "key with spaces": "v" } },
] as const;

const unparsableCases = [
  { input: "= 1" },
  { input: "[" },
  { input: "[unclosed" },
  { input: "a = 1\n[" },
  { input: "no equals" },
  { input: "key value" },
] as const;

describe("parseIni", () => {
  for (const { input, expected } of successCases) {
    test(`parseIni('${input.replace(/\n/g, "\\n")}') returns the expected object`, () => {
      const parsed = parseIni(input);
      expect(parsed).toEqual(expected);
    });
  }

  for (const { input } of unparsableCases) {
    test(`parseIni('${input.replace(/\n/g, "\\n")}') throws a SyntaxError`, () => {
      expect(() => parseIni(input)).toThrow(SyntaxError);
    });
  }
});
