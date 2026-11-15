import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, relative, resolve } from "node:path";
import ts from "typescript";

// Render actual local modules in Node without mocking Next's CJS entry points.
// Resolve only local TypeScript dependencies; package imports stay untouched.
export function loadServerComponent<T>(entry: string): T {
  const sourceRoot = resolve("src");
  const outputRoot = resolve(`.cache/test-components/worker-${process.pid}`);
  const compiled = new Map<string, string>();
  function compile(source: string): string {
    const prior = compiled.get(source);
    if (prior) return prior;
    const output = resolve(
      outputRoot,
      relative(sourceRoot, source).replace(/\.tsx?$/, ".cjs"),
    );
    compiled.set(source, output);
    const result = ts.transpileModule(readFileSync(source, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    });
    const code = result.outputText.replace(
      /require\("(@\/[^"]+|\.[^"]+)"\)/g,
      (_match, specifier: string) => {
        const base = specifier.startsWith("@/")
          ? resolve(sourceRoot, specifier.slice(2))
          : resolve(dirname(source), specifier);
        const dependency = [`${base}.ts`, `${base}.tsx`].find(existsSync);
        if (!dependency)
          throw new Error(`Missing local test module: ${specifier}`);
        return `require(${JSON.stringify(compile(dependency))})`;
      },
    );
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, code);
    return output;
  }
  return createRequire(import.meta.url)(compile(resolve(entry))) as T;
}
