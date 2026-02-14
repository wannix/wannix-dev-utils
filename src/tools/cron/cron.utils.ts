import { Cron } from 'croner'
import cronstrue from 'cronstrue'
import type { CronResult, CronExample } from './cron.types'

export const EXAMPLES: CronExample[] = [
    // Standard 5-field
    { label: 'Every minute', expression: '* * * * *' },
    { label: 'Every 5 minutes', expression: '*/5 * * * *' },
    { label: 'Every hour', expression: '0 * * * *' },
    { label: 'Every day at midnight', expression: '0 0 * * *' },
    { label: 'Weekdays at 9 AM', expression: '0 9 * * 1-5' },
    // 6-field (with seconds)
    { label: 'Every 30 seconds', expression: '*/30 * * * * *' },
    // 7-field Quartz
    { label: 'Last weekday of month', expression: '0 0 12 LW * ? *' },
    { label: 'Nearest weekday to 15th', expression: '0 0 9 15W * ? *' },
    { label: 'Last day of month', expression: '0 0 0 L * ? *' },
    { label: '3 days before last day', expression: '0 0 12 L-3 * ? *' },
]

function getNextRunsWithCroner(expression: string): string[] {
    try {
        const job = new Cron(expression, { legacyMode: false })
        const runs: string[] = []
        let d: Date | undefined = undefined
        for (let i = 0; i < 5; i++) {
            d = job.nextRun(d) ?? undefined
            if (d) {
                runs.push(d.toISOString())
                d = new Date(d.getTime() + 1000)
            } else {
                break
            }
        }
        return runs
    } catch {
        return []
    }
}

export function parseCron(expression: string): CronResult {
    if (!expression.trim()) {
        return { isValid: false, nextRuns: [] }
    }

    // Use cronstrue for validation and description (Quartz-aware)
    let description = ''
    try {
        description = cronstrue.toString(expression, {
            use24HourTimeFormat: false,
            throwExceptionOnParseError: true,
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        return {
            isValid: false,
            nextRuns: [],
            error: message,
        }
    }

    // Use croner for next runs (best-effort, may not support all Quartz features)
    const nextRuns = getNextRunsWithCroner(expression)

    return {
        isValid: true,
        description,
        nextRuns,
    }
}
