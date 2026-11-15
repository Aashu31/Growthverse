/**
 * Small HTTP helpers used by route modules.
 */

export class HttpError extends Error {
  constructor(statusCode, message, code = undefined, details = undefined) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message, details) {
  return new HttpError(400, message, "VALIDATION_ERROR", details);
}

export function unauthorized(message = "Authentication required") {
  return new HttpError(401, message, "UNAUTHENTICATED");
}

export function forbidden(message = "You do not have permission to perform this action") {
  return new HttpError(403, message, "FORBIDDEN");
}

export function notFound(message = "Resource not found") {
  return new HttpError(404, message, "NOT_FOUND");
}

export function conflict(message, code = "CONFLICT") {
  return new HttpError(409, message, code);
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function safeString(value, max = 255) {
  return String(value ?? "").trim().slice(0, max);
}
