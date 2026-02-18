import { jwtInputSchema } from "../validators/common.schema";
import { z } from "zod";

export type JWTDecodeResult = {
  success: boolean;
  header?: any;
  payload?: any;
  signature?: string;
  error?: string;
  isExpired?: boolean;
  expiresAt?: Date;
};

function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding if needed
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export function decodeJWT(token: string): JWTDecodeResult {
  try {
    jwtInputSchema.parse({ token });

    const parts = token.split(".");
    if (parts.length !== 3) {
      return { success: false, error: "Invalid JWT format" };
    }

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    // Check expiration
    let isExpired = false;
    let expiresAt: Date | undefined;
    if (payload.exp) {
      expiresAt = new Date(payload.exp * 1000);
      isExpired = expiresAt < new Date();
    }

    return {
      success: true,
      header,
      payload,
      signature,
      isExpired,
      expiresAt,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to decode JWT. Invalid token format." };
  }
}
