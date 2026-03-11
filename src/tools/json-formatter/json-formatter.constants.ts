import type { IndentStyle } from "./json-formatter.types";

export const DEFAULT_INDENT: IndentStyle = "2-spaces";

export const MAX_INPUT_LENGTH = 1_000_000; // 1MB of text

export const PLACEHOLDER_JSON = `{
  "name": "example",
  "version": "1.0.0",
  "features": ["formatting", "validation", "search"],
  "nested": {
    "enabled": true,
    "count": 42
  }
}`;

export const INDENT_MAP: Record<IndentStyle, string | number> = {
  "2-spaces": 2,
  "4-spaces": 4,
  tabs: "\t",
};

export const INDENT_LABELS: Record<IndentStyle, string> = {
  "2-spaces": "2 Spaces",
  "4-spaces": "4 Spaces",
  tabs: "Tabs",
};
