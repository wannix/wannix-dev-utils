import { uuidOptionsSchema } from "../validators/common.schema";
import { z } from "zod";

export type UUIDOptions = {
  uppercase: boolean;
  withHyphens: boolean;
};

export function generateUUID(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatUUID(uuid: string, options: UUIDOptions): string {
  let formatted = uuid;
  
  if (!options.withHyphens) {
    formatted = formatted.replace(/-/g, "");
  }
  
  if (options.uppercase) {
    formatted = formatted.toUpperCase();
  } else {
    formatted = formatted.toLowerCase();
  }
  
  return formatted;
}

export function generateBulkUUIDs(count: number, options: UUIDOptions): string[] {
  try {
    uuidOptionsSchema.parse({ count, ...options });
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const uuid = generateUUID();
      uuids.push(formatUUID(uuid, options));
    }
    return uuids;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0].message);
    }
    throw new Error("Failed to generate UUIDs");
  }
}
