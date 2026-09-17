import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { install } from '../scripts/install.mjs';

const installer = fileURLToPath(new URL('../scripts/install.mjs', import.meta.url));

async function put(root, name, content) {
  const file = path.join(root, name);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

async function fixture(t) {
  // macOS exposes its temporary directory through a system symlink.
  const directory = await fs.mkdtemp(path.join(await fs.realpath(os.tmpdir()), 'career-skills-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const pack = path.join(directory, 'pack');
  const target = path.join(directory, 'target');
  await put(pack, '.agents/skills/example-a/SKILL.md', '# Example A\n');
  await put(pack, '.agents/skills/example-b/SKILL.md', '# Example B\n');
  await put(pack, 'rules/AGENTS.fragment.md', 'Read memory/rules.md before sensitive work.\n');
  await put(pack, 'rules/memory/rules.md', '# Process rules\n');
  await put(pack, 'rules/memory/errors.md', '# Error inbox\n');
  await put(target, 'AGENTS.md', '# Existing instructions\r\nKeep these bytes.\r\n');
  await put(target, 'DATA_CONTRACT.md', '# Existing data contract\n');
  return { directory, pack, target, run: options => install(target, { packageRoot: pack, ...options }) };
}

async function snapshot(root) {
  const output = {};
  async function walk(directory) {
    for (const name of (await fs.readdir(directory)).sort()) {
      const file = path.join(directory, name);
      const stat = await fs.lstat(file);
      const relative = path.relative(root, file);
      if (stat.isSymbolicLink()) output[relative] = `symlink:${await fs.readlink(file)}`;
      else if (stat.isDirectory()) { output[relative] = 'directory'; await walk(file); }
      else output[relative] = (await fs.readFile(file)).toString('base64');
    }
  }
  await walk(root);
  return output;
}

test('default dry run and CLI leave every target byte unchanged', async t => {
  const f = await fixture(t);
  const before = await snapshot(f.target);
  const result = await f.run();
  assert.equal(result.applied, false);
  assert.ok(result.changes.includes('AGENTS.md'));
  assert.deepEqual(await snapshot(f.target), before);
  await put(f.pack, 'scripts/install.mjs', await fs.readFile(installer));
  const cli = spawnSync(process.execPath, [path.join(f.pack, 'scripts/install.mjs'), f.target], { encoding: 'utf8' });
  assert.equal(cli.status, 0, cli.stderr);
  assert.match(cli.stdout, /Dry run/);
  assert.deepEqual(await snapshot(f.target), before);
});

test('apply installs skills, seeds process memory, protects user paths, and is idempotent', async t => {
  const f = await fixture(t);
  const prefix = await fs.readFile(path.join(f.target, 'AGENTS.md'));
  const first = await f.run({ apply: true });
  assert.equal(first.applied, true);
  assert.equal(await fs.readFile(path.join(f.target, '.agents/skills/example-a/SKILL.md'), 'utf8'), '# Example A\n');
  assert.equal(await fs.readFile(path.join(f.target, 'memory/errors.md'), 'utf8'), '# Error inbox\n');
  const agents = await fs.readFile(path.join(f.target, 'AGENTS.md'));
  assert.deepEqual(agents.subarray(0, prefix.length), prefix);
  const ignore = await fs.readFile(path.join(f.target, '.gitignore'), 'utf8');
  for (const protectedPath of ['/cv.md', '/data/', '/memory/', '.env.*', '/config/plugins.yml', '/plugins.local/']) {
    assert.ok(ignore.split('\n').includes(protectedPath), protectedPath);
  }
  const before = await snapshot(f.target);
  const second = await f.run({ apply: true });
  assert.deepEqual(second.changes, []);
  assert.deepEqual(await snapshot(f.target), before);
});

test('existing memory and candidate records are preserved', async t => {
  const f = await fixture(t);
  await put(f.target, 'memory/rules.md', 'Local rules must survive.\n');
  await put(f.target, 'cv.md', 'Fixture candidate record\n');
  await put(f.target, '.gitignore', '# Local ignores\r\n/local-scratch/\r\n');
  const result = await f.run({ apply: true });
  assert.ok(result.preservedMemory.includes('memory/rules.md'));
  assert.equal(await fs.readFile(path.join(f.target, 'memory/rules.md'), 'utf8'), 'Local rules must survive.\n');
  assert.equal(await fs.readFile(path.join(f.target, 'cv.md'), 'utf8'), 'Fixture candidate record\n');
  assert.ok((await fs.readFile(path.join(f.target, '.gitignore'), 'utf8')).startsWith('# Local ignores\r\n/local-scratch/\r\n'));
});

test('a differing skill aborts the whole plan before any writes', async t => {
  const f = await fixture(t);
  await put(f.target, '.agents/skills/example-b/SKILL.md', 'Local customization\n');
  const before = await snapshot(f.target);
  await assert.rejects(f.run({ apply: true }), /Existing skill differs/);
  assert.deepEqual(await snapshot(f.target), before);
});

test('source symlinks are rejected before target mutation', async t => {
  const f = await fixture(t);
  const secret = path.join(f.directory, 'outside-file');
  await fs.writeFile(secret, 'outside fixture\n');
  await fs.symlink(secret, path.join(f.pack, '.agents/skills/example-a/link.md'));
  const before = await snapshot(f.target);
  await assert.rejects(f.run({ apply: true }), /Symbolic links/);
  assert.deepEqual(await snapshot(f.target), before);
});

test('a destination directory symlink cannot escape the target', async t => {
  const f = await fixture(t);
  const outside = path.join(f.directory, 'outside');
  await fs.mkdir(outside);
  await fs.symlink(outside, path.join(f.target, '.agents'));
  const before = await snapshot(f.target);
  await assert.rejects(f.run({ apply: true }), /Symbolic links/);
  assert.deepEqual(await snapshot(f.target), before);
  assert.deepEqual(await fs.readdir(outside), []);
});

test('existing seed-memory and managed-file symlinks are rejected', async t => {
  for (const name of ['memory/rules.md', '.gitignore', 'AGENTS.md']) {
    await t.test(name, async t => {
      const f = await fixture(t);
      const external = path.join(f.directory, 'external');
      await fs.writeFile(external, 'Preserve external bytes\n');
      await fs.mkdir(path.dirname(path.join(f.target, name)), { recursive: true });
      await fs.rm(path.join(f.target, name), { force: true });
      await fs.symlink(external, path.join(f.target, name));
      const before = await snapshot(f.target);
      await assert.rejects(f.run({ apply: true }), /Symbolic links/);
      assert.deepEqual(await snapshot(f.target), before);
      assert.equal(await fs.readFile(external, 'utf8'), 'Preserve external bytes\n');
    });
  }
});

test('malformed, reversed, and duplicate managed blocks cause no partial writes', async t => {
  const start = '<!-- career-ops-community-skills:begin -->';
  const end = '<!-- career-ops-community-skills:end -->';
  const variants = [`${start}\nmissing end\n`, `${end}\n${start}\n`, `${start}\n${start}\n${end}\n`, `prefix ${start}\n${end}\n`];
  for (const [index, text] of variants.entries()) {
    await t.test(`malformed variant ${index + 1}`, async t => {
      const f = await fixture(t);
      await put(f.target, 'AGENTS.md', text);
      const before = await snapshot(f.target);
      await assert.rejects(f.run({ apply: true }), /Malformed managed block/);
      assert.deepEqual(await snapshot(f.target), before);
    });
  }
});

test('updating a valid managed block preserves its byte prefix and suffix', async t => {
  const f = await fixture(t);
  const prefix = Buffer.from([35, 32, 80, 114, 101, 102, 105, 120, 13, 10, 255, 10]);
  const suffix = Buffer.from('\r\n# User rules after block\r\n');
  await put(f.target, 'AGENTS.md', Buffer.concat([
    prefix, Buffer.from('<!-- career-ops-community-skills:begin -->\nOld instructions\n<!-- career-ops-community-skills:end -->'), suffix,
  ]));
  await f.run({ apply: true });
  const content = await fs.readFile(path.join(f.target, 'AGENTS.md'));
  assert.deepEqual(content.subarray(0, prefix.length), prefix);
  assert.deepEqual(content.subarray(-suffix.length), suffix);
  assert.ok(content.includes(Buffer.from('Read memory/rules.md')));
  assert.ok(!content.includes(Buffer.from('Old instructions')));
});

test('a malformed ignore block also aborts before copying skills', async t => {
  const f = await fixture(t);
  await put(f.target, '.gitignore', '# BEGIN career-ops-community-skills privacy\n/cv.md\n');
  const before = await snapshot(f.target);
  await assert.rejects(f.run({ apply: true }), /Malformed managed block/);
  assert.deepEqual(await snapshot(f.target), before);
});

test('a symlink anywhere in the pack is rejected, including unused assets', async t => {
  const f = await fixture(t);
  await fs.symlink(path.join(f.directory, 'outside'), path.join(f.pack, 'unused-link'));
  const before = await snapshot(f.target);
  await assert.rejects(f.run({ apply: true }), /Symbolic links/);
  assert.deepEqual(await snapshot(f.target), before);
});

test('missing upstream contract and nested pack directories are refused', async t => {
  const f = await fixture(t);
  await fs.rm(path.join(f.target, 'DATA_CONTRACT.md'));
  const before = await snapshot(f.target);
  await assert.rejects(f.run({ apply: true }), /Required regular file/);
  assert.deepEqual(await snapshot(f.target), before);
  await assert.rejects(install(f.pack, { packageRoot: f.pack, apply: true }), /separate directories/);
});
