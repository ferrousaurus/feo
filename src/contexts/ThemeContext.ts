import { createContext } from "react";

import type { FeoConfig } from "#/data/feoConfig";

type ThemeContext = FeoConfig["settings"]["theme"];

const ThemeContext = createContext<ThemeContext>({
  inactive: "orange",
  active: "cyan",
  success: "green",
  info: "blue",
  warning: "yellow",
  error: "red",
});

export default ThemeContext;
