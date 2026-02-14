export type Format = "yaml" | "properties";

export interface ConversionResult {
  content: string;
  error?: string;
}
