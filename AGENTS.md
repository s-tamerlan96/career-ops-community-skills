# Maintaining this extension package

This is a public, candidate-neutral rules and skills package for career-ops. It is not a personal career workspace.

- Keep changes inside the reusable skills, generic rules, installation/check scripts, tests and release documentation.
- Never add candidate profiles, work histories, real interview or employer cases, correspondence, credentials, local machine paths, or private memory.
- Preserve upstream attribution and license; describe additions separately from upstream capabilities.
- Do not edit a user's career workspace while maintaining this repository. Test installation in isolated fixtures.
- Review new files for indirect personal context before adding them to `package-manifest.json`.
- After reviewed edits run `node scripts/update-manifest.mjs`, then `npm test`.
- A request to draft or review does not authorize external publication. When publication is requested, publish only the reviewed package, never source workspace history.
- Skill metadata validation is not proof of live integration behavior. State which checks actually ran.
