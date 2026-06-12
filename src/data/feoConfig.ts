import { z } from "zod/mini";

const feoConfigValidator = z.object({
  settings: z.object({
    previewFormat: z.enum([".json", ".yaml", ".toml"]),
  }),
  configs: z.record(
    z.string(),
    z.object({
      targets: z.record(
        z.string(),
        z.object({
          sources: z.array(z.string()),
        }),
      ),
    }),
  ),
});

export type FeoConfig = z.infer<typeof feoConfigValidator>;

export default feoConfigValidator;
