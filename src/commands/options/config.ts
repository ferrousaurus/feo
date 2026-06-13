const configOption = {
  flags: "-c, --config <config:string>",
  desc: "The configuration file to load",
  opts: {
    default: "${HOME}/.config/feo/config.toml",
  },
} as const;

export default configOption;
