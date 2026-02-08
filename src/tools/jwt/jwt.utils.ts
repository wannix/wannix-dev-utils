import { jwtDecode } from 'jwt-decode'
import type { DecodedJWT, JWTHeader, JWTPayload } from './jwt.types'

export const decodeJWT = (token: string): DecodedJWT => {
    if (!token) {
        return {
            header: null,
            payload: null,
            signature: null,
            raw: { header: '', payload: '', signature: '' },
            error: null
        }
    }

    try {
        const parts = token.split('.')
        if (parts.length !== 3) {
            return {
                header: null,
                payload: null,
                signature: null,
                raw: { header: '', payload: '', signature: '' },
                error: 'Invalid JWT format. Expected 3 parts separated by dots.'
            }
        }

        const [headerRaw, payloadRaw, signatureRaw] = parts

        // Decode Header
        let header: JWTHeader
        try {
            header = jwtDecode<JWTHeader>(token, { header: true })
        } catch (e) {
            throw new Error('Failed to decode header')
        }

        // Decode Payload
        let payload: JWTPayload
        try {
            payload = jwtDecode<JWTPayload>(token)
        } catch (e) {
            throw new Error('Failed to decode payload')
        }

        return {
            header,
            payload,
            signature: signatureRaw,
            raw: {
                header: headerRaw,
                payload: payloadRaw,
                signature: signatureRaw
            },
            error: null
        }
    } catch (err: unknown) {
        return {
            header: null,
            payload: null,
            signature: null,
            raw: { header: '', payload: '', signature: '' },
            error: err instanceof Error ? err.message : 'Invalid JWT'
        }
    }
}

export const formatTime = (timestamp: number): string => {
    if (!timestamp) return ''
    // Check if timestamp is in seconds (standard JWT) or milliseconds
    const date = new Date(timestamp * 1000)
    return `${date.toISOString()} (${timestamp})`
}
