import { optimize } from 'svgo'
import type { SvgResult } from './svg.types'

export function optimizeSvg(input: string): SvgResult {
    const originalSize = new Blob([input]).size

    const result = optimize(input, {
        multipass: true,
        plugins: [
            'preset-default',
            'removeDimensions',
        ],
    })

    const optimized = result.data
    const optimizedSize = new Blob([optimized]).size
    const savedPercent = originalSize > 0
        ? ((originalSize - optimizedSize) / originalSize) * 100
        : 0

    return {
        optimized,
        originalSize,
        optimizedSize,
        savedPercent,
    }
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 bytes'
    if (bytes === 1) return '1 byte'
    if (bytes < 1024) return `${bytes.toLocaleString()} bytes`
    const kb = bytes / 1024
    return `${kb.toFixed(1)} KB`
}
