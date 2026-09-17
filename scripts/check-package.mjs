import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { allowedFiles, skillResources } from './package-policy.mjs';

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');

export function listFiles(root) {
  const files = [];
  const errors = [];
  function walk(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!prefix && entry.name === '.git') continue; // metadata checked separately before publication
      const rel = prefix + entry.name;
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) errors.push(`${rel}: symlink forbidden`);
      else if (entry.isDirectory()) walk(full, rel + '/');
      else if (entry.isFile()) files.push(rel);
      else errors.push(`${rel}: unsupported file type`);
    }
  }
  walk(root);
  return { files: files.sort(), errors };
}

const checks = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['service token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|sk-[A-Za-z0-9_-]{24,}|xox[baprs]-[A-Za-z0-9-]{20,}|AKIA[A-Z0-9]{16})\b/],
  ['assigned secret', /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["'][A-Za-z0-9_+\/-]{20,}["']/i],
  ['personal email', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
  ['phone-like contact', /\+\d[\d ()-]{9,}\d/],
  ['machine home path', /(?:\/(?:Users|home)\/[^\s/]+|[A-Z]:\\Users\\[^\s\\]+)/i],
  ['private document link', /https?:\/\/(?:docs\.google\.com\/(?:document|spreadsheets|presentation)|drive\.google\.com|[^\s/]+\.slack\.com|[^\s/]+\.atlassian\.net|notion\.so|[^\s/]+\.notion\.site)\//i],
  ['personal profile link', /https?:\/\/(?:www\.)?(?:linkedin\.com\/in\/|steamcommunity\.com\/profiles\/|t\.me\/+[A-Za-z0-9_-]+)/i],
];

export function inspectText(text) {
  return checks.filter(([, pattern]) => pattern.test(text)).map(([name]) => name);
}

export function checkPackage(root = packageRoot, { hashes = true } = {}) {
  const { files, errors } = listFiles(root);
  const allowed = new Set(allowedFiles);
  const actual = new Set(files);
  for (const file of files) if (!allowed.has(file)) errors.push(`${file}: not in release allowlist`);
  for (const file of allowedFiles) if (!actual.has(file) && (hashes || file !== 'package-manifest.json')) errors.push(`${file}: missing`);
  const decoder = new TextDecoder('utf-8', { fatal: true });
  for (const file of files) {
    const bytes = fs.readFileSync(path.join(root, file));
    let text;
    try { text = decoder.decode(bytes); } catch { errors.push(`${file}: invalid UTF-8`); continue; }
    if (text.includes('\0')) errors.push(`${file}: binary content`);
    for (const finding of inspectText(text)) errors.push(`${file}: ${finding}`);
    if (file.endsWith('/SKILL.md')) {
      const header = text.match(/^---\n([\s\S]+?)\n---\n/);
      if (!header) errors.push(`${file}: missing YAML frontmatter`);
      else {
        const name = header[1].match(/^name:\s*([^\n]+)$/m)?.[1];
        if (name !== path.basename(path.dirname(file))) errors.push(`${file}: skill name mismatch`);
        if (!/^description:\s*\S.+$/m.test(header[1])) errors.push(`${file}: missing description`);
      }
    }
  }
  if (hashes && actual.has('package-manifest.json')) {
    try {
      const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package-manifest.json'), 'utf8'));
      if (manifest.schema_version !== 1) errors.push('manifest: unsupported schema');
      const expected = files.filter(f => f !== 'package-manifest.json');
      if (JSON.stringify(Object.keys(manifest.files).sort()) !== JSON.stringify(expected)) errors.push('manifest: file list differs');
      for (const file of expected) {
        if (manifest.files[file] !== digest(fs.readFileSync(path.join(root, file)))) errors.push(`${file}: SHA-256 differs`);
      }
    } catch { errors.push('manifest: invalid or unreadable'); }
  }
  return { ok: errors.length === 0, files: files.length, skills: Object.keys(skillResources).length, errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkPackage();
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.ok ? 0 : 1;
}
