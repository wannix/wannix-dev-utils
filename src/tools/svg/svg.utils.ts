import { optimize } from "svgo";
import type { SvgResult } from "./svg.types";

/**
 * Optimizes an SVG string using SVGO with multi-pass processing.
 * Removes dimensions and applies default optimizations.
 * @param input - The raw SVG markup string
 * @returns Result object with optimized SVG, original/optimized sizes, and savings percentage
 */
export function optimizeSvg(input: string): SvgResult {
  const originalSize = new Blob([input]).size;

  const result = optimize(input, {
    multipass: true,
    plugins: ["preset-default", "removeDimensions"],
  });

  const optimized = result.data;
  const optimizedSize = new Blob([optimized]).size;
  const savedPercent =
    originalSize > 0
      ? ((originalSize - optimizedSize) / originalSize) * 100
      : 0;

  return {
    optimized,
    originalSize,
    optimizedSize,
    savedPercent,
  };
}

/**
 * Formats a byte count into a human-readable string (bytes or KB).
 * @param bytes - The number of bytes to format
 * @returns Formatted size string (e.g. '512 bytes', '1.5 KB')
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 bytes";
  if (bytes === 1) return "1 byte";
  if (bytes < 1024) return `${bytes.toLocaleString()} bytes`;
  const kb = bytes / 1024;
  return `${kb.toFixed(1)} KB`;
}
