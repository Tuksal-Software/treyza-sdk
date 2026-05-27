import { defineConfig } from "tsup";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

function collectEntries(root: string): string[] {
  const entries: string[] = [];
  function walk(dir: string) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (/\.(ts|tsx)$/.test(name) && !/\.(test|spec|d)\.tsx?$/.test(name)) {
        entries.push(relative(process.cwd(), full).replace(/\\/g, "/"));
      }
    }
  }
  walk(root);
  return entries;
}

export default defineConfig({
  entry: collectEntries("src"),
  format: ["esm", "cjs"],
  outDir: "dist",
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  bundle: false,
  treeshake: false,
  target: "es2022",
  outExtension: ({ format }) => ({
    js: format === "esm" ? ".mjs" : ".cjs",
  }),
  tsconfig: "./tsconfig.json",
  external: [
    "react",
    "react-dom",
    /^@radix-ui\//,
    "lucide-react",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    /^@treyza\/sdk/,
  ],
});
