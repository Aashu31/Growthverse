#!/usr/bin/env node
/**
 * Browser end-to-end authentication test.
 *
 * Prerequisites:
 *   - Backend running on http://localhost:5000
 *   - Frontend dev server running on http://localhost:3000
 *   - Google Chrome installed (or set CHROME_PATH)
 *
 * This drives a real headless Chrome session through signup, email
 * verification, login, protected-route redirects, HttpOnly cookie inspection,
 * and logout. It also asserts that no auth data is written to Web Storage.
 */

import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import prisma from "../backend/src/lib/prisma.js";

const APP_URL = process.env.E2E_APP_URL || "http://localhost:3000";
const CHROME_PATH = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const DEBUG_PORT = Number(process.env.E2E_DEBUG_PORT || 9333);
const RUN_ID = crypto.randomBytes(4).toString("hex");
const EMAIL = `e2e.${RUN_ID}@example.com`;
const NAME = "Browser E2E Customer";
const PASSWORD = "BrowserE2E!2345";

const results = [];
let failures = 0;

function check(label, condition, detail = "") {
  if (condition) {
    results.push({ ok: true, label });
    console.log(`  PASS  ${label}`);
  } else {
    failures += 1;
    results.push({ ok: false, label, detail });
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

class CDP {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.waiters = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", () => reject(new Error("Unable to connect to Chrome DevTools")), {
        once: true,
      });
    });
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
        return;
      }
      if (message.method && this.waiters.has(message.method)) {
        for (const waiter of this.waiters.get(message.method)) waiter(message.params);
        this.waiters.delete(message.method);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  once(method, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeoutMs);
      const handler = (params) => {
        clearTimeout(timer);
        resolve(params);
      };
      const list = this.waiters.get(method) || [];
      list.push(handler);
      this.waiters.set(method, list);
    });
  }

  close() {
    try {
      this.ws?.close();
    } catch {
      // ignore
    }
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function waitForChrome() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      return await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
    } catch {
      await sleep(150);
    }
  }
  throw new Error("Chrome DevTools endpoint did not become ready.");
}

async function openTarget(url) {
  const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error(`Unable to create Chrome target: ${response.status}`);
  return response.json();
}

