import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { expect, it } from "vitest";

it("omits only the reserved blank export and preserves populated product output", () => {
  const prefix = join(tmpdir(), "crossfit-export-test-");
  const directory = mkdtempSync(prefix);
  const reserved = join(directory, "out/products/content-preview");
  const populated = join(directory, "out/products/whey-protein-powder");
  try {
    mkdirSync(reserved, { recursive: true });
    mkdirSync(populated, { recursive: true });
    writeFileSync(join(reserved, "index.html"), "<html></html>");
    writeFileSync(join(reserved, "index.txt"), "Reserved RSC output");
    writeFileSync(join(populated, "index.html"), "<h1>Product preview</h1>");
    execFileSync(process.execPath, [resolve("scripts/normalize-export.mjs")], {
      cwd: directory,
    });
    expect(existsSync(reserved)).toBe(false);
    expect(readFileSync(join(populated, "index.html"), "utf8")).toBe(
      "<h1>Product preview</h1>",
    );
  } finally {
    if (
      directory.startsWith(prefix) &&
      directory.startsWith(resolve(tmpdir()) + sep)
    )
      rmSync(directory, { recursive: true, force: true });
  }
});
