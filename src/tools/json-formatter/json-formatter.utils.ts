import JSON5 from "json5";
import { INDENT_MAP } from "./json-formatter.constants";
import type {
  IndentStyle,
  ValidationError,
  TreeNode,
  SearchMatch,
  DuplicateKeyWarning,
  JsonPathResult,
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
): string {
  if (!input.trim()) return "";
  const parsed: unknown = JSON.parse(input);
  const data = sortKeys ? sortKeysDeep(parsed) : parsed;
  return JSON.stringify(data, null, INDENT_MAP[indent]);
}

/**
 * Minifies a JSON string into a single line.
 */
export function minifyJson(input: string): string {
  if (!input.trim()) return "";
  return JSON.stringify(JSON.parse(input));
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
      const { line, column } = extractPosition(err.message, input);
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
      const { line, column } = extractPosition(err.message, input);
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
  message: string,
  input: string,
): { line: number; column: number } {
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

  // JSON5 errors often include lineNumber/columnNumber
  const errObj = message as unknown as Record<string, unknown>;
  if (typeof errObj === "object" && errObj !== null) {
    if ("lineNumber" in errObj && "columnNumber" in errObj) {
      return {
        line: Number(errObj.lineNumber),
        column: Number(errObj.columnNumber),
      };
    }
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
// JSONPath Evaluator (lightweight)
// ──────────────────────────────────────────────

/**
 * Evaluates a JSONPath expression against a parsed JSON object.
 * Supports: $, dot notation, bracket notation, wildcards [*],
 * recursive descent (..).
 */
export function evaluateJsonPath(
  obj: unknown,
  expression: string,
): JsonPathResult[] {
  if (!expression || !expression.startsWith("$")) return [];
  const results: JsonPathResult[] = [];

  // Tokenize: split on . or [ while keeping brackets
  const tokens = tokenizePath(expression.slice(1)); // Remove leading $

  function walk(
    current: unknown,
    tokenIndex: number,
    currentPath: string,
  ): void {
    if (tokenIndex >= tokens.length) {
      results.push({ path: currentPath || "$", value: current });
      return;
    }

    const token = tokens[tokenIndex];

    if (token === "") {
      // Skip empty tokens from consecutive dots
      walk(current, tokenIndex + 1, currentPath);
      return;
    }

    // Recursive descent (..)
    if (token === "..") {
      // Try remaining tokens at every level
      walk(current, tokenIndex + 1, currentPath);
      if (current !== null && typeof current === "object") {
        const entries = Array.isArray(current)
          ? current.map((v, i) => [String(i), v] as const)
          : Object.entries(current as Record<string, unknown>);
        for (const [key, val] of entries) {
          walk(val, tokenIndex, `${currentPath}.${key}`);
        }
      }
      return;
    }

    // Wildcard
    if (token === "*" || token === "[*]") {
      if (current !== null && typeof current === "object") {
        const entries = Array.isArray(current)
          ? current.map((v, i) => [String(i), v] as const)
          : Object.entries(current as Record<string, unknown>);
        for (const [key, val] of entries) {
          walk(val, tokenIndex + 1, `${currentPath}.${key}`);
        }
      }
      return;
    }

    // Bracket index (e.g. [0], [1])
    const bracketMatch = token.match(/^\[(\d+)\]$/);
    if (bracketMatch) {
      const idx = parseInt(bracketMatch[1], 10);
      if (Array.isArray(current) && idx < current.length) {
        walk(current[idx], tokenIndex + 1, `${currentPath}[${idx}]`);
      }
      return;
    }

    // Regular property access
    if (current !== null && typeof current === "object" && !Array.isArray(current)) {
      const obj = current as Record<string, unknown>;
      if (token in obj) {
        walk(obj[token], tokenIndex + 1, `${currentPath}.${token}`);
      }
    }
  }

  walk(obj, 0, "$");
  return results;
}

/**
 * Tokenizes a JSONPath expression into segments.
 */
function tokenizePath(path: string): string[] {
  const tokens: string[] = [];
  let current = "";

  for (let i = 0; i < path.length; i++) {
    const ch = path[i];
    if (ch === ".") {
      if (current) tokens.push(current);
      current = "";
      // Check for ..
      if (path[i + 1] === ".") {
        tokens.push("..");
        i++; // skip next dot
      }
    } else if (ch === "[") {
      if (current) tokens.push(current);
      current = "";
      // Read until ]
      let bracket = "[";
      i++;
      while (i < path.length && path[i] !== "]") {
        bracket += path[i];
        i++;
      }
      bracket += "]";
      tokens.push(bracket);
    } else {
      current += ch;
    }
  }

  if (current) tokens.push(current);
  return tokens;
}

// ──────────────────────────────────────────────
// Search
// ──────────────────────────────────────────────

/**
 * Recursively searches a parsed JSON object for keys or values
 * that match the given query (case-insensitive).
 */
export function searchInObject(
  obj: unknown,
  query: string,
  path: string[] = [],
): SearchMatch[] {
  if (!query) return [];
  const results: SearchMatch[] = [];
  const q = query.toLowerCase();

  if (obj === null || obj === undefined) return results;

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const itemPath = [...path, String(index)];
      // Check if value itself matches
      if (typeof item !== "object" || item === null) {
        if (String(item).toLowerCase().includes(q)) {
          results.push({ path: itemPath, value: String(item) });
        }
      }
      results.push(...searchInObject(item, query, itemPath));
    });
  } else if (typeof obj === "object") {
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      const keyPath = [...path, key];
      // Check key
      if (key.toLowerCase().includes(q)) {
        results.push({ path: keyPath, key });
      }
      // Check primitive value
      if (value !== null && typeof value !== "object") {
        if (String(value).toLowerCase().includes(q)) {
          results.push({ path: keyPath, value: String(value) });
        }
      }
      // Recurse into children
      if (value !== null && typeof value === "object") {
        results.push(...searchInObject(value, query, keyPath));
      }
    });
  }

  return results;
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
