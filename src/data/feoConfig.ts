import { z } from "zod/mini";

export const sourceValidator = z.object({
  path: z.string(),
});

export type FeoSource = z.infer<typeof sourceValidator>;

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
      refresh: ["r"],
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
          refresh: z.prefault(keymapValidator, defaultConfig.settings.keymap.refresh),
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
  configs: z.record(
    z.string(),
    z.object({
      targets: z.record(
        z.string(),
        z.object({
          sources: z.array(sourceValidator),
        }),
      ),
    }),
  ),
});

export type FeoConfig = z.infer<typeof feoConfigValidator>;

export default feoConfigValidator;
