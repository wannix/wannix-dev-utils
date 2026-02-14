export interface CronExample {
    label: string
    expression: string
}

export interface CronResult {
    isValid: boolean
    description?: string
    nextRuns: string[]
    error?: string
}
