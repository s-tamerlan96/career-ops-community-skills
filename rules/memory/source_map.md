# Source boundaries

The upstream `AGENTS.md` and `DATA_CONTRACT.md` govern the factual source allowlist and user/system separation. This file clarifies how the extension workflows use those boundaries; it does not expand them.

| Source | Permitted use | Boundary |
|---|---|---|
| `cv.md`, `article-digest.md`, `config/profile.yml`, `modes/_profile.md` | Confirmed candidate facts, requirements, positioning | Preserve source wording, scope, and qualification; do not infer missing achievements |
| `writing-samples/`, `voice-dna.md` | Follow the upstream source contract; voice DNA governs style only | Style must not introduce factual claims |
| `interview-prep/story-bank.md`, `interview-prep/{company}-{role}.md` | Candidate-owned stories and interview notes allowed by the upstream contract | Keep actual experience separate from practice answers and employer information |
| Direct statements in the current conversation | Candidate corrections and new information within the upstream contract | Resolve ambiguity before recording; retain stricter authorship requirements |
| Case manifests, handoffs, tracker, logs | Operational continuity, evidence pointers, state, next actions | They do not independently expand the factual allowlist for CVs or outreach |
| Transcripts and source messages supplied or authorized by the user | What the source actually records | Preserve speakers, uncertainty, confidentiality, and source limitations |
| Recruiter text and vacancy descriptions | Role scope, employer statements, stated requirements | Reconcile conflicting versions; preserve dates and provenance |
| Browser posting checks | Whether a posting appears active at the time checked | Activity does not establish role scope; follow upstream verification requirements |
| Public research | External market, company, or methodology evidence | Never use it as proof of the candidate's experience |
| `memory/*` | Agent errors, reviewed process rules, quality controls, permissions | Not a source for candidate facts or achievements |
| Mock answers and generated examples | Practice and explanation | Never present them as real past answers, projects, or outcomes |

For authorship claims, require explicit attribution in `cv.md` or `article-digest.md` as required upstream. Familiarity with a tool is not authorship of that tool.

Use the freshest relevant user-provided role text when resolving role scope, and flag contradictions rather than silently replacing one version. A parser artifact or a posting-status result must not override the actual vacancy text.

When a new case fact is intended for future candidate-facing content, have the user confirm it and record it in an approved factual source. Do not promote an inference merely because it appears in several generated files.
