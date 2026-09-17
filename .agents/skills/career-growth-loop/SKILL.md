---
name: career-growth-loop
description: Build and maintain an evidence-based post-hire career-growth case after an offer is accepted. Use for pre-onboarding preparation, onboarding intake, 30/60/90 planning, probation checkpoints, weekly impact and decision logs, stakeholder mapping, goals and development on a new role, feedback loops, risk registers, performance reviews, promotion cases, compensation reviews, and compensation checkpoints.
---

# Career Growth Loop

Maintain a separate post-hire record that turns real work evidence into onboarding, performance, growth, promotion, and compensation artifacts without inventing goals or exporting confidential employer data.

## Set the boundary

1. Store case data only in the user's private career workspace, normally `data/career-growth/<case-id>/`. These paths are output conventions, not bundled candidate data; create only what the task requires.
2. Keep personal facts, employer facts, compensation, names, dates, and work evidence out of this skill directory.
3. Read a hiring case only to seed the accepted-offer baseline. Do not append post-hire events to the hiring case.
4. Treat the hiring case as historical source material. Treat the career-growth directory as the source of truth for events after acceptance and joining.
5. Do not edit router or system files unless the user explicitly expands scope.
6. Do not send a manager recap, message, form, or any other employer-facing content without explicit user review and approval. Drafting does not authorize sending.

## Enforce privacy

- Do not copy confidential internal documents, customer or employee data, proprietary code, credentials, access URLs, non-public metric values, or detailed internal strategy into the career repository.
- Save an anonymized external-safe summary plus a source pointer for internal evidence. A pointer may name the system, document type, owner, and date, but must not reproduce protected content or a sensitive URL.
- Generalize people and teams when identity is not needed, for example `engineering lead` or `analytics partner`.
- Ask whether a fact is safe to store when confidentiality is unclear. Until confirmed, record only that evidence exists internally.
- Separate a career claim from its support: describe the outcome at a safe level and point to where the original evidence can be verified inside the employer environment.

## Use four evidence classes

Keep these sections visibly separate in every baseline or checkpoint:

1. **Confirmed facts**: direct user statements, signed or written terms, manager-confirmed expectations, or observed work events. Add source and confirmation date.
2. **User decisions**: choices made by the user, including accepted trade-offs, development priorities, and what not to pursue.
3. **Hypotheses**: interpretations or possible outcomes. Prefix with `[HYPOTHESIS]`, include supporting signal, validation owner, and validation moment.
4. **Unknowns**: missing information. Prefix with `[GAP]`, state why it matters, who can answer, and the next safe checkpoint.

Do not promote a hiring-interview summary, friendly feedback, a planned discussion, or an agent inference into a confirmed work expectation.

## Start a case safely

1. Inspect the requested case directory and preserve existing user data.
2. Read only the source files needed to recover the accepted offer, role wording, relevant feedback, and stated team context.
3. Create or update `baseline.md` with case state, source boundary, the four evidence classes, privacy rules, and source pointers.
4. Create or update `onboarding-intake.md` with questions for the first day, first week, and manager conversation.
5. If the start date or onboarding inputs are missing, stop at the safe baseline and intake. Do not create a fictional 30/60/90 plan.
6. State the next evidence-gathering action and the condition that unlocks planning.

## Gate planning on real inputs

Create `outcome-map.md` and `30-60-90.md` only after the user supplies manager- or team-confirmed inputs. Require enough evidence to distinguish:

- business or product outcome from activity;
- owned outcome from contribution or dependency;
- current baseline from target;
- success criterion from diagnostic metric or guardrail;
- decision right from influence or consultation;
- probation expectation from longer-term development.

Do not invent KPI, OKR, metric baselines, targets, stakeholder relationships, authority, review cadence, probation goals, or calendar dates. When only relative timing is known, use `Day 30`, `Day 60`, and `Day 90` without assigning dates.
Do not prescribe an arbitrary number of outcomes, metrics, stakeholders, or checkpoints. Let confirmed scope determine the count.

## Build artifacts after intake

Create only artifacts justified by the current checkpoint:

- `outcome-map.md`: manager-confirmed outcomes, evidence, dependencies, metrics or decision criteria, and unresolved gaps.
- `30-60-90.md`: agreed outcomes, learning goals, decisions, dependencies, and review moments for each phase.
- `weekly-log.md`: dated evidence, decisions, contribution, outcome signal, blockers, feedback, source pointer, and next action.
- `stakeholder-map.md`: confirmed working relationships, expectations, influence, decision rights, cadence, and open questions.
- `feedback-log.md`: feedback wording, source, observed example, response, experiment in behavior, and follow-up date.
- `risk-register.md`: risk, evidence, likelihood and impact as qualitative judgments, owner, mitigation, trigger, and review date.
- `review-evidence.md`: role expectations mapped to anonymized outcomes, decisions, collaboration evidence, growth, and gaps.
- `compensation-checkpoint.md`: confirmed pay terms, review event, market or internal inputs supplied by the user, evidence of expanded scope, and negotiation unknowns.

Use one artifact when it can serve the need. Do not create an empty document set at case start.

## Run the recurring loop

At each weekly or milestone update:

1. Capture what happened before interpreting it.
2. Classify each item as owned result, contribution, learning, decision, feedback, risk, or unknown.
3. Remove or anonymize confidential detail.
4. Link the item to a confirmed outcome only when that relationship is supported.
5. Record the next decision or validation step.
6. Promote repeated, well-supported evidence into review or promotion material; do not copy raw diary text verbatim.

At probation, performance, promotion, or compensation checkpoints, distinguish:

- completed outcomes from activities;
- direct evidence from self-assessment;
- expanded scope from normal role expectations;
- temporary ownership from durable responsibility;
- verbal signals from written decisions;
- base compensation, bonus, benefits, and one-off payments.

## Handle corrections

When the user corrects a fact, update the affected user-layer artifact, preserve the new source and date, and remove dependent hypotheses that no longer hold. Do not rewrite historical hiring artifacts unless the user explicitly asks.

## Finish every run

Report:

- what changed in the career-growth case;
- which facts remain confirmed, hypothetical, or unknown;
- which private details were deliberately not stored;
- the next checkpoint and the input needed to unlock it.
