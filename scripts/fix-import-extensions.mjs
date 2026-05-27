import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "..", "dist");

const EXT_BY_FILE = {
  ".mjs": ".mjs",
  ".cjs": ".cjs",
};

const TYPE_EXT_BY_FILE = {
  ".d.ts": ".js",
  ".d.cts": ".cjs",
};

const ALREADY_EXTENDED = /\.(mjs|cjs|js|jsx|ts|tsx|json|css)$/;

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, list);
      continue;
    }
    list.push(full);
  }
  return list;
}

function fileTargetExt(file) {
  if (file.endsWith(".d.ts")) return TYPE_EXT_BY_FILE[".d.ts"];
  if (file.endsWith(".d.cts")) return TYPE_EXT_BY_FILE[".d.cts"];
  const ext = path.extname(file);
  return EXT_BY_FILE[ext];
}

function rewrite(content, fileDir, targetExt) {
  const patterns = [
    /(from\s+["'])(\.\.?\/[^"']+?)(["'])/g,
    /(export\s+(?:\*|\{[^}]+\})\s+from\s+["'])(\.\.?\/[^"']+?)(["'])/g,
    /(import\s*\(\s*["'])(\.\.?\/[^"']+?)(["']\s*\))/g,
    /(require\s*\(\s*["'])(\.\.?\/[^"']+?)(["']\s*\))/g,
  ];

  let changed = content;
  for (const pattern of patterns) {
    changed = changed.replace(pattern, (full, prefix, spec, suffix) => {
      if (ALREADY_EXTENDED.test(spec)) return full;

      const resolved = path.resolve(fileDir, spec);
      const candidates = [
        resolved + targetExt,
        path.join(resolved, "index" + targetExt),
      ];
      const matched = candidates.find((c) => fs.existsSync(c));

      if (!matched) return full;

      let newSpec;
      if (matched.endsWith(path.sep + "index" + targetExt)) {
        newSpec = spec.replace(/\/?$/, "/index" + targetExt);
      } else {
        newSpec = spec + targetExt;
      }

      return `${prefix}${newSpec}${suffix}`;
    });
  }

  return changed;
}

if (!fs.existsSync(distDir)) {
  console.error(`dist directory not found: ${distDir}`);
  process.exit(1);
}

let touched = 0;
let total = 0;
for (const file of walk(distDir)) {
  const targetExt = fileTargetExt(file);
  if (!targetExt) continue;
  total++;

  const original = fs.readFileSync(file, "utf8");
  const fixed = rewrite(original, path.dirname(file), targetExt);
  if (fixed !== original) {
    fs.writeFileSync(file, fixed);
    touched++;
  }
}

console.log(`fix-import-extensions: ${touched} of ${total} files rewritten`);
