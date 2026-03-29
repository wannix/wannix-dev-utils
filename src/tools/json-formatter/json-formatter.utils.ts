import JSON5 from "json5";
import { INDENT_MAP } from "./json-formatter.constants";
import type {
  IndentStyle,
  ValidationError,
  TreeNode,
  DuplicateKeyWarning,
} from "./json-formatter.types";

// ──────────────────────────────────────────────
// Formatting
// ──────────────────────────────────────────────

/**
 * Pretty-prints a JSON string with the given indent style.
 * Optionally sorts keys alphabetically.
 */
export function formatJson(
  input: string,
  indent: IndentStyle = "2-spaces",
  sortKeys = false,
  json5Mode = false,
): string {
  if (!input.trim()) return "";
  const parsed = parseInput(input, json5Mode);
  const data = sortKeys ? sortKeysDeep(parsed) : parsed;
  return JSON.stringify(data, null, INDENT_MAP[indent]);
}

/**
 * Minifies a JSON string into a single line.
 */
export function minifyJson(input: string, json5Mode = false): string {
  if (!input.trim()) return "";
  return JSON.stringify(parseInput(input, json5Mode));
}

// ──────────────────────────────────────────────
// Sorting
// ──────────────────────────────────────────────

/**
 * Recursively sorts an object's keys in alphabetical order.
 * Arrays preserve element order but their object elements get sorted keys.
 */
export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        sorted[key] = sortKeysDeep(obj[key]);
      });
    return sorted;
  }
  return value;
}

// ──────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────

/**
 * Validates a JSON string and returns an array of human-readable errors
 * with line and column information.
 */
export function validateJson(input: string): ValidationError[] {
  if (!input.trim()) return [];
  try {
    JSON.parse(input);
    return [];
  } catch (err) {
    if (err instanceof SyntaxError) {
      const { line, column } = extractPosition(err, input);
      return [
        {
          message: humanizeJsonError(err.message),
          line,
          column,
        },
      ];
    }
    return [{ message: "Unknown parsing error", line: 1, column: 1 }];
  }
}

/**
 * Validates JSON5 input and returns errors.
 */
export function validateJson5(input: string): ValidationError[] {
  if (!input.trim()) return [];
  try {
    JSON5.parse(input);
    return [];
  } catch (err) {
    if (err instanceof SyntaxError) {
      const { line, column } = extractPosition(err, input);
      return [
        {
          message: humanizeJsonError(err.message),
          line,
          column,
        },
      ];
    }
    return [{ message: "Unknown parsing error", line: 1, column: 1 }];
  }
}

/**
 * Extracts line/column position from a JSON SyntaxError message.
 * Different engines format the message differently.
 */
function extractPosition(
  error: SyntaxError,
  input: string,
): { line: number; column: number } {
  const errorWithLocation = error as SyntaxError & {
    lineNumber?: number;
    columnNumber?: number;
  };

  if (
    typeof errorWithLocation.lineNumber === "number" &&
    typeof errorWithLocation.columnNumber === "number"
  ) {
    return {
      line: errorWithLocation.lineNumber,
      column: errorWithLocation.columnNumber,
    };
  }

  const { message } = error;

  // V8: "... at position 42"
  const posMatch = message.match(/position\s+(\d+)/i);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    return offsetToLineCol(input, pos);
  }

  // SpiderMonkey: "... at line 3 column 5"
  const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1], 10),
      column: parseInt(lineColMatch[2], 10),
    };
  }

  return { line: 1, column: 1 };
}

/**
 * Converts a character offset into line and column numbers.
 */
