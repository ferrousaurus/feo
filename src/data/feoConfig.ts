import npath from "node:path";

import { z } from "zod";

import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import { supportedMediaTypeSchema } from "#/lib/config/mediaTypes";
import resolvePath from "#/lib/fs/resolvePath";
import entries from "#/lib/object/entries";

const templateValidator = z.object({
  language: z.enum(["liquid"]).optional(),
  vars: z.record(z.string(), z.json()).optional(),
});

const inlineSourceValidator = z.object({
  data: z.record(z.string(), z.json()),
});

const localSourceValidator = z
  .object({
    path: z.string(),
    mediaType: supportedMediaTypeSchema.optional(),
    template: templateValidator.optional(),
  })
  .transform(({ mediaType, path, ...rest }) => {
    const parsedExt = supportedExtensionSchema.safeParse(npath.parse(path).ext);
    const resolvedMediaType = mediaType ?? (parsedExt.success ? filetypes[parsedExt.data].mediaType : undefined);
    return {
      path: resolvePath(path),
      ...(resolvedMediaType === undefined ? {} : { mediaType: resolvedMediaType }),
      ...rest,
    };
  });

const remoteSourceValidator = z
  .object({
    url: z.url(),
    mediaType: supportedMediaTypeSchema.optional(),
    template: templateValidator.optional(),
  })
  .transform(({ mediaType, ...rest }) => {
    const parsedExt = supportedExtensionSchema.safeParse(npath.parse(rest.url).ext);
    const resolvedMediaType = mediaType ?? (parsedExt.success ? filetypes[parsedExt.data].mediaType : undefined);
    return {
      ...(resolvedMediaType === undefined ? {} : { mediaType: resolvedMediaType }),
      ...rest,
    };
  });

export const sourceValidator = z.union([inlineSourceValidator, localSourceValidator, remoteSourceValidator]);

export type FeoSource = z.infer<typeof sourceValidator>;

export const targetValidator = z
  .object({
    path: z.string(),
    sources: z.array(sourceValidator),
    mediaType: supportedMediaTypeSchema.optional(),
    template: z
      .object({
        vars: z.record(z.string(), z.json()),
      })
      .prefault({ vars: {} }),
  })
  .transform(({ sources, template, mediaType, path, ...rest }) => ({
    ...rest,
    path: resolvePath(path),
    template,
    mediaType: mediaType ?? filetypes[supportedExtensionSchema.parse(npath.parse(path).ext)].mediaType,
    sources: sources.map((s) =>
      "template" in s ? { ...s, template: { ...s.template, vars: { ...template.vars, ...s.template?.vars } } } : s,
    ),
  }));

export const applicationValidator = z
  .object({
    targets: z.record(z.string(), targetValidator),
    template: z
      .object({
        vars: z.record(z.string(), z.json()),
      })
      .prefault({ vars: {} }),
  })
  .transform(({ targets, template: appTemplate, ...rest }) => ({
    ...rest,
    template: appTemplate,
    targets: Object.fromEntries(
      entries(targets).map(
        ([name, { sources, template: targetTemplate, ...rest }]) =>
          [
            name,
            {
              ...rest,
              template: targetTemplate,
              sources: sources.map((s) =>
                "template" in s
                  ? {
                      ...s,
                      template: {
                        ...s.template,
                        vars: { ...appTemplate.vars, ...targetTemplate.vars, ...s.template?.vars },
                      },
                    }
                  : s,
              ),
            },
          ] as const,
      ),
    ),
  }));

const keymapValidator = z.union([z.array(z.string()), z.string()]).transform((p) => (typeof p === "string" ? [p] : p));

const defaultConfig = {
  applications: {},
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

const feoConfigValidator = z
  .object({
    settings: z
      .object({
        keymap: z
          .object({
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
          })
          .prefault(defaultConfig.settings.keymap),
        theme: z
          .object({
            inactive: z.string().prefault(defaultConfig.settings.theme.inactive),
            active: z.string().prefault(defaultConfig.settings.theme.active),
            success: z.string().prefault(defaultConfig.settings.theme.success),
            info: z.string().prefault(defaultConfig.settings.theme.info),
            warning: z.string().prefault(defaultConfig.settings.theme.warning),
            error: z.string().prefault(defaultConfig.settings.theme.error),
          })
          .prefault(defaultConfig.settings.theme),
      })
      .prefault(defaultConfig.settings),
    applications: z.record(z.string(), applicationValidator).prefault(defaultConfig.applications),
  })
  .prefault(defaultConfig);

export type FeoConfig = z.infer<typeof feoConfigValidator>;

export default feoConfigValidator;
