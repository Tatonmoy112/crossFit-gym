import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import ts from "typescript";

// Next's extensionless CJS entry is not importable through Node's ESM loader.
// Compile the actual component with the installed TS compiler, without mocks
// or changing the application import. Each worker owns its ignored output.
const directory = resolve(".cache/test-components");
mkdirSync(directory, { recursive: true });
const output = resolve(directory, `navigation-link-${process.pid}.cjs`);
const compiled = ts.transpileModule(
  readFileSync(resolve("src/components/ui/navigation-link.tsx"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  },
);
writeFileSync(output, compiled.outputText);
const require = createRequire(import.meta.url);
export const NavigationLink: typeof import("@/components/ui/navigation-link").NavigationLink =
  require(output).NavigationLink;
