import { v4 as uuidv4 } from 'uuid'
import { ulid } from 'ulid'

export type IdType = 'uuid-v4' | 'ulid' | 'ksuid'

export interface GenerationOptions {
    hyphens: boolean
    uppercase: boolean
    braces: boolean
}

// KSUID Implementation
const KSUID_EPOCH = 1400000000
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function generateKsuidString(): string {
    // 1. Timestamp (4 bytes) - Seconds since epoch
    const timestamp = Math.floor(Date.now() / 1000) - KSUID_EPOCH

    // 2. Payload (16 bytes) - Random
    const payload = new Uint8Array(16)
    crypto.getRandomValues(payload)

    // 3. Combine (20 bytes total)
    // We'll use BigInt for Base62 encoding as 20 bytes > Number.MAX_SAFE_INTEGER
    let val = BigInt(timestamp)

    // Shift timestamp by 128 bits (16 bytes) to make room for payload
    val = val << 128n

    // Add payload
    let payloadBigInt = 0n
    for (let i = 0; i < 16; i++) {
        payloadBigInt = (payloadBigInt << 8n) | BigInt(payload[i])
    }

    val = val | payloadBigInt

    // 4. Base62 Encode
    if (val === 0n) return '0'.padStart(27, '0')

    let result = ''
    const base = 62n

    while (val > 0n) {
        const mod = val % base
        result = BASE62[Number(mod)] + result
        val = val / base
    }

    return result.padStart(27, '0')
}

export const generateIds = (type: IdType, quantity: number, options: GenerationOptions): string[] => {
    const ids: string[] = []

    for (let i = 0; i < quantity; i++) {
        let id = ''

        switch (type) {
            case 'uuid-v4':
                id = uuidv4()
                if (!options.hyphens) {
                    id = id.replace(/-/g, '')
                }
                if (options.uppercase) {
                    id = id.toUpperCase()
                }
                break
            case 'ulid':
                id = ulid()
                // ULID is standard uppercase, no hyphens
                break
            case 'ksuid':
                id = generateKsuidString()
                break
        }

        // Common formatting
        if (options.braces) {
            id = `{${id}}`
        }

        ids.push(id)
    }

    return ids
}
