import type { FeoConfig } from "#/data/feoConfig";
import { createContext } from "react";

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
