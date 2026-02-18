export interface RegexMatch {
  match: string;
  index: number;
  groups?: { [key: string]: string };
}

export interface RegexResult {
  isValid: boolean;
  error?: string;
  matches?: RegexMatch[];
  matchCount?: number;
}

export interface RegexFlags {
  global: boolean;
  caseInsensitive: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
}

export function testRegex(
  pattern: string,
  testString: string,
  flags: RegexFlags
): RegexResult {
  if (!pattern) {
    return { isValid: true, matches: [], matchCount: 0 };
  }

  try {
    let flagString = '';
    if (flags.global) flagString += 'g';
    if (flags.caseInsensitive) flagString += 'i';
    if (flags.multiline) flagString += 'm';
    if (flags.dotAll) flagString += 's';
    if (flags.unicode) flagString += 'u';

    const regex = new RegExp(pattern, flagString);
    const matches: RegexMatch[] = [];

    if (flags.global) {
      let match;
      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups,
        });
        // Prevent infinite loop for zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups,
        });
      }
    }

    return {
      isValid: true,
      matches,
      matchCount: matches.length,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid regex pattern',
    };
  }
}

export function highlightMatches(text: string, matches: RegexMatch[]): string {
  if (!matches.length) return text;

  // Sort matches by index (descending) to replace from end to start
  const sortedMatches = [...matches].sort((a, b) => b.index - a.index);
  
  let result = text;
  for (const match of sortedMatches) {
    const before = result.slice(0, match.index);
    const after = result.slice(match.index + match.match.length);
    result = before + `<mark class="bg-primary/30 text-primary-foreground">${match.match}</mark>` + after;
  }
  
  return result;
}

export const commonPatterns = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&\'()*+,;=%]+' },
  { name: 'IPv4 Address', pattern: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b' },
  { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])' },
  { name: 'Time (HH:MM)', pattern: '(?:[01]?[0-9]|2[0-3]):[0-5][0-9]' },
  { name: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b' },
  { name: 'UUID', pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}' },
];
