export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "productpass-theme";
export const DEFAULT_THEME: Theme = "dark";

export function resolveTheme(stored: string | null): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return DEFAULT_THEME;
}
