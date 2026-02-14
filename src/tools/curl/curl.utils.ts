import type { CurlState } from "./curl.types";

/**
 * Generates a formatted cURL command string from the given builder state.
 * Handles method, URL, headers, and body with proper shell escaping.
 * @param state - The current cURL builder form state
 * @returns A complete cURL command string ready for terminal use
 */
export function generateCurlCommand(state: CurlState): string {
  const { method, url, headers, body } = state;
  let command = `curl -X ${method}`;

  // URL
  // Simple quoting for URL to handle special characters slightly better
  const safeUrl = url.trim() || "http://localhost";
  command += ` "${safeUrl}"`;

  // Headers
  headers.forEach((header) => {
    if (header.key.trim() && header.value.trim()) {
      command += ` \\\n  -H "${header.key.trim()}: ${header.value.trim()}"`;
    }
  });

  // Body
  if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
    // Try to minimize the body if it's JSON to avoid weird newlines breaking curl in some shells,
    // but for a builder, keeping formatting might be preferred.
    // Let's go with single quoting the body which is generally safest for bash.
    // We need to escape single quotes inside the body.
    const safeBody = body.replace(/'/g, "'\\''");
    command += ` \\\n  -d '${safeBody}'`;
  }

  return command;
}
