export type Base64Mode = "encode" | "decode";

export interface Base64Result {
  text: string;
  error: string | null;
}
