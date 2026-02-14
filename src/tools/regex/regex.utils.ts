import type { RegexFlag, RegexPreset, RegexMatch } from "./regex.types";

export const FLAGS: RegexFlag[] = [
  { key: "g", label: "Global", description: "Find all matches" },
  {
    key: "i",
    label: "Case Insensitive",
    description: "Case-insensitive matching",
  },
  {
    key: "m",
    label: "Multiline",
    description: "^ and $ match line boundaries",
  },
  { key: "s", label: "Dot All", description: ". matches newlines" },
  { key: "u", label: "Unicode", description: "Unicode property support" },
];

export const PRESETS: RegexPreset[] = [
  {
    label: "Email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "gi",
  },
  {
    label: "URL",
    pattern: "https?:\\/\\/[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+",
    flags: "gi",
  },
  {
    label: "Phone (NZ)",
    pattern: "(?:\\+64|0)(?:2[0-9]|3|4|6|7|9)\\d{6,8}",
    flags: "g",
  },
  {
    label: "Date (YYYY-MM-DD)",
    pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",
    flags: "g",
  },
  {
    label: "IPv4",
    pattern:
      "(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)",
    flags: "g",
  },
  { label: "Hex Color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}", flags: "gi" },
];

/**
 * Finds all matches of a regex pattern within the test string.
 * Includes safety limit of 10,000 iterations to prevent infinite loops.
 * @param pattern - The regular expression pattern string
 * @param flags - Regex flags string (e.g. 'gi', 'gm')
 * @param testString - The string to search within
 * @returns Object containing the array of matches and an optional error message
 */
export function findMatches(
  pattern: string,
  flags: string,
  testString: string,
): { matches: RegexMatch[]; error?: string } {
  if (!pattern || !testString) return { matches: [] };

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];

    if (flags.includes("g")) {
      let match: RegExpExecArray | null;
      let safety = 0;
      while ((match = regex.exec(testString)) !== null && safety < 10000) {
        matches.push({
          value: match[0],
          index: match.index,
          groups: match.groups ? { ...match.groups } : undefined,
        });
        if (match[0].length === 0) regex.lastIndex++;
        safety++;
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        matches.push({
          value: match[0],
          index: match.index,
          groups: match.groups ? { ...match.groups } : undefined,
        });
      }
    }

    return { matches };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid regex";
    return { matches: [], error: message };
  }
}
