// App constants
export const APP_NAME = "Dev Utilities Hub" as const;
export const APP_VERSION = "0.1.0" as const;

// Tool categories
export const TOOL_CATEGORIES = {
  ENCODER: "encoder",
  GENERATOR: "generator",
  PARSER: "parser",
  CONVERTER: "converter",
  FORMATTER: "formatter",
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  THEME: "dev-utils-theme",
  FAVORITES: "dev-utils-favorites",
  HISTORY: "dev-utils-history",
} as const;
