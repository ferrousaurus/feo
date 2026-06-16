import { z } from "zod/mini";

export const sourceValidator = z.object({
  path: z.string(),
});

export type Source = z.infer<typeof sourceValidator>;

const feoConfigValidator = z.object({
  settings: z.object({
    theme: z.prefault(
      z.object({
        inactive: z.prefault(z.string(), "orange"),
        active: z.prefault(z.string(), "cyan"),
        success: z.prefault(z.string(), "green"),
        info: z.prefault(z.string(), "blue"),
        warning: z.prefault(z.string(), "yellow"),
        error: z.prefault(z.string(), "red"),
      }),
      {
        inactive: "orange",
        active: "cyan",
        success: "green",
        info: "blue",
        warning: "yellow",
        error: "red",
      },
    ),
  }),
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
