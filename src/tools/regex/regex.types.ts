export interface RegexFlag {
    key: string
    label: string
    description: string
}

export interface RegexPreset {
    label: string
    pattern: string
    flags: string
}

export interface RegexMatch {
    value: string
    index: number
    groups?: Record<string, string>
}
