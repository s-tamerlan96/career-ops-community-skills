# Origin and modifications

## Upstream

- Project: [career-ops](https://github.com/career-ops-hq/career-ops).
- Original repository address: [santifer/career-ops](https://github.com/santifer/career-ops), redirected to the current organization when checked for this release.
- Original creator: Santiago Fernández de Valderrama, [santifer.io](https://santifer.io).
- License: MIT. The original copyright and permission notice are retained in `LICENSE`.
- Local integration baseline: version 1.16.0. This identifies the environment from which the extensions were extracted; it is not a claim about the current upstream version.

Upstream provides the job-search pipeline, scoring and mode system, candidate source boundary, user/system data contract, CV tooling, scanner, trackers, and multi-CLI integration. Those capabilities and the original author's search outcomes are not contributions of this extension pack.

## Local additions in this package

The nine focused skills under `.agents/skills/` were developed as additions to a local career-ops workflow. They cover case handoff, post-hire growth, compensation research, stage-specific interview preparation, mock interviews, product interview coaching, completed-interview review, CV adaptation, and error review.

Reusable additions include stage-specific rubrics and question prompts, case templates and a handoff auditor, source-quality guidance for compensation research, and generic process rules. They complement the upstream rules; overlapping evidence and authorization principles remain credited to upstream rather than presented as new inventions.

Publication-specific work includes replacing person-specific instructions with candidate-neutral wording, replacing real compensation pilots with a methodological reference, removing private case links and undeclared personal-material dependencies, normalizing skill metadata and text encoding, creating a non-overwriting installer, and adding manifest/privacy and behavior checks. The handoff auditor was also corrected to accept public HTTPS sources, report malformed input safely, and reject incomplete readiness metadata or unresolved required dependencies.

The core upstream `career-ops` router and full application are not redistributed here. Install this package beside a separately obtained upstream checkout. Original local case histories and Git history are not part of the release.

## License and attribution

This independent community extension is distributed under MIT. Preserve `LICENSE` and this origin notice when redistributing substantial portions. No endorsement by the upstream project is claimed. The neutral community copyright identifies the extension collection without publishing private candidate identity.
