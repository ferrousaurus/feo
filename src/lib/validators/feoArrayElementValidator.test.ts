import { describe, expect, it } from "bun:test";
import z from "zod";
import feoArrayObjectValidator from "./feoArrayElementValidator";

const cases = [true, false, -1, 0, 1, [], {}];

describe("feoArrayElementValidator", () => {
  for (const content of cases) {
    const input = content;
    const expected = {
      $feo: {
        action: "add" as const,
        content,
      },
    };

    it(`validates \`${JSON.stringify(input)}\` into \`${JSON.stringify(expected)}\``, () => {
      const result = feoArrayObjectValidator.safeParse(content);
      expect(result.success).toEqual(true);
      if (result.success) {
        expect(result.data).toStrictEqual(expected);
      }
    });
  }

  for (const action of [undefined, "add", "remove"] as const) {
    for (const id of [undefined, "id"]) {
      for (const content of cases) {
        const input = { $feo: { action, content, id } };
        const expected = { $feo: { action: action ?? ("add" as const), content, id } };

        it(`validates \`${JSON.stringify(input)}\``, () => {
          const result = feoArrayObjectValidator.safeParse(input);
          expect(result.success).toEqual(true);
          if (result.success) {
            expect(result.data).toStrictEqual(expected);
          }
        });
      }

      for (const content of cases.filter((c) => z.record(z.string(), z.unknown()).safeParse(c).success)) {
        const input = { $feo: { action, id }, ...content };
        const expected = { $feo: { action: action ?? ("add" as const), id } };

        it(`validates \`${JSON.stringify(input)}\` into \`${JSON.stringify(expected)}\``, () => {
          const result = feoArrayObjectValidator.safeParse(input);
          expect(result.success).toEqual(true);
          if (result.success) {
            expect(result.data).toStrictEqual(expected);
          }
        });
      }
    }
  }
});
