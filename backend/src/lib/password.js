/**
 * Password hashing and password policy.
 * Argon2id is the only password hashing algorithm used.
 */

import argon2 from "argon2";
import config from "../config/env.js";

const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "admin123",
  "letmein123",
  "welcome123",
  "iloveyou",
  "changeme",
]);

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

export function validatePassword(password) {
  const errors = [];
  if (typeof password !== "string") {
    return ["Password is required."];
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    errors.push(`Password must be at most ${PASSWORD_MAX_LENGTH} characters.`);
  }
  if (!/[a-z]/.test(password)) errors.push("Password must contain a lowercase letter.");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain an uppercase letter.");
  if (!/[0-9]/.test(password)) errors.push("Password must contain a number.");
  if (COMMON_PASSWORDS.has(password.toLowerCase())) errors.push("Password is too common.");
  if (/^(.)\1+$/.test(password)) errors.push("Password must not be a single repeated character.");
  return errors;
}

const argonOptions = {
  type: argon2.argon2id,
  memoryCost: config.argon2MemoryCost,
  timeCost: config.argon2TimeCost,
  parallelism: config.argon2Parallelism,
};

export async function hashPassword(password) {
  return argon2.hash(password, argonOptions);
}

export async function verifyPassword(hash, password) {
  if (!hash || typeof hash !== "string") return false;
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

// A fixed-cost fake verification for unknown accounts to reduce user enumeration
// through login timing. Generated once per process.
let dummyHashPromise;
function getDummyHash() {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword("GrowthVerse-Dummy-Password-9");
  }
  return dummyHashPromise;
}

export async function performDummyVerification(password) {
  const dummy = await getDummyHash();
  await verifyPassword(dummy, password || "invalid-password");
}
