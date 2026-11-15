/**
 * Central API client for the GrowthVerse backend.
 *
 * Security notes:
 * - Authentication tokens live in HttpOnly cookies. Nothing auth-related is
 *   ever written to localStorage or sessionStorage.
 * - Mutating requests send the double-submit CSRF token from the readable
 *   `gv_csrf` cookie in the `X-CSRF-Token` header.
 * - A 401 triggers a single, shared refresh attempt. Concurrent requests wait
 *   for the same refresh instead of stampeding the endpoint.
 */

const API_BASE = (process.env.REACT_APP_API_URL || "/api").replace(/\/+$/, "");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Auth endpoints that must never trigger the automatic refresh-and-retry path.
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verification",
];

export class ApiError extends Error {
  constructor(message, { status = 0, code = "ERROR", errors = null, debug = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.debug = debug;
  }

  /** Convert the backend `errors` array/object into a { field: message } map. */
  fieldErrors() {
    const result = {};
    if (!this.errors) return result;
    if (Array.isArray(this.errors)) {
      for (const item of this.errors) {
        if (typeof item === "string") continue;
        if (item && item.field) result[item.field] = item.message;
      }
      return result;
    }
    if (typeof this.errors === "object") {
      for (const [key, value] of Object.entries(this.errors)) {
        result[key] = Array.isArray(value) ? value[0] : String(value);
      }
    }
    return result;
  }
}

export function readCookie(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!match) return "";
  return decodeURIComponent(match.slice(name.length + 1));
}

function emitAuthExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("growthverse:auth-expired"));
  }
}

function buildHeaders(method, headers, hasBody) {
  const result = { Accept: "application/json", ...headers };
  if (hasBody && !(headers && headers["Content-Type"])) {
    result["Content-Type"] = "application/json";
  }
  if (!SAFE_METHODS.has(method)) {
    const csrf = readCookie("gv_csrf");
    if (csrf) result["X-CSRF-Token"] = csrf;
  }
  return result;
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function rawRequest(path, { method = "GET", body, headers = {}, signal } = {}) {
  const normalizedMethod = method.toUpperCase();
  const hasBody = body !== undefined && body !== null;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`${API_BASE}${path}`, {
    method: normalizedMethod,
    credentials: "include",
    signal,
    headers: buildHeaders(normalizedMethod, headers, hasBody && !isFormData),
    body: hasBody ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(payload?.message || `Request failed with status ${response.status}`, {
      status: response.status,
      code: payload?.code || "ERROR",
      errors: payload?.errors || null,
      debug: payload?.debug || null,
    });
  }

  return payload;
}

let refreshPromise = null;

async function ensureCsrfCookie() {
  if (readCookie("gv_csrf")) return;
  try {
    await rawRequest("/auth/csrf");
  } catch {
    // The refresh attempt will surface a useful error if this is fatal.
  }
}

export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      await ensureCsrfCookie();
      return rawRequest("/auth/refresh", { method: "POST" });
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Perform an API request.
 * @param {string} path - Path beginning with "/", relative to the API base.
 */
export async function apiFetch(path, options = {}) {
  try {
    return await rawRequest(path, options);
  } catch (error) {
    const canRefresh =
      error instanceof ApiError &&
      error.status === 401 &&
      !options.skipAuthRefresh &&
      !NO_REFRESH_PATHS.some((prefix) => path.startsWith(prefix));

    if (!canRefresh) {
      if (error instanceof ApiError && error.status === 401 && !options.skipAuthExpiryEvent) {
        emitAuthExpired();
      }
      throw error;
    }

    try {
      await refreshSession();
    } catch (refreshError) {
      emitAuthExpired();
      throw error;
    }

    return rawRequest(path, options);
  }
}

export const api = {
  get: (path, options = {}) => apiFetch(path, { ...options, method: "GET" }),
  post: (path, body, options = {}) => apiFetch(path, { ...options, method: "POST", body }),
  put: (path, body, options = {}) => apiFetch(path, { ...options, method: "PUT", body }),
  patch: (path, body, options = {}) => apiFetch(path, { ...options, method: "PATCH", body }),
  delete: (path, options = {}) => apiFetch(path, { ...options, method: "DELETE" }),
};

export { API_BASE };
export default api;
