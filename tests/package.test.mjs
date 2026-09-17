import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkPackage, inspectText, packageRoot } from '../scripts/check-package.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'community-package-test-'));
  fs.cpSync(packageRoot, root, { recursive: true, filter: p => path.basename(p) !== '.git' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test('checked release passes inventory and content checks', () => {
  assert.deepEqual(checkPackage().errors, []);
});

test('scanner finds representative sensitive values without returning their content', () => {
  const email = ['candidate', 'private.example'].join('@');
  assert.deepEqual(inspectText(email), ['personal email']);
  assert.ok(inspectText('ghp_' + 'A'.repeat(36)).includes('service token'));
  assert.ok(inspectText(['', 'Users', 'candidate', 'cv.md'].join('/')).includes('machine home path'));
  assert.ok(inspectText('https://' + 'docs.google.com/document/d/fake-id').includes('private document link'));
  assert.deepEqual(inspectText('Salary data must come from a verified source.'), []);
});

test('unexpected personal file fails even if gitignored', t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'cv.md'), '# Synthetic candidate');
  assert.ok(checkPackage(root).errors.some(e => e.includes('not in release allowlist')));
});

test('changed approved file fails its hash', t => {
  const root = fixture(t);
  fs.appendFileSync(path.join(root, 'README.md'), '\nChanged.\n');
  assert.ok(checkPackage(root).errors.some(e => e.includes('SHA-256 differs')));
});

test('symlink is rejected without following its target', t => {
  const root = fixture(t);
  fs.symlinkSync(path.join(root, 'README.md'), path.join(root, 'unsafe-link'));
  assert.ok(checkPackage(root).errors.some(e => e.includes('symlink forbidden')));
});
