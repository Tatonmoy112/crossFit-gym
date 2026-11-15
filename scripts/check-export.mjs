import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, extname } from "node:path";
const root = resolve("out");
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? walk(resolve(directory, entry.name))
        : [resolve(directory, entry.name)],
    ),
  );
  return nested.flat();
}
const files = await walk(root);
const html = files.filter((path) => extname(path) === ".html");
const failures = [];
for (const file of html) {
  const content = await readFile(file, "utf8");
  if (!content.includes("<h1")) failures.push(`${file}: missing H1`);
  if (!content.includes('name="description"'))
    failures.push(`${file}: missing description`);
  for (const match of content.matchAll(
    /(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g,
  )) {
    let target = resolve(root, `.${match[1]}`);
    try {
      if ((await stat(target)).isDirectory())
        target = resolve(target, "index.html");
      await stat(target);
    } catch {
      failures.push(`${file}: missing ${match[1]}`);
    }
  }
  if (
    file.includes("content-preview") &&
    !content.includes('content="noindex, nofollow"')
  )
    failures.push(`${file}: preview is indexable`);
}
if (failures.length) {
  console.error([...new Set(failures)].join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Verified ${html.length} HTML files: internal links, referenced assets, H1s, descriptions and preview noindex.`,
  );
