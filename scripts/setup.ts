import fs from "fs";
import path from "path";
import process from "process";

const ROOT = process.cwd();

const folders = [
  "src",
  "src/app",
  "src/actions",
  "src/components",
  "src/components/ui",
  "src/components/common",
  "src/components/layout",
  "src/components/gallery",
  "src/components/profile",
  "src/components/events",
  "src/config",
  "src/constants",
  "src/features",
  "src/hooks",
  "src/lib",
  "src/middleware",
  "src/models",
  "src/repositories",
  "src/schemas",
  "src/services",
  "src/stores",
  "src/styles",
  "src/types",
  "src/utils",
];

const docs = [
  "AGENTS.md",
  "PROJECT_CONTEXT.md",
  "AI_STATE.md",
];

function createFolder(folder: string) {
  const fullPath = path.join(ROOT, folder);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created ${folder}`);
  }

  const gitkeep = path.join(fullPath, ".gitkeep");

  if (!fs.existsSync(gitkeep)) {
    fs.writeFileSync(gitkeep, "");
  }
}

function verifyFile(file: string) {
  const fullPath = path.join(ROOT, file);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Missing ${file}`);
    return false;
  }

  console.log(`✅ ${file}`);
  return true;
}

function copyEnv() {
  const example = path.join(ROOT, ".env.example");
  const local = path.join(ROOT, ".env.local");

  if (fs.existsSync(example) && !fs.existsSync(local)) {
    fs.copyFileSync(example, local);
    console.log("✅ Created .env.local");
  }
}

function printHeader() {
  console.log("");
  console.log("=======================================");
  console.log("       DriveGallery Setup");
  console.log("=======================================");
  console.log("");
}

function main() {
  printHeader();

  console.log("Creating folders...\n");

  folders.forEach(createFolder);

  console.log("\nChecking documentation...\n");

  docs.forEach(verifyFile);

  copyEnv();

  console.log("\n✅ Setup Complete");
}

main();