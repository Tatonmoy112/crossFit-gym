import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Bundle actual client components for isolated browser tests using tools already
// shipped with Next and TypeScript. No application fixture route or package.
export async function buildBrowserComponent(entry) {
  const require = createRequire(import.meta.url);
  const { webpack } = require("next/dist/compiled/webpack/webpack");
  const output = resolve(`.cache/browser-components/worker-${process.pid}`);
  mkdirSync(output, { recursive: true });
  const compiler = webpack({
    mode: "production",
    target: "web",
    entry: resolve(entry),
    output: { path: output, filename: "fixture.js" },
    devtool: false,
    optimization: { minimize: false },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: { "@": resolve("src") },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: resolve("tests/e2e/helpers/typescript-loader.cjs"),
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({
          NODE_ENV: "production",
          __NEXT_TRAILING_SLASH: true,
        }),
      }),
    ],
  });
  await new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      compiler.close((closeError) => {
        if (error || closeError) return reject(error || closeError);
        if (stats.hasErrors())
          return reject(
            new Error(stats.toString({ all: false, errors: true })),
          );
        resolve();
      });
    });
  });
  return readFileSync(resolve(output, "fixture.js"), "utf8");
}
