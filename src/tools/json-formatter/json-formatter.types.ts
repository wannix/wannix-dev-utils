export type IndentStyle = "2-spaces" | "4-spaces" | "tabs";

export type ViewMode = "text" | "tree";

export type ParseMode = "strict" | "json5";

export interface ValidationError {
  message: string;
  line: number;
  column: number;
}

export interface TreeNode {
  key: string;
  value: unknown;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  path: string[];
  children: TreeNode[];
  collapsed: boolean;
}

export interface SearchMatch {
  path: string[];
  key?: string;
  value?: string;
}

export interface DuplicateKeyWarning {
  key: string;
  lines: number[];
}

export interface JsonPathResult {
  path: string;
  value: unknown;
}
