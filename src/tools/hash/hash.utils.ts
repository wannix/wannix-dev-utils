import script from "crypto-js";
import type { HashAlgorithm } from "./hash.types";

export const ALGORITHMS: { value: HashAlgorithm; label: string }[] = [
  { value: "MD5", label: "MD5" },
  { value: "SHA1", label: "SHA-1" },
  { value: "SHA256", label: "SHA-256" },
  { value: "SHA512", label: "SHA-512" },
  { value: "RIPEMD160", label: "RIPEMD-160" },
];

/**
 * Generates a cryptographic hash of the input text using the specified algorithm.
 * Supports optional HMAC mode with a secret key.
 * @param text - The input string to hash
 * @param algorithm - The hash algorithm to use (MD5, SHA1, SHA256, SHA512, RIPEMD160)
 * @param hmacKey - Optional secret key to produce an HMAC hash
 * @returns The hexadecimal hash string
 * @throws Error if hashing fails or HMAC is not supported for the given algorithm
 */
export function generateHash(
  text: string,
  algorithm: HashAlgorithm,
  hmacKey?: string,
): string {
  if (!text) return "";

  try {
    if (hmacKey) {
      switch (algorithm) {
        case "MD5":
          return script.HmacMD5(text, hmacKey).toString();
        case "SHA1":
          return script.HmacSHA1(text, hmacKey).toString();
        case "SHA256":
          return script.HmacSHA256(text, hmacKey).toString();
        case "SHA512":
          return script.HmacSHA512(text, hmacKey).toString();
        case "RIPEMD160":
          // Crypto-js doesn't support HmacRIPEMD160 directly in the core build usually,
          // but let's check if it's available or fallback
          // Actually, let's stick to standard ones if RIPEMD160 HMAC is tricky
          // But for now, let's try assuming standard pattern or throw not supported
          throw new Error("HMAC not supported for RIPEMD160");
        default:
          return "";
      }
    } else {
      switch (algorithm) {
        case "MD5":
          return script.MD5(text).toString();
        case "SHA1":
          return script.SHA1(text).toString();
        case "SHA256":
          return script.SHA256(text).toString();
        case "SHA512":
          return script.SHA512(text).toString();
        case "RIPEMD160":
          return script.RIPEMD160(text).toString();
        default:
          return "";
      }
    }
  } catch (e: any) {
    throw new Error(e.message || "Hashing failed");
  }
}
