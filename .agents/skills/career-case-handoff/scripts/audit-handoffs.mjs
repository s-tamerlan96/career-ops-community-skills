#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const rootArg = args.find((arg) => arg !== '--json');
const root = path.resolve(rootArg || process.cwd());
const handoffsRoot = path.join(root, 'data', 'case-handoffs');
const allowedStatuses = new Set(['active', 'waiting', 'paused', 'closed', 'needs-confirmation']);
const requiredFields = [
  'schema_version',
  'case_id',
  'title',
  'case_type',
  'status',
  'updated_at',
  'last_confirmed_event_at',
  'next_action',
  'ready_for_resume',
  'source_threads',
  'files_to_read_first',
  'required_files',
  'external_dependencies',
  'coverage_gaps'
];
const requiredHeadings = [
  '## Start here',
  '## Confirmed facts',
  '## User decisions and preferences',
  '## Agent interpretation',
  '## Work completed',
  '## Files to read first',
  '## Open questions and conflicts',
  '## Risks and do-not-assume',
  '## Next actions',
  '## External dependencies',
  '## Coverage gaps',
  '## Resume instruction'
];

const report = { root, handoffsRoot, cases: [], errors: [], warnings: [] };

function isPortableRelative(filePath) {
  return typeof filePath === 'string'
    && filePath.trim().length > 0
    && !path.isAbsolute(filePath)
    && !path.win32.isAbsolute(filePath)
    && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(filePath)
    && !filePath.split(/[\\/]+/).includes('..');
}

