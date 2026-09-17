import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { packageRoot } from '../scripts/check-package.mjs';

const skill = path.join(packageRoot, '.agents/skills/career-case-handoff');
function run(root) {
  const result = spawnSync(process.execPath, [path.join(skill, 'scripts/audit-handoffs.mjs'), root, '--json'], { encoding: 'utf8' });
  assert.equal(result.signal, null, result.stderr);
  assert.ok(result.stdout.trim().startsWith('{'), `Expected JSON report, received: ${result.stderr}`);
  return { status: result.status, report: JSON.parse(result.stdout) };
}
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'community-handoff-test-'));
  const dir = path.join(root, 'data/case-handoffs/sample-role');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(root, 'data/case-handoffs/INDEX.md'), '# Cases\n');
  const data = JSON.parse(fs.readFileSync(path.join(skill, 'assets/case.template.json'), 'utf8'));
  Object.assign(data, {
    case_id: 'sample-role', title: 'Example organization / Product role', status: 'active',
    updated_at: '2030-01-02T10:00:00+00:00', last_confirmed_event_at: '2030-01-01',
    next_action: 'Review the confirmed requirements', ready_for_resume: true,
  });
  const template = fs.readFileSync(path.join(skill, 'assets/HANDOFF.template.md'), 'utf8');
  const handoff = template.replace(/<[^>]+>/g, 'Synthetic fixture');
  fs.writeFileSync(path.join(dir, 'HANDOFF.md'), `${handoff}\nPublic source: https://example.org/role\n`);
  function save(value = data) { fs.writeFileSync(path.join(dir, 'case.json'), JSON.stringify(value)); }
  save();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, dir, data, save };
}
function assertRejected(result, message) {
  assert.equal(result.status, 1);
  assert.equal(result.report.summary.ready, 0);
  if (message) assert.ok(result.report.errors.some(e => e.includes(message)), JSON.stringify(result.report.errors));
}

test('valid handoff with a public HTTPS source is ready', t => {
  const { root } = fixture(t);
  const result = run(root);
  assert.equal(result.status, 0);
  assert.equal(result.report.summary.ready, 1);
});

test('empty synthetic workspace passes without invented cases', t => {
  const { root, dir } = fixture(t);
  fs.rmSync(dir, { recursive: true });
  const result = run(root);
  assert.equal(result.status, 0);
  assert.equal(result.report.summary.cases, 0);
});

test('unfinished handoff template cannot be marked ready', t => {
  const { root, dir } = fixture(t);
  const data = JSON.parse(fs.readFileSync(path.join(skill, 'assets/case.template.json'), 'utf8'));
  Object.assign(data, { case_id: 'sample-role', status: 'active', ready_for_resume: true });
  fs.writeFileSync(path.join(dir, 'case.json'), JSON.stringify(data));
  fs.copyFileSync(path.join(skill, 'assets/HANDOFF.template.md'), path.join(dir, 'HANDOFF.md'));
  assertRejected(run(root), 'template placeholders');
});

test('template metadata is rejected even with a completed narrative', t => {
  const { root, save } = fixture(t);
  const data = JSON.parse(fs.readFileSync(path.join(skill, 'assets/case.template.json'), 'utf8'));
  Object.assign(data, { case_id: 'sample-role', ready_for_resume: true });
  save(data);
  const result = run(root);
  assertRejected(result, 'title must contain');
  assert.ok(result.report.errors.some(e => e.includes('updated_at must be')));
  assert.ok(result.report.errors.some(e => e.includes('last_confirmed_event_at must be')));
});

test('a completed draft is not counted ready until explicitly marked ready', t => {
  const { root, data, save } = fixture(t);
  data.ready_for_resume = false;
  save();
  const result = run(root);
  assert.equal(result.status, 0);
  assert.equal(result.report.summary.ready, 0);
});

