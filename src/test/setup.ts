/**
 * Vitest setup file.
 * Runs before every test file.
 */
import "@testing-library/jest-dom";

// Polyfill crypto for Node.js environments where it may not be globally available
import { webcrypto } from "crypto";
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    writable: false,
  });
}
