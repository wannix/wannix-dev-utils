import { base64InputSchema } from "../validators/common.schema";
import { z } from "zod";

export type Base64Result = {
  success: boolean;
  result?: string;
  error?: string;
};

export function encodeBase64(input: string): Base64Result {
  try {
    base64InputSchema.parse({ input, mode: "encode" });
    const result = btoa(unescape(encodeURIComponent(input)));
    return { success: true, result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to encode. Invalid input." };
  }
}

export function decodeBase64(input: string): Base64Result {
  try {
    base64InputSchema.parse({ input, mode: "decode" });
    const result = decodeURIComponent(escape(atob(input)));
    return { success: true, result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to decode. Invalid Base64 string." };
  }
}