test('malformed array fields produce JSON validation errors without crashing', t => {
  const { root, data, save } = fixture(t);
  Object.assign(data, { files_to_read_first: {}, required_files: 7, external_dependencies: null });
  save();
  const result = run(root);
  assertRejected(result, 'files_to_read_first must be an array');
  assert.ok(result.report.errors.some(e => e.includes('required_files must be an array')));
  assert.ok(result.report.errors.some(e => e.includes('external_dependencies must be an array')));
});

for (const value of [null, 7, 'invalid', []]) {
  test(`top-level ${JSON.stringify(value)} produces a JSON report`, t => {
    const { root, save } = fixture(t);
    save(value);
    assertRejected(run(root), 'case.json must contain an object');
  });
}

for (const [field, value] of [
  ['title', '  '], ['title', '<Company> / <Role>'], ['next_action', ''],
  ['next_action', 'TODO'], ['updated_at', '2030-02-30T10:00:00Z'],
  ['updated_at', '2030-01-01'], ['last_confirmed_event_at', '2030-02-30'],
]) {
  test(`invalid ${field} metadata blocks readiness: ${JSON.stringify(value)}`, t => {
    const { root, data, save } = fixture(t);
    data[field] = value;
    save();
    assertRejected(run(root), `${field} must`);
  });
}

test('missing evidence blocks readiness', t => {
  const { root, data, save } = fixture(t);
  data.required_files = ['missing.md'];
  save();
  assertRejected(run(root), 'Referenced file does not exist');
});

test('existing required evidence supports readiness', t => {
  const { root, data, save } = fixture(t);
  fs.writeFileSync(path.join(root, 'evidence.md'), '# Synthetic evidence\n');
  data.required_files = ['evidence.md'];
  save();
  const result = run(root);
  assert.equal(result.status, 0);
  assert.equal(result.report.summary.ready, 1);
});

for (const evidence of ['../outside.md', '..\\outside.md']) {
  test(`parent traversal in evidence paths is rejected: ${evidence}`, t => {
    const { root, data, save } = fixture(t);
    data.required_files = [evidence];
    save();
    assertRejected(run(root), 'Non-portable project path');
  });
}

test('a symlink to evidence outside the project is rejected', t => {
  const { root, data, save } = fixture(t);
  const external = fs.mkdtempSync(path.join(os.tmpdir(), 'community-external-evidence-'));
  t.after(() => fs.rmSync(external, { recursive: true, force: true }));
  fs.writeFileSync(path.join(external, 'evidence.md'), '# Synthetic external evidence\n');
  fs.symlinkSync(path.join(external, 'evidence.md'), path.join(root, 'evidence.md'));
  data.required_files = ['evidence.md'];
  save();
  assertRejected(run(root), 'resolves outside the project');
});

for (const machinePath of ['C:\\Example\\notes.md', ['', 'home', 'example', 'notes.md'].join('/'), ['', 'Users', 'example', 'notes.md'].join('/'), '~/notes.md']) {
  test(`machine-specific narrative path is rejected: ${machinePath}`, t => {
    const { root, dir } = fixture(t);
    fs.appendFileSync(path.join(dir, 'HANDOFF.md'), `\nPrivate file: ${machinePath}\n`);
    assertRejected(run(root));
  });
}

test('an unresolved required external dependency blocks readiness', t => {
  const { root, data, save } = fixture(t);
  data.external_dependencies = [{ source: 'External document', required: true, resolved: false }];
  save();
  assertRejected(run(root), 'external dependency is unresolved');
});

test('optional external context and verified required dependencies permit readiness', t => {
  const { root, data, save } = fixture(t);
  data.external_dependencies = [
    { source: 'Optional background', required: false, resolved: false },
    { source: 'Verified input', required: true, resolved: true },
  ];
  save();
  const result = run(root);
  assert.equal(result.status, 0);
  assert.equal(result.report.summary.ready, 1);
});

test('unclassified external context cannot silently establish readiness', t => {
  const { root, data, save } = fixture(t);
  data.external_dependencies = ['External document'];
  save();
  assertRejected(run(root), 'external dependency is unresolved');
});
