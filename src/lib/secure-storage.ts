/**
 * Secure LocalStorage Manager
 * Uses native Web Crypto API for AES-GCM encryption
 * No external dependencies required
 */

const STORAGE_PREFIX = 'aurora_secure_';
const ENCRYPTION_KEY_NAME = 'aurora_encryption_key';

async function generateKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

async function importKey(keyData: string): Promise<CryptoKey> {
  const binaryString = atob(keyData);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return await window.crypto.subtle.importKey('raw', bytes, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function getEncryptionKey(): Promise<CryptoKey> {
  if (typeof window === 'undefined') throw new Error('LocalStorage encryption only works in browser');
  let storedKey = localStorage.getItem(ENCRYPTION_KEY_NAME);
  if (!storedKey) {
    const newKey = await generateKey();
    storedKey = await exportKey(newKey);
    localStorage.setItem(ENCRYPTION_KEY_NAME, storedKey);
  }
  return await importKey(storedKey);
}

async function encrypt(data: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encodedData);
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

async function decrypt(encryptedData: string): Promise<string> {
  const key = await getEncryptionKey();
  const combined = new Uint8Array(Array.from(atob(encryptedData)).map(c => c.charCodeAt(0)));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export const secureStorage = {
  async setItem(key: string, value: any): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const encrypted = await encrypt(stringValue);
    localStorage.setItem(STORAGE_PREFIX + key, encrypted);
  },
  async getItem<T>(key: string): Promise<T | null> {
    const encrypted = localStorage.getItem(STORAGE_PREFIX + key);
    if (!encrypted) return null;
    try {
      const decrypted = await decrypt(encrypted);
      try { return JSON.parse(decrypted) as T; } catch { return decrypted as T; }
    } catch {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return null;
    }
  },
  removeItem(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },
  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) keysToRemove.push(key);
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },
  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) keys.push(key.replace(STORAGE_PREFIX, ''));
    }
    return keys;
  },
  async hasItem(key: string): Promise<boolean> {
    const item = await this.getItem(key);
    return item !== null;
  },
  async resetKey(): Promise<void> {
    localStorage.removeItem(ENCRYPTION_KEY_NAME);
    this.clear();
  }
};
