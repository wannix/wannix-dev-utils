import type { Change } from 'diff'

export type DiffMode = 'chars' | 'words' | 'lines' | 'json'

export interface DiffResult {
    changes: Change[]
    original: string
    modified: string
}
