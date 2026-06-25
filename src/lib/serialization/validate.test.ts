import { isDeepStrictEqual } from "node:util";

import { describe, expect, test } from "vitest";

import { serializableValidator } from "./util";

const testValues = [
  -1,
  1,
  "A",
  true,
  false,
  null,
  [],
  [1],
  ["A"],
  [true],
  [false],
  [null],
  [{}],
  [[]],
  [[-1]],
  [[1]],
  [["A"]],
  [[true]],
  [[false]],
  [[null]],
];

const successCases = [{}, ...testValues.map((v) => ({ key: v }))] as const;

const errorCases = [...testValues, testValues] as const;

describe("serializableValidator", () => {
  for (const successCase of successCases) {
    test(`${JSON.stringify(successCase)} passes validation.`, () => {
      const parsed = serializableValidator.safeParse(successCase);
      expect(parsed.success).toBeTruthy();
      expect(isDeepStrictEqual(parsed.data, successCase)).toBeTruthy();
    });
  }

  for (const errorCase of errorCases) {
    test(`${JSON.stringify(errorCases)} does not pass validation.`, () => {
      const parsed = serializableValidator.safeParse(errorCase);
      expect(parsed.success).toBeFalsy();
    });
  }
});
