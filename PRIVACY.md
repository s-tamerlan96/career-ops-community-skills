# Publication privacy boundary

The release was assembled from an explicit list of reusable skill resources and freshly written generic rules. It was not made by copying an entire personal workspace and removing a few obvious files.

## Excluded

- CV, profile, positioning, voice samples, contacts, signatures and personal links.
- Applications, saved vacancies, interview transcripts, correspondence, offers, compensation targets and negotiations.
- Active hiring or post-hire cases, employer documents, non-public metrics and project-specific examples.
- Original memory/error history, conversation archives, thread identifiers and machine-level agent state.
- Source Git history, remotes, credentials, environment files, dependencies, caches, databases and binary documents.

All examples and templates are generic. Russian compensation guidance describes how to audit evidence; it contains no historical personal offer or salary dataset and no current tax-rate advice.

## Release checks

1. Every included skill resource and rule was reviewed for direct identifiers and indirect case disclosure.
2. The local pre-publication check searched for identifiers from the private source, including contact details and known case/project names. That private search list is deliberately not included in this public repository.
3. `scripts/check-package.mjs` rejects unexpected files, links, binary text, hash mismatches, common token/key patterns, personal contact patterns, machine paths and document-sharing links. It reports categories and locations without echoing matched secret values.
4. The public manifest lists every release file and its SHA-256. It is an integrity inventory, not a proof of anonymity.
5. The initial Git commit is created independently of the source repository with neutral author metadata. Only the reviewed package is pushed.

The intentionally public exceptions are the upstream author's attribution, links to public projects, the publishing repository's account in its URL, release metadata, and named public tools or research sources used as examples. The MCP section describes generic integration purposes and links to official documentation; it does not include private meetings, designs, documents, account configuration or credentials. The hosting account remains visible on GitHub.

No finite scan establishes protection against every possible indirect inference. Checks apply to the reviewed release; run them and review context again before adding or publishing files. Do not submit personal CVs, transcripts, compensation terms, credentials or employer material in issues or pull requests.
