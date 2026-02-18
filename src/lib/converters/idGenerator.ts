import { ulid } from 'ulid';

export type IdType = 'uuid' | 'ulid' | 'ksuid';

export interface IdOptions {
  type: IdType;
  uppercase: boolean;
  withHyphens: boolean; // Only applies to UUID
  count: number;
}

// Generate cryptographically secure random bytes
function getRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// UUID v4 generation
function generateUUID(): string {
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

// KSUID generation (K-Sortable Unique ID)
// 4 bytes timestamp + 16 bytes random = 20 bytes total
// Base62 encoded to 27 characters
function generateKSUID(): string {
  const timestamp = Math.floor(Date.now() / 1000) - 1400000000; // KSUID epoch
  const random = getRandomBytes(16);
  
  // Combine timestamp and random bytes
  const bytes = new Uint8Array(20);
  bytes[0] = (timestamp >> 24) & 0xff;
  bytes[1] = (timestamp >> 16) & 0xff;
  bytes[2] = (timestamp >> 8) & 0xff;
  bytes[3] = timestamp & 0xff;
  bytes.set(random, 4);
  
  // Base62 encode
  const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  let num = BigInt('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  while (num > 0n) {
    result = base62[Number(num % 62n)] + result;
    num = num / 62n;
  }
  
  return result.padStart(27, '0');
}

export function generateId(type: IdType): string {
  switch (type) {
    case 'uuid':
      return generateUUID();
    case 'ulid':
      return ulid();
    case 'ksuid':
      return generateKSUID();
    default:
      return generateUUID();
  }
}

export function formatId(id: string, options: IdOptions): string {
  let formatted = id;
  
  // UUID-specific formatting
  if (options.type === 'uuid') {
    if (!options.withHyphens) {
      formatted = formatted.replace(/-/g, '');
    }
  }
  
  if (options.uppercase) {
    formatted = formatted.toUpperCase();
  } else {
    formatted = formatted.toLowerCase();
  }
  
  return formatted;
}

export function generateBulkIds(options: IdOptions): string[] {
  const { type, count, ...formatOptions } = options;
  const ids: string[] = [];
  
  for (let i = 0; i < Math.min(count, 100); i++) {
    const id = generateId(type);
    ids.push(formatId(id, options));
  }
  
  return ids;
}

export const idTypeInfo: Record<IdType, { name: string; description: string; format: string }> = {
  uuid: {
    name: 'UUID v4',
    description: 'Universally Unique Identifier, random-based',
    format: '8-4-4-4-12 hex characters (36 chars with hyphens)',
  },
  ulid: {
    name: 'ULID',
    description: 'Universally Unique Lexicographically Sortable Identifier',
    format: '26 Crockford Base32 characters, timestamp-prefixed',
  },
  ksuid: {
    name: 'KSUID',
    description: 'K-Sortable Unique Identifier, used in distributed systems',
    format: '27 Base62 characters, timestamp-prefixed',
  },
};
