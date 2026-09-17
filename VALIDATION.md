# Release validation

Release: 1.0.0. Review date: 2026-09-17.

## Verified locally

- All 48 release files are UTF-8 text and belong to an explicit allowlist. The manifest covers the other 47 files by SHA-256; it intentionally cannot hash itself.
- Nine focused skills pass the bundled `skill-creator` frontmatter validator. All JavaScript files pass Node syntax checks.
- The complete package installs into an isolated fixture using the local upstream `AGENTS.md` and `DATA_CONTRACT.md`: 33 intended files, zero writes during dry-run, and zero changes on the second installation.
- Installer regression tests cover preserving existing memory and candidate files, refusing conflicting skill files, malformed managed blocks, and source/destination symlinks.
- Privacy regression tests cover extra files, changed hashes, symlinks and representative synthetic sensitive values. The scanner reports categories without printing matching values.
- All nine skills and every reference, template, rule and release file received contextual review. A separate review pass found no private identity/contact details, compensation facts or recognizable private case narratives.
- A local-only identifier scan against the private source found no matches after excluding the documented public repository URL. Its private search terms are not distributed.
- Source Git history is excluded. The release starts from a new repository with neutral community author metadata.

Final local result: **53 tests passed, 0 failed, 0 skipped** on Node.js 22.22.3 (macOS). The handoff checks include a ready case with a public HTTPS source, malformed JSON shapes, missing evidence, traversal/symlink escapes, template metadata, real dates, machine paths, and unresolved required dependencies. These checks do not evaluate the truth of the evidence supplied by a user.

## Scope limits

Checks run locally with `npm test`. A GitHub Actions workflow is not included in this release because the publishing authorization does not include the `workflow` scope. No broader account permission was requested or changed.

The baseline is a local career-ops v1.16.0 installation, not a test of every current upstream feature. Skill metadata checks and synthetic cases do not establish live recruitment outcomes or correct behavior of every agent. No live email, application, calendar, design editor, meeting connector, compensation service or employer system was exercised.

Checks describe this release. The public publishing account and upstream attribution remain visible, and automated matching cannot rule out all possible indirect inference.
