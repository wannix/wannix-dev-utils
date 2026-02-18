import { z } from "zod";

export const base64InputSchema = z.object({
  input: z.string().max(10000000, "Input too large (max 10MB)"),
  mode: z.enum(["encode", "decode"]),
});

export const jwtInputSchema = z.object({
  token: z
    .string()
    .max(10000, "Token too large")
    .regex(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
      "Invalid JWT format. Expected format: header.payload.signature"
    ),
});

export const uuidOptionsSchema = z.object({
  count: z.number().min(1).max(100),
  uppercase: z.boolean(),
  withHyphens: z.boolean(),
});
