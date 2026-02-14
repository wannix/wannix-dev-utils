import { format, formatDistanceToNow, isValid, fromUnixTime } from 'date-fns'
import type { TimestampResult } from './timestamp.types'

export function parseTimestamp(input: string): Date | null {
    if (!input) return null

    // Try parsing as number (Unix timestamp)
    const num = Number(input)
    if (!isNaN(num)) {
        // Guess if seconds or milliseconds based on length
        // Unix timestamp for 2000-01-01 is ~946684800 (10 digits)
        // Unix ms for 2000-01-01 is ~946684800000 (13 digits)
        // If < 12 digits, treat as seconds. If >= 12, treat as ms.
        if (input.length < 12) {
            return fromUnixTime(num)
        } else {
            return new Date(num)
        }
    }

    // Try parsing as ISO string or other date string
    const date = new Date(input)
    if (isValid(date)) {
        return date
    }

    return null
}

export function generateTimestampResult(date: Date): TimestampResult {
    return {
        unixSeconds: Math.floor(date.getTime() / 1000),
        unixMs: date.getTime(),
        iso8601: date.toISOString(),
        utc: date.toUTCString(),
        local: format(date, 'dd/MM/yyyy, HH:mm:ss'),
        relative: formatDistanceToNow(date, { addSuffix: true })
    }
}
