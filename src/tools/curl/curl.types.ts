export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export interface Header {
    id: string
    key: string
    value: string
}

export interface CurlState {
    method: RequestMethod
    url: string
    headers: Header[]
    body: string
}
