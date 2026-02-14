import { format, formatDistanceToNow, isValid, fromUnixTime } from "date-fns";
import type { TimestampResult } from "./timestamp.types";

/**
 * Parses a timestamp string into a Date object.
 * Supports Unix seconds, Unix milliseconds, ISO 8601, and other date string formats.
 * Automatically detects seconds vs milliseconds based on digit count.
 * @param input - The timestamp string or date string to parse
 * @returns A Date object if parsing succeeds, or null if the input is invalid
 */
export function parseTimestamp(input: string): Date | null {
  if (!input) return null;

  // Try parsing as number (Unix timestamp)
  const num = Number(input);
  if (!isNaN(num)) {
    // Guess if seconds or milliseconds based on length
    // Unix timestamp for 2000-01-01 is ~946684800 (10 digits)
    // Unix ms for 2000-01-01 is ~946684800000 (13 digits)
    // If < 12 digits, treat as seconds. If >= 12, treat as ms.
    if (input.length < 12) {
      return fromUnixTime(num);
    } else {
      return new Date(num);
    }
  }

  // Try parsing as ISO string or other date string
  const date = new Date(input);
  if (isValid(date)) {
    return date;
  }

  return null;
}

/**
 * Generates a comprehensive set of formatted representations for a given Date.
 * Includes Unix seconds, milliseconds, ISO 8601, UTC, local, and relative time.
 * @param date - The Date object to format
 * @returns A TimestampResult with all format variations
 */
export function generateTimestampResult(date: Date): TimestampResult {
  return {
    unixSeconds: Math.floor(date.getTime() / 1000),
    unixMs: date.getTime(),
    iso8601: date.toISOString(),
    utc: date.toUTCString(),
    local: format(date, "dd/MM/yyyy, HH:mm:ss"),
    relative: formatDistanceToNow(date, { addSuffix: true }),
  };
}
