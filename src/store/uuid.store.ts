import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UuidHistoryItem {
    id: string
    value: string
    rawValue: string // Full content for copying
    timestamp: number
    type: 'uuid-v4' | 'ulid' | 'ksuid'
    format: {
        hyphens: boolean
        uppercase: boolean
        braces: boolean
    }
}

interface UuidState {
    history: UuidHistoryItem[]
    addToHistory: (value: string, rawValue: string, type: UuidHistoryItem['type'], format: UuidHistoryItem['format']) => void
    clearHistory: () => void
}

export const useUuidStore = create<UuidState>()(
    persist(
        (set) => ({
            history: [],
            addToHistory: (value, rawValue, type, format) => set((state) => {
                const newItem: UuidHistoryItem = {
                    id: crypto.randomUUID(),
                    value,
                    rawValue,
                    timestamp: Date.now(),
                    type,
                    format
                }
                // Keep last 10 items, new ones at the top
                const newHistory = [newItem, ...state.history].slice(0, 10)
                return { history: newHistory }
            }),
            clearHistory: () => set({ history: [] }),
        }),
        {
            name: 'uuid-storage',
        }
    )
)