async function main() {
  const profileDir = await mkdtemp(path.join(tmpdir(), "growthverse-e2e-"));
  let chrome;
  let cdp;

  try {
    // Fail fast with a clear message if the dev servers are not running.
    const health = await fetch("http://127.0.0.1:5000/api/health").then((response) => response.json());
    if (health?.database !== "connected") throw new Error("Backend database is not connected.");
    const appResponse = await fetch(`${APP_URL}/login`, { headers: { Accept: "text/html" } });
    if (!appResponse.ok) throw new Error(`Frontend is not reachable at ${APP_URL}.`);

    chrome = spawn(
      CHROME_PATH,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        `--remote-debugging-port=${DEBUG_PORT}`,
        `--user-data-dir=${profileDir}`,
        "about:blank",
      ],
      { stdio: "ignore" }
    );

    await waitForChrome();
    const target = await openTarget(`${APP_URL}/signup`);

    cdp = new CDP(target.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");

    const evaluate = async (expression) => {
      const result = await cdp.send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
        userGesture: true,
      });
      if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.exception?.description || "Browser evaluation failed");
      }
      return result.result.value;
    };

    const waitFor = async (expression, label, timeoutMs = 25000) => {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        try {
          if (await evaluate(expression)) return true;
        } catch {
          // Page may be navigating; retry.
        }
        await sleep(150);
      }
      throw new Error(`Timed out waiting for: ${label}`);
    };

    const navigate = async (url, expectedText) => {
      await cdp.send("Page.navigate", { url });
      await waitFor("document.readyState === 'complete'", `load ${url}`);
      if (expectedText) await waitFor(`document.body.innerText.includes(${JSON.stringify(expectedText)})`, expectedText);
    };

    const fillAndSubmit = async (values) => {
      const assignments = Object.entries(values)
        .map(
          ([selector, value]) => `
            (() => {
              const element = document.querySelector(${JSON.stringify(selector)});
              if (!element) throw new Error("Missing input ${selector}");
              const prototype = element instanceof HTMLTextAreaElement
                ? HTMLTextAreaElement.prototype
                : HTMLInputElement.prototype;
              Object.getOwnPropertyDescriptor(prototype, "value").set.call(element, ${JSON.stringify(value)});
              element.dispatchEvent(new Event("input", { bubbles: true }));
            })();
          `
        )
        .join("\n");
      await evaluate(`(() => { ${assignments} document.querySelector("form").requestSubmit(); return true; })()`);
    };

    console.log("\nSignup");
    await waitFor(`document.querySelector("#signup-name") !== null`, "signup form");
    check("signup page renders", await evaluate(`document.querySelector("h1")?.innerText.includes("Create your account")`));

    await fillAndSubmit({
      "#signup-name": NAME,
      "#signup-email": EMAIL,
      "#signup-password": PASSWORD,
      "#signup-confirm-password": PASSWORD,
    });
    await waitFor(`document.body.innerText.includes("Account created")`, "signup success");
    check("browser signup creates an account", true);

    const verificationUrl = await evaluate(`
      [...document.querySelectorAll("a")].map((anchor) => anchor.href)
        .find((href) => href.includes("/verify-email?token=")) || null
    `);
    check("development verification link is rendered", Boolean(verificationUrl));

    console.log("\nEmail verification");
    if (verificationUrl) {
      await navigate(verificationUrl, "Email verified");
      check("browser verifies the email address", true);
    }

    console.log("\nLogin and cookies");
    await navigate(`${APP_URL}/login`, "Welcome back");
    await fillAndSubmit({ "#login-email": EMAIL, "#login-password": PASSWORD });
    await waitFor(`location.pathname === "/account"`, "redirect to /account");
    await waitFor(`document.body.innerText.includes("My account")`, "account page");
    check("login redirects a customer to the account page", true);
    check("account page shows the signed-in user", await evaluate(`document.body.innerText.includes(${JSON.stringify(EMAIL)})`));

    const storage = await evaluate(`
      (() => {
        const keys = (storage) => Object.keys(storage);
        return {
          local: keys(localStorage),
          session: keys(sessionStorage),
          localValues: Object.values(localStorage),
          sessionValues: Object.values(sessionStorage),
        };
      })()
    `);
    const suspiciousKeys = [...storage.local, ...storage.session].filter((key) =>
      /token|jwt|auth|access|refresh|password/i.test(key)
    );
    check("no auth tokens are stored in localStorage/sessionStorage", suspiciousKeys.length === 0, suspiciousKeys.join(", "));
    check(
      "no JWT-like values are stored in Web Storage",
      ![...storage.localValues, ...storage.sessionValues].some((value) => /^eyJ[A-Za-z0-9_-]+\\./.test(String(value)))
    );

    const cookieResult = await cdp.send("Network.getAllCookies");
    const cookies = cookieResult.cookies.filter((cookie) => /localhost|127\\.0\\.0\\.1/.test(cookie.domain));
    const accessCookie = cookies.find((cookie) => cookie.name === "gv_at");
    const refreshCookie = cookies.find((cookie) => cookie.name === "gv_rt");
    const csrfCookie = cookies.find((cookie) => cookie.name === "gv_csrf");

    check("access cookie exists and is HttpOnly", Boolean(accessCookie?.httpOnly));
    check("access cookie is scoped to /api", accessCookie?.path === "/api", accessCookie?.path);
    check("refresh cookie exists and is HttpOnly", Boolean(refreshCookie?.httpOnly));
    check("refresh cookie is scoped to /api/auth", refreshCookie?.path === "/api/auth", refreshCookie?.path);
    check("CSRF cookie exists and is readable by JavaScript", Boolean(csrfCookie) && csrfCookie.httpOnly === false);
    check(
      "CSRF cookie is visible to document.cookie",
      await evaluate(`document.cookie.split(";").some((part) => part.trim().startsWith("gv_csrf="))`)
    );
    check(
      "HttpOnly cookies are hidden from document.cookie",
      await evaluate(
        `!document.cookie.includes("gv_at=") && !document.cookie.includes("gv_rt=")`
      )
    );

    const me = await evaluate(`fetch("/api/auth/me", { credentials: "include" }).then((response) => response.json())`);
    check("browser session works through the dev proxy", me?.data?.user?.email === EMAIL);

    console.log("\nRoute protection");
    await navigate(`${APP_URL}/dashboard`, "My account");
    check(
      "customer is redirected away from the staff dashboard",
      await evaluate(`location.pathname === "/account"`),
      await evaluate(`location.pathname`)
    );

    console.log("\nLogout");
    await evaluate(`
      (() => {
        const button = [...document.querySelectorAll("button")].find(
          (element) => element.innerText.trim().toLowerCase() === "sign out"
        );
        if (!button) throw new Error("Sign out button not found");
        button.click();
        return true;
      })()
    `);
    await waitFor(`location.pathname === "/login"`, "logout redirect");
    check("logout returns the customer to the login page", true);

    const afterLogout = await cdp.send("Network.getAllCookies");
    const remaining = afterLogout.cookies.filter(
      (cookie) => /localhost|127\\.0\\.0\\.1/.test(cookie.domain) && ["gv_at", "gv_rt"].includes(cookie.name)
    );
    check("logout clears authentication cookies", remaining.length === 0, remaining.map((cookie) => cookie.name).join(", "));

    const meAfterLogout = await evaluate(
      `fetch("/api/auth/me", { credentials: "include" }).then((response) => response.status)`
    );
    check("browser session is invalid after logout", meAfterLogout === 401, String(meAfterLogout));

    console.log(`\n${results.length - failures}/${results.length} browser checks passed.`);
  } finally {
    cdp?.close();
    chrome?.kill();
    await sleep(300);
    await prisma.user.deleteMany({ where: { email: EMAIL } }).catch(() => {});
    await prisma.customer.deleteMany({ where: { email: EMAIL } }).catch(() => {});
    await prisma.$disconnect();
    await rm(profileDir, { recursive: true, force: true }).catch(() => {});
  }

  if (failures > 0) {
    console.error(`\n${failures} browser check(s) failed.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("\nBrowser E2E aborted:", error.message);
  process.exitCode = 1;
});
