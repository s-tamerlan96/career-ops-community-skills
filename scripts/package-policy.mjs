// Deliberately exact: new files require a review and an explicit policy change.
export const skillResources = {
  'career-case-handoff': ['SKILL.md', 'agents/openai.yaml', 'assets/HANDOFF.template.md', 'assets/INDEX.template.md', 'assets/case.template.json', 'scripts/audit-handoffs.mjs'],
  'career-growth-loop': ['SKILL.md', 'agents/openai.yaml'],
  'compensation-research-flow': ['SKILL.md', 'agents/openai.yaml', 'references/russian-source-audit.md'],
  'error-review': ['SKILL.md'],
  'interview-feedback-loop': ['SKILL.md', 'agents/openai.yaml'],
  'interview-prep-flow': ['SKILL.md', 'agents/openai.yaml'],
  'mock-interview-loop': ['SKILL.md', 'agents/openai.yaml'],
  'pm-interview-coach': ['SKILL.md', 'agents/openai.yaml', 'references/question-bank.md', 'references/rubric.md'],
  'tailor-cv': ['SKILL.md', 'agents/openai.yaml'],
};

export const allowedFiles = [
  '.gitignore', 'AGENTS.md', 'LICENSE', 'ORIGIN.md',
  'PRIVACY.md', 'README.md', 'VALIDATION.md', 'package.json', 'package-manifest.json',
  'rules/AGENTS.fragment.md',
  ...['cv_flow', 'errors', 'errors_archive', 'permissions', 'quality_bar', 'rules', 'source_map'].map(n => `rules/memory/${n}.md`),
  ...Object.entries(skillResources).flatMap(([name, files]) => files.map(p => `.agents/skills/${name}/${p}`)),
  'scripts/install.mjs', 'scripts/package-policy.mjs', 'scripts/check-package.mjs', 'scripts/update-manifest.mjs',
  'tests/install.test.mjs', 'tests/package.test.mjs', 'tests/handoff.test.mjs',
].sort();
