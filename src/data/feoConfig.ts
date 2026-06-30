import path from "node:path";

import { z } from "zod/mini";

import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import { supportedMediaTypeSchema } from "#/lib/config/mediaTypes";

const inlineSourceValidator = z.object({
  data: z.record(z.string(), z.json()),
});

const localSourceValidator = z.pipe(
  z.object({
    path: z.string(),
    mediaType: z.optional(supportedMediaTypeSchema),
    templatingLanguage: z.optional(z.enum(["liquid"])),
    vars: z.optional(z.record(z.string(), z.json())),
  }),
  z.transform(({ mediaType, vars, ...rest }) => {
    const parsedExt = supportedExtensionSchema.safeParse(path.parse(rest.path).ext);
    const resolvedMediaType = mediaType ?? (parsedExt.success ? filetypes[parsedExt.data].mediaType : undefined);
    return {
      ...(resolvedMediaType === undefined ? {} : { mediaType: resolvedMediaType }),
      vars: vars ?? {},
      ...rest,
    };
  }),
);

const remoteSourceValidator = z.pipe(
  z.object({
    url: z.url(),
    mediaType: z.optional(supportedMediaTypeSchema),
    templatingLanguage: z.optional(z.enum(["liquid"])),
    vars: z.optional(z.record(z.string(), z.json())),
  }),
  z.transform(({ mediaType, vars, ...rest }) => {
    const parsedExt = supportedExtensionSchema.safeParse(path.parse(rest.url).ext);
    const resolvedMediaType = mediaType ?? (parsedExt.success ? filetypes[parsedExt.data].mediaType : undefined);
    return {
      ...(resolvedMediaType === undefined ? {} : { mediaType: resolvedMediaType }),
      vars: vars ?? {},
      ...rest,
    };
  }),
);

export const sourceValidator = z.union([inlineSourceValidator, localSourceValidator, remoteSourceValidator]);

export type FeoSource = z.infer<typeof sourceValidator>;

export const targetValidator = z.object({
  path: z.string(),
  sources: z.array(sourceValidator),
});

export const applicationValidator = z.object({
  targets: z.record(z.string(), targetValidator),
});

const keymapValidator = z.pipe(
  z.union([z.array(z.string()), z.string()]),
  z.transform((p) => (typeof p === "string" ? [p] : p)),
);

const defaultConfig = {
  settings: {
    keymap: {
      cancel: ["escape"],
      confirm: ["return"],
      delete: ["d"],
      down: ["j", "down"],
      move: ["m"],
      new: ["n"],
      scrollDown: ["]"],
      scrollUp: "[",
      up: ["k", "up"],
      write: ["w"],
    },
    theme: {
      inactive: "orange",
      active: "cyan",
      success: "green",
      info: "blue",
      warning: "yellow",
      error: "red",
    },
  },
};

const feoConfigValidator = z.object({
  settings: z.prefault(
    z.object({
      keymap: z.prefault(
        z.object({
          cancel: z.prefault(keymapValidator, defaultConfig.settings.keymap.cancel),
          confirm: z.prefault(keymapValidator, defaultConfig.settings.keymap.confirm),
          delete: z.prefault(keymapValidator, defaultConfig.settings.keymap.delete),
          down: z.prefault(keymapValidator, defaultConfig.settings.keymap.down),
          move: z.prefault(keymapValidator, defaultConfig.settings.keymap.move),
          new: z.prefault(keymapValidator, defaultConfig.settings.keymap.new),
          scrollDown: z.prefault(keymapValidator, defaultConfig.settings.keymap.scrollDown),
          scrollUp: z.prefault(keymapValidator, defaultConfig.settings.keymap.scrollUp),
          up: z.prefault(keymapValidator, defaultConfig.settings.keymap.up),
          write: z.prefault(keymapValidator, defaultConfig.settings.keymap.write),
        }),
        defaultConfig.settings.keymap,
      ),
      theme: z.prefault(
        z.object({
          inactive: z.prefault(z.string(), defaultConfig.settings.theme.inactive),
          active: z.prefault(z.string(), defaultConfig.settings.theme.active),
          success: z.prefault(z.string(), defaultConfig.settings.theme.success),
          info: z.prefault(z.string(), defaultConfig.settings.theme.info),
          warning: z.prefault(z.string(), defaultConfig.settings.theme.warning),
          error: z.prefault(z.string(), defaultConfig.settings.theme.error),
        }),
        defaultConfig.settings.theme,
      ),
    }),
    {
      keymap: defaultConfig.settings.keymap,
      theme: defaultConfig.settings.theme,
    },
  ),
  applications: z.record(z.string(), applicationValidator),
});

export type FeoConfig = z.infer<typeof feoConfigValidator>;

export default feoConfigValidator;
