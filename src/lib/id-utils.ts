/**
 * Client-safe ID obfuscation utilities.
 * These use only browser-compatible APIs (no Node.js crypto).
 * For server-side JWT/auth security, use @/lib/security instead.
 */

/** Returns a deterministic 8-char hex hash of a string (no randomness = no hydration mismatch). */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit int
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function toBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str).toString("base64");
  }
  return btoa(str);
}

function fromBase64(b64: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64").toString("utf-8");
  }
  return atob(b64);
}

export function obfuscateId(id: string): string {
  if (!id) return "";
  try {
    const b64 = toBase64(id).replace(/=/g, "");
    const suffix = hashString(id);
    return `node_${b64}_${suffix}`;
  } catch {
    return id;
  }
}

export function deobfuscateId(key: string): string {
  if (!key) return "";
  try {
    const parts = key.split("_");
    if (parts.length < 2) return key;
    const b64 = parts[1];
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=");
    return fromBase64(padded);
  } catch {
    return key;
  }
}
