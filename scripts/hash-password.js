#!/usr/bin/env node

/**
 * Password Hashing Script
 *
 * Usage: node scripts/hash-password.js "YourPassword123!"
 *
 * Generates a PBKDF2 hash suitable for storing in environment variables.
 * Use the output as ADMIN_PASSWORD_HASH in .env.local
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require("crypto");

function hashPassword(password) {
  if (!password) {
    console.error("Error: Password required");
    console.log('Usage: node scripts/hash-password.js "YourPassword123!"');
    process.exit(1);
  }

  // Generate random salt
  const salt = crypto.randomBytes(16);

  // Hash password with PBKDF2
  crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
    if (err) {
      console.error("Error:", err);
      process.exit(1);
    }

    // Combine salt and hash
    const hash = salt.toString("hex") + ":" + derivedKey.toString("hex");

    console.log("\n✅ Password Hash Generated\n");
    console.log("Copy this value to your .env.local:\n");
    console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
    console.log("Settings:");
    console.log("- Algorithm: PBKDF2-SHA512");
    console.log("- Iterations: 100,000");
    console.log("- Key Length: 64 bytes");
    console.log("- Salt Length: 16 bytes");
  });
}

const password = process.argv[2];
hashPassword(password);
