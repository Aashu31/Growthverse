import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 4089;
const DEBUG_PORT = 9335;

const FILES = [
  "hero/growthverse-hero-cinematic",
  "about/growthverse-about-workspace",
  "services/growthverse-service-website-development",
  "services/growthverse-service-web-application",
  "services/growthverse-service-ui-ux",
  "services/growthverse-service-mobile-app",
  "services/growthverse-service-ai-automation",
  "services/growthverse-service-cloud-devops",
  "services/growthverse-service-digital-branding",
  "services/growthverse-service-digital-marketing",
];

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/convert") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
      <body>
        <canvas id="c"></canvas>
        <script>
          window.convertToWebP = function(imgDataUrl) {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.getElementById('c');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/webp', 0.92));
              };
              img.onerror = reject;
              img.src = imgDataUrl;
            });
          };
        </script>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end();
  }
});

async function main() {
  await new Promise((r) => server.listen(PORT, r));
  console.log(`Conversion server on port ${PORT}`);

  const userDataDir = path.resolve(ROOT_DIR, ".chrome-convert-temp");
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${userDataDir}`,
    `http://localhost:${PORT}/convert`,
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  try {
    const listRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`);
    const pages = await listRes.json();
    const page = pages.find((p) => p.type === "page");
    if (!page) throw new Error("No page target found");

    const { WebSocket } = await import("ws").catch(() => {
      throw new Error("ws module not found");
    });

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve) => ws.on("open", resolve));

    let msgId = 1;
    function sendCdp(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (data) => {
          const msg = JSON.parse(data.toString());
          if (msg.id === id) {
            ws.off("message", handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.on("message", handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCdp("Runtime.enable");

    for (const base of FILES) {
      const pngPath = path.resolve(ROOT_DIR, "public/assets/growthverse", `${base}.png`);
      const buffer = fs.readFileSync(pngPath);
      const dataUrl = `data:image/png;base64,${buffer.toString("base64")}`;

      console.log(`Converting ${base} to webp...`);
      const evalRes = await sendCdp("Runtime.evaluate", {
        expression: `window.convertToWebP(${JSON.stringify(dataUrl)})`,
        awaitPromise: true,
        returnByValue: true,
      });

      const webpDataUrl = evalRes.result.value;
      const base64Data = webpDataUrl.replace(/^data:image\/webp;base64,/, "");
      const webpBuffer = Buffer.from(base64Data, "base64");

      const publicWebpPath = path.resolve(ROOT_DIR, "public/assets/growthverse", `${base}.webp`);
      const srcWebpPath = path.resolve(ROOT_DIR, "src/assets/growthverse", `${base}.webp`);

      fs.writeFileSync(publicWebpPath, webpBuffer);
      fs.writeFileSync(srcWebpPath, webpBuffer);
      console.log(`Saved WebP: ${base}.webp (${Math.round(webpBuffer.length / 1024)} KB)`);
    }

    ws.close();
  } catch (err) {
    console.error("WebP generation error or ws not present:", err.message);
  } finally {
    chromeProc.kill();
    server.close();
  }
}

main().catch(console.error);
