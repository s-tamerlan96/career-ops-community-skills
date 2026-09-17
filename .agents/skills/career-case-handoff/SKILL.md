---
name: career-case-handoff
description: Capture, audit, and resume a career vacancy or hiring-process case across Codex chats, sessions, or computers by writing a reconstructible local handoff under data/case-handoffs. Use when the user asks to save or transfer chat context, prepare active cases for a laptop or new chat, audit migration readiness, list active hiring processes, or continue a previously saved career case.
---

# Career Case Handoff

Preserve enough verified working state to continue a career case in a fresh chat. Do not promise a verbatim or complete chat export.

## Choose the action

- `capture`: save the current case. Use by default for "save/export/transfer this chat".
- `resume <case-id>`: reconstruct a case in a new chat.
- `audit`: find candidate active cases and check transfer readiness.

Store all outputs inside:

```text
data/case-handoffs/
  INDEX.md
  <case-id>/
    case.json
    HANDOFF.md
```

Use lowercase hyphenated `case-id`, normally `<company>-<role>`. Run commands from the user's career workspace root. The bundled auditor also accepts the workspace path as a positional argument; it requires Node.js and no third-party packages.

## Truth and safety boundary

- Treat the handoff as a reconstructible state snapshot, not a transcript archive.
- Never claim that hidden reasoning, unavailable earlier turns, deleted messages, tool state, or external application state was captured.
- Separate `confirmed facts`, `user decisions`, `agent interpretation`, and `open questions`.
- Never turn an inference into a candidate fact, career claim, authorship claim, application status, interview result, or recruiter promise.
- Prefer current-chat user statements and the newest dated artifact over older indexes or trackers.
- Record conflicts instead of silently choosing one source.
- Reference project-relative files instead of copying their contents. Never store absolute machine paths in a ready handoff.
- Do not copy files from outside the project unless the user explicitly asks. List them as external dependencies instead.
- Do not include tokens, credentials, private email addresses, phone numbers, or irrelevant personal data.
- Do not send messages, submit applications, or change external state during `capture`, `resume`, or `audit`.

## Capture

1. Identify one case. Ask a short question only if the company or role is ambiguous.
2. Inspect the visible current conversation and only the relevant project files.
3. If thread tools are available, record the current thread ID and title in `case.json`. Do not depend on the thread being available on the next computer.
4. Create or update `case.json` from `assets/case.template.json`.
5. Create or update `HANDOFF.md` from `assets/HANDOFF.template.md`.
6. Update `data/case-handoffs/INDEX.md` using `assets/INDEX.template.md` when needed.
7. Set `ready_for_resume` to `true` only when:
   - the current stage and next action are explicit;
   - every required project file exists;
   - conflicts and missing context are listed;
   - no unresolved external file is required for the next action.
8. Run:

```sh
node .agents/skills/career-case-handoff/scripts/audit-handoffs.mjs
```

9. Report what was captured, what was not accessible, and whether the case is ready.

In `external_dependencies`, record optional context with `required: false`. For a dependency needed by the next action, use `required: true` and set `resolved: true` only after verifying that the needed input is usable in the environment where the case will resume. For example:

```json
{"description": "External reference needed for the next review", "required": true, "resolved": false}
```

An unresolved required dependency prevents readiness. Plain strings may preserve a draft note, but do not establish whether a dependency is optional or resolved and therefore also prevent readiness until classified. An empty array means no external dependencies are needed or recorded.

Do not overwrite a newer handoff with older chat state. If dates conflict, preserve the newer state and add the older information only when it remains relevant.

## Resume

1. Read `data/case-handoffs/<case-id>/case.json`.
2. Read its `HANDOFF.md`.
3. Load only `files_to_read_first`, in order. Do not scan the entire project.
4. Check that each required file exists and that the handoff is not contradicted by a newer dated artifact.
5. Start the reply with:
   - last confirmed stage and date;
   - current next action;
   - unresolved questions or conflicts;
   - any missing dependency.
6. When status may have changed since `updated_at`, verify current evidence or ask for an update before taking an action that depends on it. Continue independent read-only preparation.
7. Preserve the existing case identity. Do not merge facts from another company, vacancy, or interview.
8. After meaningful new information, update the handoff and index before ending the work session when the user asks to keep it portable.

## Audit active cases

Compare these sources when available:

1. Explicit current user statement.
2. Newest dated case artifact under `interview-prep/opportunities/`.
3. `interview-prep/active-opportunities.md`.
4. `data/applications.md` or `tracker.mjs`.
5. Recent Codex threads for this project.

Classify each candidate as:

- `active`: next interview, task, or decision is confirmed;
- `waiting`: waiting for company/recruiter feedback;
- `paused`: user intentionally deferred it;
- `closed`: explicit rejection, withdrawal, or completion;
- `needs-confirmation`: sources conflict or the last promised action is overdue.

Folder existence and recent chat activity are evidence of work, not proof that a hiring process is active. Show the evidence date and confidence for every candidate. Ask the user to confirm ambiguous cases before capturing them as active.

## New-chat LLM risk gate

Before marking a case ready, check:

- **False completeness:** unavailable chat history is named under `Coverage gaps`.
- **Hallucinated continuity:** interpretations are not written as facts.
- **Stale status:** the last confirmed event has a date and source.
- **Case mixing:** company, role, contacts, and artifacts belong to one case.
- **Broken paths:** all required paths are project-relative and exist.
- **Context overload:** `files_to_read_first` contains the smallest sufficient set, normally 2-6 files.
- **Lost user correction:** case-specific corrections and explicit preferences are recorded.
- **Untracked external dependency:** local files, Drive docs, messages, calendars, or URLs needed next are listed.
- **Unsafe momentum:** `resume` does not treat a draft message as approved or a prepared application as submitted.

If any of the first five checks fail, leave `ready_for_resume: false`.
