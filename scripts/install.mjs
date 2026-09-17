#!/usr/bin/env node
// No dependencies, no network, and no reads of candidate records.
import { constants } from 'node:fs';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AGENTS_START = '<!-- career-ops-community-skills:begin -->';
const AGENTS_END = '<!-- career-ops-community-skills:end -->';
const IGNORE_START = '# BEGIN career-ops-community-skills privacy';
const IGNORE_END = '# END career-ops-community-skills privacy';
const PRIVATE_PATHS = [
  '/cv.md', '/config/profile.yml', '/modes/_profile.md', '/modes/_custom.md',
  '/voice-dna.md', '/article-digest.md', '/portals.yml', '/data/',
  '/interview-prep/', '/interviews/', '/memory/', '.env', '.env.*',
  '/reports/', '/output/', '/jds/', '/writing-samples/',
  '/config/plugins.yml', '/plugins.local/', '/plugins.lock',
];

async function statIfPresent(file) {
  try { return await fs.lstat(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

// Check every existing component, including ancestors outside the target.
async function checkPath(file) {
  const absolute = path.resolve(file);
  const root = path.parse(absolute).root;
  let current = root;
  const parts = absolute.slice(root.length).split(path.sep).filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    const stat = await statIfPresent(current);
    if (!stat) return;
    if (stat.isSymbolicLink()) throw new Error(`Symbolic links are not allowed: ${current}`);
    if (i < parts.length - 1 && !stat.isDirectory()) {
      throw new Error(`Expected a directory: ${current}`);
    }
  }
}

async function requireFile(file) {
  await checkPath(file);
  const stat = await statIfPresent(file);
  if (!stat?.isFile()) throw new Error(`Required regular file is missing: ${file}`);
}

async function listFiles(directory) {
  await checkPath(directory);
  const stat = await statIfPresent(directory);
  if (!stat?.isDirectory()) throw new Error(`Required directory is missing: ${directory}`);
  const result = [];
  for (const entry of (await fs.readdir(directory)).sort()) {
    const file = path.join(directory, entry);
    const info = await fs.lstat(file);
    if (info.isSymbolicLink()) throw new Error(`Symbolic links are not allowed: ${file}`);
    if (info.isDirectory()) result.push(...await listFiles(file));
    else if (info.isFile()) result.push(file);
    else throw new Error(`Unsupported filesystem entry: ${file}`);
  }
  return result;
}

function positions(buffer, marker) {
  const found = [];
  let start = 0;
  while (true) {
    const next = buffer.indexOf(marker, start);
    if (next === -1) return found;
    found.push(next);
    start = next + marker.length;
  }
}

function standalone(buffer, offset, length) {
  const end = offset + length;
  const before = offset === 0 || buffer[offset - 1] === 10;
  const after = end === buffer.length || buffer[end] === 10 ||
    (buffer[end] === 13 && buffer[end + 1] === 10);
  return before && after;
}

// Byte slices preserve everything outside our managed block, including CRLF.
function managedContent(original, body, start, end, name) {
  const startBytes = Buffer.from(start);
  const endBytes = Buffer.from(end);
  if (body.includes(startBytes) || body.includes(endBytes)) {
    throw new Error(`Managed markers must not appear inside the source fragment: ${name}`);
  }
  const starts = positions(original, startBytes);
  const ends = positions(original, endBytes);
  const block = Buffer.concat([
    startBytes, Buffer.from('\n'), body,
    body.length && body[body.length - 1] === 10 ? Buffer.alloc(0) : Buffer.from('\n'),
    endBytes,
  ]);
  if (!starts.length && !ends.length) {
    const separator = original.length === 0 ? '' :
      original[original.length - 1] === 10 ? '\n' : '\n\n';
    return Buffer.concat([original, Buffer.from(separator), block, Buffer.from('\n')]);
  }
  if (starts.length !== 1 || ends.length !== 1 || starts[0] >= ends[0] ||
      !standalone(original, starts[0], startBytes.length) ||
      !standalone(original, ends[0], endBytes.length)) {
    throw new Error(`Malformed managed block in ${name}; no files were changed.`);
  }
  return Buffer.concat([
    original.subarray(0, starts[0]), block,
    original.subarray(ends[0] + endBytes.length),
  ]);
}

/** Plan the entire installation before writing. Existing memory stays unread. */
export async function install(target, { apply = false, packageRoot = DEFAULT_PACKAGE_ROOT } = {}) {
  const targetRoot = path.resolve(target);
  packageRoot = path.resolve(packageRoot);
  await checkPath(packageRoot);
  await checkPath(targetRoot);
  if (targetRoot === packageRoot || targetRoot.startsWith(packageRoot + path.sep) ||
      packageRoot.startsWith(targetRoot + path.sep)) {
    throw new Error('The extension pack and target must be separate directories, not nested.');
  }
  await requireFile(path.join(targetRoot, 'AGENTS.md'));
  await requireFile(path.join(targetRoot, 'DATA_CONTRACT.md'));

  const writes = [];
  const preservedMemory = [];
  // Reject links anywhere in the pack, even in a file not selected for copying.
  await listFiles(packageRoot);
  const skillsRoot = path.join(packageRoot, '.agents', 'skills');
  const skillFiles = await listFiles(skillsRoot);
  if (!skillFiles.some(file => path.basename(file) === 'SKILL.md')) {
    throw new Error('The pack contains no skills.');
  }
  const memoryRoot = path.join(packageRoot, 'rules', 'memory');
  const memoryFiles = await listFiles(memoryRoot);
  const fragmentPath = path.join(packageRoot, 'rules', 'AGENTS.fragment.md');
  await requireFile(fragmentPath);

  async function planCopy(source, destination, seedOnly = false) {
    await checkPath(destination);
    const stat = await statIfPresent(destination);
    if (stat && !stat.isFile()) throw new Error(`Expected a regular file: ${destination}`);
    if (stat && seedOnly) {
      preservedMemory.push(path.relative(targetRoot, destination));
      return;
    }
    const content = await fs.readFile(source);
    if (stat) {
      if (!(await fs.readFile(destination)).equals(content)) {
        throw new Error(`Existing skill differs; resolve it manually before installing: ${destination}`);
      }
      return;
    }
    writes.push({ file: destination, content, original: null });
  }

  // Check whole destination skill trees, including extra locally added entries.
  const skillNames = new Set(skillFiles.map(file => path.relative(skillsRoot, file).split(path.sep)[0]));
  for (const name of skillNames) {
    const destination = path.join(targetRoot, '.agents', 'skills', name);
    await checkPath(destination);
    if (await statIfPresent(destination)) await listFiles(destination);
  }
  for (const source of skillFiles) {
    await planCopy(source, path.join(targetRoot, '.agents', 'skills', path.relative(skillsRoot, source)));
  }
  for (const source of memoryFiles) {
    await planCopy(source, path.join(targetRoot, 'memory', path.relative(memoryRoot, source)), true);
  }
  async function planManaged(relative, body, start, end) {
    const file = path.join(targetRoot, relative);
    await checkPath(file);
    const stat = await statIfPresent(file);
    if (stat && !stat.isFile()) throw new Error(`Expected a regular file: ${file}`);
    const original = stat ? await fs.readFile(file) : null;
    const content = managedContent(original ?? Buffer.alloc(0), body, start, end, relative);
    if (!original?.equals(content)) writes.push({ file, content, original });
  }
  await planManaged('AGENTS.md', await fs.readFile(fragmentPath), AGENTS_START, AGENTS_END);
  await planManaged('.gitignore', Buffer.from(PRIVATE_PATHS.join('\n') + '\n'), IGNORE_START, IGNORE_END);

  if (apply) {
    // Recheck all planned destinations before the first mutation.
    for (const write of writes) {
      await checkPath(write.file);
      const present = await statIfPresent(write.file);
      if (write.original === null ? Boolean(present) :
          !present?.isFile() || !(await fs.readFile(write.file)).equals(write.original)) {
        throw new Error(`Destination changed during preflight: ${write.file}`);
      }
    }
    for (const write of writes) {
      await checkPath(write.file);
      await fs.mkdir(path.dirname(write.file), { recursive: true });
      const flags = write.original === null
        ? constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW
        : constants.O_RDWR | constants.O_NOFOLLOW;
      const handle = await fs.open(write.file, flags, 0o644);
      try {
        if (write.original !== null) {
          if (!(await handle.readFile()).equals(write.original)) {
            throw new Error(`Destination changed before writing: ${write.file}`);
          }
          await handle.truncate(0);
        }
        let offset = 0;
        while (offset < write.content.length) {
          const { bytesWritten } = await handle.write(write.content, offset, write.content.length - offset, offset);
          if (bytesWritten === 0) throw new Error(`Could not finish writing: ${write.file}`);
          offset += bytesWritten;
        }
      } finally { await handle.close(); }
    }
  }
  return {
    applied: apply,
    targetRoot,
    changes: writes.map(write => path.relative(targetRoot, write.file)),
    preservedMemory,
  };
}

async function main(args) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('Usage: node scripts/install.mjs /path/to/career-ops [--apply]\nDefault: dry run. --apply writes the reviewed changes.');
    return;
  }
  const targets = args.filter(arg => !arg.startsWith('-'));
  if (targets.length !== 1 || args.some(arg => arg.startsWith('-') && arg !== '--apply') ||
      args.filter(arg => arg === '--apply').length > 1) {
    throw new Error('Usage: node scripts/install.mjs /path/to/career-ops [--apply]');
  }
  const result = await install(targets[0], { apply: args.includes('--apply') });
  console.log(`${result.applied ? 'Applied' : 'Dry run'}: ${result.changes.length} file change(s) in ${result.targetRoot}`);
  for (const file of result.changes) console.log(`  ${file}`);
  if (result.preservedMemory.length) console.log(`Preserved ${result.preservedMemory.length} existing memory file(s).`);
  if (!result.applied && result.changes.length) console.log('Review the plan, then rerun with --apply to install.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(error => {
    console.error(`Install refused: ${error.message}`);
    process.exitCode = 1;
  });
}
