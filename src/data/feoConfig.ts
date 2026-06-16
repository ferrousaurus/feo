import { z } from "zod/mini";

export const sourceValidator = z.object({
  path: z.string(),
});

export type Source = z.infer<typeof sourceValidator>;

const feoConfigValidator = z.object({
  settings: z.object({}),
  configs: z.record(
    z.string(),
    z.object({
      targets: z.record(
        z.string(),
        z.object({
          sources: z.array(
            z.pipe(
              z.union([z.string(), sourceValidator]),
              z.transform((s) => (typeof s === "string" ? sourceValidator.parse({ path: s }) : s)),
            ),
          ),
        }),
      ),
    }),
  ),
});

export type FeoConfig = z.infer<typeof feoConfigValidator>;

export default feoConfigValidator;
