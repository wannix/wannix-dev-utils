export interface JWTPayload {
    [key: string]: unknown
    exp?: number
    iat?: number
    nbf?: number
    iss?: string
    sub?: string
    aud?: string | string[]
}

export interface JWTHeader {
    [key: string]: unknown
    alg?: string
    typ?: string
    kid?: string
}

export interface DecodedJWT {
    header: JWTHeader | null
    payload: JWTPayload | null
    signature: string | null
    raw: {
        header: string
        payload: string
        signature: string
    }
    error: string | null
}