function isInsideRoot(filePath) {
  const relative = path.relative(fs.realpathSync(root), fs.realpathSync(filePath));
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function isActualIsoDate(value, allowDateOnly = false) {
  if (typeof value !== 'string') return false;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
  const timestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
  if (!(timestamp.test(value) || (allowDateOnly && dateOnly.test(value)))) return false;
  if (!Number.isFinite(Date.parse(value))) return false;
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const calendar = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return calendar.getUTCFullYear() === year && calendar.getUTCMonth() + 1 === month && calendar.getUTCDate() === day;
}

function isFilledText(value) {
  return typeof value === 'string' && value.trim().length > 0
    && !/<[^>]+>|\b(?:TODO|TBD|YYYY)\b/i.test(value)
    && !/^(?:unknown|none|n\/a|pending|-|company\s*\/\s*role)$/i.test(value.trim());
}

function unresolvedRequiredDependency(dependency) {
  // The schema intentionally permits varied dependency records. Ready cases
  // must make optionality or resolution explicit, rather than infer it.
  if (!dependency || typeof dependency !== 'object' || Array.isArray(dependency)) return true;
  if (dependency.required === false) return false;
  return dependency.resolved !== true;
}

function pushCaseIssue(caseReport, level, message) {
  caseReport[level].push(message);
  report[level].push(`${caseReport.case_id}: ${message}`);
}

if (!fs.existsSync(handoffsRoot)) {
  report.errors.push('Missing data/case-handoffs directory.');
} else {
  const indexPath = path.join(handoffsRoot, 'INDEX.md');
  if (!fs.existsSync(indexPath)) report.warnings.push('Missing data/case-handoffs/INDEX.md.');

  const entries = fs.readdirSync(handoffsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const caseReport = { case_id: entry.name, ready: false, errors: [], warnings: [] };
    report.cases.push(caseReport);
    const caseDir = path.join(handoffsRoot, entry.name);
    const jsonPath = path.join(caseDir, 'case.json');
    const handoffPath = path.join(caseDir, 'HANDOFF.md');

    if (!fs.existsSync(jsonPath)) pushCaseIssue(caseReport, 'errors', 'Missing case.json.');
    if (!fs.existsSync(handoffPath)) pushCaseIssue(caseReport, 'errors', 'Missing HANDOFF.md.');
    if (!fs.existsSync(jsonPath) || !fs.existsSync(handoffPath)) continue;

    let data;
    try {
      data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (error) {
      pushCaseIssue(caseReport, 'errors', `Invalid case.json: ${error.message}`);
      continue;
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      pushCaseIssue(caseReport, 'errors', 'case.json must contain an object.');
      continue;
    }

    for (const field of requiredFields) {
      if (!(field in data)) pushCaseIssue(caseReport, 'errors', `Missing field ${field}.`);
    }
    if (data.schema_version !== 1) pushCaseIssue(caseReport, 'errors', 'schema_version must be 1.');
    if (data.case_id !== entry.name) pushCaseIssue(caseReport, 'errors', 'case_id must match its directory name.');
    if (!allowedStatuses.has(data.status)) pushCaseIssue(caseReport, 'errors', `Unknown status ${data.status}.`);
    if (typeof data.ready_for_resume !== 'boolean') pushCaseIssue(caseReport, 'errors', 'ready_for_resume must be boolean.');
    for (const field of ['title', 'case_type', 'next_action']) {
      if (!isFilledText(data[field])) pushCaseIssue(caseReport, 'errors', `${field} must contain non-placeholder text${field === 'next_action' ? ' describing the next action' : ''}.`);
    }
    if (!isActualIsoDate(data.updated_at)) pushCaseIssue(caseReport, 'errors', 'updated_at must be an actual ISO timestamp with a timezone.');
    if (!isActualIsoDate(data.last_confirmed_event_at, true)) pushCaseIssue(caseReport, 'errors', 'last_confirmed_event_at must be an actual ISO date or timestamp.');

    const arrays = {};
    for (const field of ['source_threads', 'files_to_read_first', 'required_files', 'external_dependencies', 'coverage_gaps']) {
      if (!Array.isArray(data[field])) pushCaseIssue(caseReport, 'errors', `${field} must be an array.`);
      arrays[field] = Array.isArray(data[field]) ? data[field] : [];
    }

    for (const filePath of [...arrays.files_to_read_first, ...arrays.required_files]) {
      if (!isPortableRelative(filePath)) {
        pushCaseIssue(caseReport, 'errors', `Non-portable project path: ${filePath}`);
        continue;
      }
      const evidencePath = path.join(root, filePath);
      if (!fs.existsSync(evidencePath)) {
        pushCaseIssue(caseReport, 'errors', `Referenced file does not exist: ${filePath}`);
      } else if (!isInsideRoot(evidencePath)) {
        pushCaseIssue(caseReport, 'errors', `Referenced file resolves outside the project: ${filePath}`);
      }
    }
    if (data.ready_for_resume && arrays.external_dependencies.some(unresolvedRequiredDependency)) {
      pushCaseIssue(caseReport, 'errors', 'Required or unclassified external dependency is unresolved; record required: false for optional context or resolved: true for a verified dependency.');
    }

    const handoff = fs.readFileSync(handoffPath, 'utf8');
    for (const heading of requiredHeadings) {
      if (!handoff.includes(heading)) pushCaseIssue(caseReport, 'errors', `Missing heading: ${heading}`);
    }
    if (/\bTODO\b|<Company>|<Role>|<case-id>|<YYYY/i.test(handoff)) {
      pushCaseIssue(caseReport, 'errors', 'HANDOFF.md still contains template placeholders.');
    }
    if (/(?:^|[\s"'`(<])[A-Za-z]:[\\/]/m.test(handoff) || /(?:^|[\s"'`(<])\\\\[^\\\s]+\\/m.test(handoff)) {
      pushCaseIssue(caseReport, 'errors', 'HANDOFF.md contains an absolute Windows path.');
    }
    if (/(?:^|[\s"'`(<])(?:\/(?:Users|home)\/[^\s/]+|\/root(?:\/|\b)|~\/)/m.test(handoff)) {
      pushCaseIssue(caseReport, 'errors', 'HANDOFF.md contains a machine-specific home path.');
    }
    if (data.ready_for_resume && caseReport.errors.length > 0) {
      pushCaseIssue(caseReport, 'errors', 'Marked ready_for_resume despite validation errors.');
    }
    caseReport.ready = Boolean(data.ready_for_resume) && caseReport.errors.length === 0;
  }
}

report.ok = report.errors.length === 0;
report.summary = {
  cases: report.cases.length,
  ready: report.cases.filter((item) => item.ready).length,
  errors: report.errors.length,
  warnings: report.warnings.length
};

if (jsonMode) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Handoff audit: ${report.summary.ready}/${report.summary.cases} ready`);
  for (const item of report.cases) {
    console.log(`- ${item.case_id}: ${item.ready ? 'READY' : 'NOT READY'} (${item.errors.length} errors, ${item.warnings.length} warnings)`);
  }
  for (const error of report.errors) console.error(`ERROR: ${error}`);
  for (const warning of report.warnings) console.warn(`WARN: ${warning}`);
}

process.exitCode = report.ok ? 0 : 1;
