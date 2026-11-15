/**
 * Cryptographically secure opaque token helpers.
 * Refresh/reset/verification tokens are random, never derived from user data.
 */

import crypto from "node:crypto";

/** URL-safe random token with 256 bits of entropy. */
export function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

/** SHA-256 is appropriate for high-entropy opaque tokens (not user passwords). */
export function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

export function timingSafeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

/**
 * Refresh token format: "<sessionId>.<secret>".
 * The session id lets us locate the row efficiently while the secret is only
 * ever stored as a hash.
 */
export function createSessionToken(sessionId) {
  const secret = generateToken(32);
  return { token: `${sessionId}.${secret}`, tokenHash: hashToken(`${sessionId}.${secret}`) };
}

export function parseSessionToken(token) {
  if (typeof token !== "string") return null;
  const separator = token.indexOf(".");
  if (separator <= 0 || separator === token.length - 1) return null;
  const sessionId = token.slice(0, separator);
  if (!/^[0-9a-fA-F-]{20,64}$/.test(sessionId)) return null;
  return { sessionId, token };
}

export function generateCsrfToken() {
  return generateToken(24);
}
