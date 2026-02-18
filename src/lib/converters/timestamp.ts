export interface TimestampConversion {
  unix: number;
  unixMs: number;
  iso: string;
  utc: string;
  local: string;
  relative: string;
}

export function timestampToReadable(input: string): TimestampConversion | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  
  const num = parseInt(trimmed);
  if (isNaN(num)) return null;
  
  // Determine if seconds or milliseconds based on magnitude
  // Timestamps after year 2001 in seconds are > 1000000000
  // Timestamps in milliseconds are > 1000000000000
  let date: Date;
  let unix: number;
  let unixMs: number;
  
  if (num > 1e12) {
    // Milliseconds
    date = new Date(num);
    unix = Math.floor(num / 1000);
    unixMs = num;
  } else {
    // Seconds
    date = new Date(num * 1000);
    unix = num;
    unixMs = num * 1000;
  }
  
  if (isNaN(date.getTime())) return null;
  
  return {
    unix,
    unixMs,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    relative: getRelativeTime(date),
  };
}

export function dateToTimestamp(dateStr: string): TimestampConversion | null {
  if (!dateStr.trim()) return null;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  
  const unix = Math.floor(date.getTime() / 1000);
  const unixMs = date.getTime();
  
  return {
    unix,
    unixMs,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    relative: getRelativeTime(date),
  };
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const absDiff = Math.abs(diff);
  
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  const suffix = diff < 0 ? 'ago' : 'from now';
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ${suffix}`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ${suffix}`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${suffix}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${suffix}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ${suffix}`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ${suffix}`;
}

export function getCurrentTimestamp(): TimestampConversion {
  const now = new Date();
  return {
    unix: Math.floor(now.getTime() / 1000),
    unixMs: now.getTime(),
    iso: now.toISOString(),
    utc: now.toUTCString(),
    local: now.toLocaleString(),
    relative: 'now',
  };
}
