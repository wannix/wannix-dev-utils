import * as Diff from "diff";
import type { DiffMode } from "./diff.types";

/**
 * Computes the diff between two text inputs using the specified comparison mode.
 * @param text1 - The original text
 * @param text2 - The modified text
 * @param mode - The diff algorithm: 'chars', 'words', 'lines', or 'json'
 * @returns An array of Change objects representing additions, deletions, and unchanged segments
 */
export function computeDiff(
  text1: string,
  text2: string,
  mode: DiffMode,
): Diff.Change[] {
  if (!text1 && !text2) return [];

  try {
    switch (mode) {
      case "chars":
        return Diff.diffChars(text1, text2);
      case "words":
        return Diff.diffWords(text1, text2);
      case "lines":
        return Diff.diffLines(text1, text2);
      case "json":
        return Diff.diffJson(
          JSON.parse(text1 || "{}"),
          JSON.parse(text2 || "{}"),
        );
      default:
        return Diff.diffChars(text1, text2);
    }
  } catch (error) {
    console.error("Diff computation failed:", error);
    // Fallback or return empty array on error
    return [];
  }
}
