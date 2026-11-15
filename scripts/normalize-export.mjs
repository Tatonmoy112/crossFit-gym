import { readdir, copyFile, mkdir } from "node:fs/promises";
import { resolve, relative, sep, dirname } from "node:path";
// Next 16.4's exporter replaces forward slashes when flattening segment paths.
// On Windows its collected paths contain backslashes, leaving nested directories.
// Add the protocol's flat filenames without modifying Next or requiring host rewrites.
const root = resolve("out");
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? walk(resolve(directory, entry.name))
        : [resolve(directory, entry.name)],
    ),
  );
  return groups.flat();
}
let count = 0;
for (const source of await walk(root)) {
  const parts = relative(root, source).split(sep);
  const index = parts.findIndex((part) => part.startsWith("__next."));
  if (index >= 0 && index !== parts.length - 1 && source.endsWith(".txt")) {
    const destination = resolve(
      root,
      ...parts.slice(0, index),
      parts.slice(index).join("."),
    );
    await copyFile(source, destination);
    count++;
  }
  if (source.includes("[slug]")) {
    const encodedDestination = source.replaceAll("[slug]", "%5Bslug%5D");
    await mkdir(dirname(encodedDestination), { recursive: true });
    await copyFile(source, encodedDestination);
  }
}
console.log(`Static routing: normalized ${count} Windows segment files.`);
