import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Node 26 exposes a global `localStorage` that is unavailable without a backing
 * file, which shadows jsdom's implementation in the vitest environment.
 * Provide a standards-compatible in-memory Storage for tests.
 */
function createStorage() {
  const items = new Map();
  return {
    getItem: (key) => (items.has(String(key)) ? items.get(String(key)) : null),
    setItem: (key, value) => items.set(String(key), String(value)),
    removeItem: (key) => items.delete(String(key)),
    clear: () => items.clear(),
    key: (index) => Array.from(items.keys())[index] ?? null,
    get length() {
      return items.size;
    },
  };
}

for (const name of ["localStorage", "sessionStorage"]) {
  if (!window[name]) {
    Object.defineProperty(window, name, { value: createStorage(), configurable: true });
  }
}

beforeEach(() => {
  document.cookie = "gv_csrf=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  window.localStorage.clear();
  window.sessionStorage.clear();
});

afterEach(() => {
  cleanup();
});
