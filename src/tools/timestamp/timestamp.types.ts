export interface TimestampResult {
    unixSeconds: number
    unixMs: number
    iso8601: string
    utc: string
    local: string
    relative: string
}

export interface TimestampState {
    input: string
    result: TimestampResult | null
    error: string | null
}
