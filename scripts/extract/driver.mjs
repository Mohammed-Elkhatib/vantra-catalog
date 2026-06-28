#!/usr/bin/env node
// Thin orchestration CLI for the catalog extraction pipeline.
// Commands: scaffold, status, gate. No LLM calls.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const provDir = path.join(repoRoot, "data", "provenance");

function parseFlags(args) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      flags[args[i].slice(2)] = args[i + 1];
      i++;
    } else {
      positional.push(args[i]);
    }
  }
  return { flags, positional };
}

function scaffold(positional, flags) {
  const id = positional[0];
  if (!id || !flags.pdf || !flags.batch) {
    console.error("usage: scaffold <product-id> --pdf <path> --batch <name>");
    process.exit(2);
  }
  fs.mkdirSync(provDir, { recursive: true });
  const file = path.join(provDir, `${id}.json`);
  if (fs.existsSync(file)) {
    console.error(`refusing to overwrite existing sidecar: ${file}`);
    process.exit(2);
  }
  const skeleton = {
    product_id: id,
    source_pdf: flags.pdf,
    batch: flags.batch,
    state: "todo",
    fields: {},
    free_text_sources: {},
    exceptions: [],
  };
  fs.writeFileSync(file, JSON.stringify(skeleton, null, 2) + "\n");
  console.log(`created ${path.relative(repoRoot, file)}`);
}

function status() {
  if (!fs.existsSync(provDir)) {
    console.log("no sidecars yet");
    return;
  }
  const rows = fs
    .readdirSync(provDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const sc = JSON.parse(fs.readFileSync(path.join(provDir, f), "utf8"));
      return `${sc.state.padEnd(10)} ${sc.product_id}  (${sc.batch})`;
    });
  console.log(rows.length ? rows.join("\n") : "no sidecars yet");
}

function gate() {
  const res = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["vitest", "run", "data/gate.test.ts"],
    { cwd: repoRoot, stdio: "inherit", shell: process.platform === "win32" }
  );
  process.exit(res.status ?? 1);
}

const [cmd, ...rest] = process.argv.slice(2);
const { flags, positional } = parseFlags(rest);
switch (cmd) {
  case "scaffold":
    scaffold(positional, flags);
    break;
  case "status":
    status();
    break;
  case "gate":
    gate();
    break;
  default:
    console.error("usage: driver.mjs <scaffold|status|gate> [...]");
    process.exit(2);
}