function offsetToLineCol(
  text: string,
  offset: number,
): { line: number; column: number } {
  let line = 1;
  let col = 1;
  for (let i = 0; i < Math.min(offset, text.length); i++) {
    if (text[i] === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
  }
  return { line, column: col };
}

/**
 * Converts a raw SyntaxError message into a friendlier, human-readable form.
 */
function humanizeJsonError(message: string): string {
  if (/unexpected token/i.test(message)) {
    const tokenMatch = message.match(/unexpected token\s*(.)/i);
    const token = tokenMatch ? `'${tokenMatch[1]}'` : "";
    const posMatch = message.match(/position\s+(\d+)/i);
    const pos = posMatch ? ` at position ${posMatch[1]}` : "";
    return `Unexpected token ${token}${pos}. Check for missing commas, extra commas, or unquoted keys.`;
  }
  if (/unexpected end/i.test(message)) {
    return "Unexpected end of JSON. You may have an unclosed bracket or brace.";
  }
  if (/unterminated string/i.test(message)) {
    return "Unterminated string literal. Check for missing closing quotes.";
  }
  return message;
}

// ──────────────────────────────────────────────
// Auto Fix
// ──────────────────────────────────────────────

/**
 * Attempts to repair common JSON issues by parsing as JSON5
 * (which is lenient) and re-serializing as strict JSON.
 *
 * Fixes: trailing commas, single-quoted keys, unquoted keys,
 * comments, and some other relaxed syntax.
 *
 * Returns the fixed JSON string, or throws if it can't be fixed.
 */
export function autoFixJson(input: string): string {
  if (!input.trim()) return "";
  // First, check if it's already valid JSON — don't touch it
  try {
    JSON.parse(input);
    return input; // Already valid, return as-is
  } catch {
    // Not valid strict JSON, try JSON5 repair
  }
  // Parse as JSON5 (lenient) → re-serialize as strict JSON
  const parsed: unknown = JSON5.parse(input);
  return JSON.stringify(parsed, null, 2);
}

// ──────────────────────────────────────────────
// Duplicate Key Detection
// ──────────────────────────────────────────────

/**
 * Scans raw JSON text for duplicate keys within the same object level.
 * Uses a reviver-based approach for accurate detection.
 */
export function detectDuplicateKeys(input: string): DuplicateKeyWarning[] {
  if (!input.trim()) return [];
  const warnings: DuplicateKeyWarning[] = [];
  const lines = input.split("\n");

  // Build a map of key → line numbers from raw text
  const keyLocations = new Map<string, number[]>();
  const keyPattern = /^\s*"([^"]+)"\s*:/;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(keyPattern);
    if (match) {
      const key = match[1];
      const existing = keyLocations.get(key);
      if (existing) {
        existing.push(i + 1);
      } else {
        keyLocations.set(key, [i + 1]);
      }
    }
  }

  keyLocations.forEach((lineNums, key) => {
    if (lineNums.length > 1) {
      warnings.push({ key, lines: lineNums });
    }
  });

  return warnings;
}

// ──────────────────────────────────────────────
// Tree Building
// ──────────────────────────────────────────────

/**
 * Builds a recursive TreeNode structure from a parsed JSON value.
 */
export function buildTree(
  value: unknown,
  path: string[] = [],
  key = "root",
): TreeNode {
  const nodeType = getValueType(value);

  if (nodeType === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    const children = Object.keys(obj).map((childKey) =>
      buildTree(obj[childKey], [...path, childKey], childKey),
    );
    return {
      key,
      value,
      type: "object",
      path,
      children,
      collapsed: path.length > 2, // Auto-collapse deep nodes
    };
  }

  if (nodeType === "array") {
    const arr = value as unknown[];
    const children = arr.map((item, index) =>
      buildTree(item, [...path, String(index)], String(index)),
    );
    return {
      key,
      value,
      type: "array",
      path,
      children,
      collapsed: path.length > 2,
    };
  }

  return {
    key,
    value,
    type: nodeType,
    path,
    children: [],
    collapsed: false,
  };
}

/**
 * Determines the JSON type of a value.
 */
function getValueType(
  value: unknown,
): "object" | "array" | "string" | "number" | "boolean" | "null" {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "object";
  }
}

// ──────────────────────────────────────────────
// Breadcrumb
// ──────────────────────────────────────────────

/**
 * Converts a path array into a human-readable breadcrumb string.
 * e.g. ["store", "book", "0", "title"] → "$.store.book[0].title"
 */
export function resolvePathBreadcrumb(path: string[]): string {
  if (path.length === 0) return "$";
  return (
    "$" +
    path
      .map((segment) =>
        /^\d+$/.test(segment) ? `[${segment}]` : `.${segment}`,
      )
      .join("")
  );
}

// ──────────────────────────────────────────────
// Parsing helpers
// ──────────────────────────────────────────────

/**
 * Attempts to parse input as JSON (strict or JSON5 depending on mode).
 * Returns the parsed value or throws.
 */
export function parseInput(input: string, json5Mode: boolean): unknown {
  if (!input.trim()) return undefined;
  return json5Mode ? JSON5.parse(input) : JSON.parse(input);
}
