import { encode as toBase64, decode as fromBase64, isValid } from 'js-base64'
import type { Base64Result } from './base64.types'

export const encodeText = (text: string): Base64Result => {
    if (!text) return { text: '', error: null }
    try {
        return { text: toBase64(text), error: null }
    } catch (err) {
        return { text: '', error: 'Failed to encode text' }
    }
}

export const decodeBase64 = (base64: string): Base64Result => {
    if (!base64) return { text: '', error: null }

    // Simple validation before attempting decode
    if (!isValid(base64)) {
        return { text: '', error: 'Invalid Base64 string' }
    }

    try {
        const decoded = fromBase64(base64)
        return { text: decoded, error: null }
    } catch (err) {
        return { text: '', error: 'Failed to decode Base64 string' }
    }
}
