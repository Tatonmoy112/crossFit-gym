import { readFile } from "node:fs/promises";
const readiness = JSON.parse(
  await readFile(
    new URL("../docs/content-readiness.json", import.meta.url),
    "utf8",
  ),
);
const blocked = readiness.requirements.filter((item) => !item.approved);
if (blocked.length) {
  console.error(
    "Public release is blocked by missing approved inputs:\n" +
      blocked.map((item) => `- ${item.name}`).join("\n"),
  );
  process.exitCode = 1;
} else
  console.log(
    "All content-readiness requirements approved. Run the complete QA workflow before publication.",
  );
