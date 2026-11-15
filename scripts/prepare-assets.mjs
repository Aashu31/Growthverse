import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 4088;
const DEBUG_PORT = 9334;

// The exact 10 images mapping
const ASSET_MAPPING = [
  {
    id: "01",
    name: "Homepage Hero",
    sourceRel: "public/assets/growthverse/hero/GrowthVerse Laptop on a Sunlit Rock.png",
    targetBase: "hero/growthverse-hero-cinematic",
  },
  {
    id: "02",
    name: "About Us",
    sourceRel: "public/assets/growthverse/about/Warm Website Development Workspace.png",
    targetBase: "about/growthverse-about-workspace",
  },
  {
    id: "03",
    name: "Website Development",
    sourceRel: "public/assets/growthverse/services/GrowthVerse Web Development Workspace.png",
    targetBase: "services/growthverse-service-website-development",
  },
  {
    id: "04",
    name: "Web Application Development",
    sourceRel: "public/assets/growthverse/services/GrowthVerse® Executive Office Workspace.png",
    targetBase: "services/growthverse-service-web-application",
  },
  {
    id: "05",
    name: "UI/UX Design",
    sourceRel: "public/assets/growthverse/services/Warm GrowthVerse UI_UX Studio Workspace.png",
    targetBase: "services/growthverse-service-ui-ux",
  },
  {
    id: "06",
    name: "Mobile App Development",
    sourceRel: "public/assets/growthverse/services/GrowthVerse Mobile App Workspace.png",
    targetBase: "services/growthverse-service-mobile-app",
  },
  {
    id: "07",
    name: "AI & Automation",
    sourceRel: "public/assets/growthverse/services/GrowthVerse AI Automation Workspace.png",
    targetBase: "services/growthverse-service-ai-automation",
  },
  {
    id: "08",
    name: "Cloud & DevOps",
    sourceRel: "public/assets/growthverse/services/GrowthVerse Cloud DevOps Workspace.png",
    targetBase: "services/growthverse-service-cloud-devops",
  },
  {
    id: "09",
    name: "Digital Branding",
    sourceRel: "public/assets/growthverse/services/GrowthVerse Digital Branding Workspace.png",
    targetBase: "services/growthverse-service-digital-branding",
  },
  {
    id: "10",
    name: "Digital Marketing",
    sourceRel: "public/assets/growthverse/services/GrowthVerse Digital Marketing Dashboard.png",
    targetBase: "services/growthverse-service-digital-marketing",
  },
];

console.log("Checking source files exist...");
let allExist = true;
for (const item of ASSET_MAPPING) {
  const fullPath = path.resolve(ROOT_DIR, item.sourceRel);
  const exists = fs.existsSync(fullPath);
  console.log(`[${exists ? "OK" : "MISSING"}] ${item.id}: ${item.name} (${item.sourceRel})`);
  if (!exists) allExist = false;
}

if (!allExist) {
  console.error("Some files are missing!");
  process.exit(1);
}

// Ensure target directories exist in both public and src
const dirs = [
  "public/assets/growthverse/hero",
  "public/assets/growthverse/about",
  "public/assets/growthverse/services",
  "src/assets/growthverse/hero",
  "src/assets/growthverse/about",
  "src/assets/growthverse/services",
];

for (const d of dirs) {
  const full = path.resolve(ROOT_DIR, d);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
}

// Copy source PNG files to both public and src with clean canonical names
for (const item of ASSET_MAPPING) {
  const src = path.resolve(ROOT_DIR, item.sourceRel);
  const targetPublicPng = path.resolve(ROOT_DIR, "public/assets/growthverse", `${item.targetBase}.png`);
  const targetSrcPng = path.resolve(ROOT_DIR, "src/assets/growthverse", `${item.targetBase}.png`);
  
  fs.copyFileSync(src, targetPublicPng);
  fs.copyFileSync(src, targetSrcPng);
  console.log(`Copied PNG: ${item.targetBase}.png`);
}

console.log("Asset copies complete!");
