import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { gzipSync } from "node:zlib";
const root = resolve("out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};
const port = Number(process.env.PORT || 3000);
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(
      new URL(request.url || "/", "http://localhost").pathname,
    );
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
      await stat(file);
    } catch {
      file = resolve(root, "404.html");
      response.statusCode = 404;
    }
    const body = await readFile(file);
    response.setHeader(
      "Content-Type",
      types[extname(file)] || "application/octet-stream",
    );
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    response.setHeader("Vary", "Accept-Encoding");
    response.setHeader(
      "Cache-Control",
      path.startsWith("/_next/static/")
        ? "public, max-age=31536000, immutable"
        : "no-cache",
    );
    if (
      /\.(?:html|css|js|json|txt|xml)$/.test(file) &&
      request.headers["accept-encoding"]?.includes("gzip")
    ) {
      response.setHeader("Content-Encoding", "gzip");
      response.end(gzipSync(body));
    } else response.end(body);
  } catch {
    response.writeHead(400);
    response.end("Invalid request");
  }
});
server.listen(port, "127.0.0.1", () =>
  process.stdout.write(`Local: http://127.0.0.1:${port}\n`),
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => server.close());
