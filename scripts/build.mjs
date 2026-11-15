import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
const args = [resolve("node_modules/next/dist/bin/next"), "build"];
if (
  !process.argv.includes("--turbo") &&
  !process.argv.includes("--turbopack")
) {
  args.push("--webpack");
}
const result = spawnSync(process.execPath, args, { stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
await import("./normalize-export.mjs");
