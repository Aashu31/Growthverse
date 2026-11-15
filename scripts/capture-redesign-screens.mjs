import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "../dist");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 4051;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  let filePath = path.join(DIST_DIR, urlPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end("Not found");
  }
});

// Use Chrome remote debugging to wait for network idle and take screenshot
async function captureWithWait(url, outputPath, width = 1440, height = 960) {
  const debugPort = 9444;
  const userDataDir = path.join(DIST_DIR, "../.chrome-temp");
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    `--window-size=${width},${height}`,
    "about:blank",
  ]);

  // Wait for Chrome to start debugging port
  await new Promise((r) => setTimeout(r, 800));

  try {
    // Get websocket debugger URL
    const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
    const data = await res.json();
    const wsUrl = data.webSocketDebuggerUrl;

    const { WebSocket } = await import("ws").catch(() => ({ WebSocket: null }));
    
    // If ws is not available, fallback to simple screenshot with virtual-time-budget
    if (!WebSocket) {
      chromeProc.kill();
      const fallbackProc = spawn(CHROME_PATH, [
        "--headless=new",
        "--disable-gpu",
        `--window-size=${width},${height}`,
        "--virtual-time-budget=2000",
        "--hide-scrollbars",
        `--screenshot=${outputPath}`,
        url,
      ]);
      await new Promise((resolve) => fallbackProc.on("close", resolve));
      return;
    }
  } catch (e) {
    // fallback
  } finally {
    try { chromeProc.kill(); } catch (e) {}
  }
}

// Simple reliable capture with virtual-time-budget
async function capturePage(url, outputPath, width = 1440, height = 960) {
  return new Promise((resolve) => {
    const proc = spawn(CHROME_PATH, [
      "--headless=new",
      "--disable-gpu",
      `--window-size=${width},${height}`,
      "--virtual-time-budget=2500",
      "--hide-scrollbars",
      `--screenshot=${outputPath}`,
      url,
    ]);
    proc.on("close", resolve);
  });
}

async function main() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  const outputDir = path.resolve(__dirname, "../screenshots");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const pages = [
    { name: "01-homepage-hero.png", path: "/" },
    { name: "01-homepage-full-flow.png", path: "/", height: 2600 },
    { name: "02-about.png", path: "/about" },
    { name: "03-services.png", path: "/services", height: 1600 },
    { name: "04-pricing.png", path: "/pricing" },
    { name: "05-portfolio.png", path: "/portfolio" },
    { name: "06-contact.png", path: "/contact" },
    { name: "07-sarthi.png", path: "/sarthi" },
    { name: "08-login.png", path: "/login" },
    { name: "09-service-details-webdev.png", path: "/services/website-development" },
    { name: "10-service-details-ai.png", path: "/services/ai-and-automation" },
  ];

  for (const page of pages) {
    const fullUrl = `http://localhost:${PORT}${page.path}`;
    const outFile = path.join(outputDir, page.name);
    await capturePage(fullUrl, outFile, 1440, page.height || 960);
    console.log(`Saved: ${page.name}`);
  }

  server.close();
  console.log("Done!");
}

main().catch(console.error);
