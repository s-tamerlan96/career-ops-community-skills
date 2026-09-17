---
name: mock-interview-loop
description: Use when running a live mock interview or screening practice with the user, especially when the user wants a repeating loop of one interview question, their dictated answer, answer evaluation, improvement notes, a stronger "10/10" answer, and saving only the final polished answer into an interview cheatsheet. Also use when the user asks to prepare through HR screens, recruiter screens, hiring-manager rounds, product interviews, or interview question drills in a structured sequence.
---

# Mock Interview Loop

## Overview

Run interview practice as a controlled loop: one question at a time, then evaluate the user's answer, create a stronger spoken answer, save only the best version, and move to the next distinct question.

Use this together with `interview-prep-flow` when a vacancy, recruiter message, or interview pack exists.

## Before Starting

1. Load the relevant interview context when it exists. These are private user-workspace inputs and outputs, not files shipped with this pack. Use the current conversation when files are unavailable:
   - `interview-prep/active-opportunities.md`
   - the opportunity folder under `interview-prep/opportunities/{company-role}/`
   - `interview-pack.md`, `screening-research*.md`, and `cheatsheet-draft.md` if present
   - `cv.md`, `config/profile.yml`, `modes/_profile.md`, and `interview-prep/story-bank.md` when proof points are needed
2. Identify the interview stage:
   - recruiter / HR screen
   - hiring manager
   - product / technical case
   - final / CPO
3. Build or refresh a visible question queue. Include the question just answered as completed before moving on.
4. Ask one question only, then wait for the user's answer.

If there is no concrete opportunity, ask one short clarifying question about role, company, and stage before starting.

## Question Loop

For each user answer, respond in this exact structure unless the user asks for a different one:

```markdown
**Твой ответ со стороны**

...

**Оценка: X/10**

...

**Что улучшить**

...

**Ответ на 10/10**

> ...

**Следующий вопрос**

...
```

Rules:

- Treat rough wording, mixed languages, and strange terms as possible speech-recognition artifacts; confirm ambiguous facts before reusing them.
- Evaluate the underlying thought first. Only flag wording if it would clearly hurt in a real interview.
- Do not repeat a question unless the user explicitly asks to retry it.
- Do not answer a new question before evaluating the user's previous answer.
- Do not over-polish into brochure language. The best answer must sound like something the user could say aloud.
- Keep recruiter-screen answers compact, usually 45-90 seconds spoken.
- For deeper product rounds, allow longer structures, but keep the first answer clear and conversational.

## Evaluation Criteria

Score the answer against the stage:

- relevance to the role and stage
- clear structure without sounding memorized
- specific proof points from the user's real experience
- product judgment, not only task execution
- cross-functional awareness where relevant
- metrics, economics, and post-launch thinking where relevant
- risk control: no unnecessary negativity, no private constraints, no unsupported claims
- recruiter gates: location, compensation, timeline, seniority, motivation

Name the main risk plainly when an answer could be misread.

## Creating The 10/10 Answer

The strong answer should:

- use only true or clearly user-provided facts
- preserve the user's actual positioning and vocabulary where it helps
- translate the candidate's confirmed domain experience into the target role's language without claiming experience in a new domain
- include one concrete proof point when useful, not a CV dump
- avoid vague motivation like "I like the product"
- avoid lowering seniority, e.g. "I would join even as an intern"
- avoid exact confidential metrics unless already approved or present in public-safe career files
- end with a role-relevant point, not a generic summary

Use the user's preferred language and spoken style; adapt the example feedback headings below to that language. Treat “10/10” as a coaching label, not a promise of interview success.

## Saving To Cheatsheet

By default, save only the final "Ответ на 10/10" to:

`interview-prep/opportunities/{company-role}/cheatsheet-draft.md`

Do not save the user's raw dictated answer unless the user explicitly asks.

Use this shape:

```markdown
## Q{n}. {Question}

{final answer}
```

If the file exists, update or append the relevant question section. If the answer replaces a weaker existing answer, replace it. If the user says not to write files, keep everything in chat.

## Question Queue Discipline

Maintain a simple sequence for the current stage. For an HR screen, a good default queue is:

1. Tell me about yourself.
2. Why are you looking now?
3. Why this company and role?
4. How does your past experience transfer to this role?
5. Tell me about a full-cycle product feature.
6. Tell me about metrics, A/B tests, and post-release analysis.
7. Tell me about cross-functional work and conflict of priorities.
8. What compensation are you targeting?
9. Are the location, office format, and timeline acceptable?
10. What questions do you have for us?

Before asking the next question, check the queue and skip questions already covered unless the user asks to rehearse them again.

## File And Memory Hygiene

- Save opportunity-specific interview answers in the opportunity folder, not in global profile files.
- Save reusable proof points to `interview-prep/story-bank.md` only after the user confirms their accuracy and reuse beyond one company.
- If the user asks to record a process mistake, add a minimal anonymized entry to the optional `memory/errors.md` with context, mistake, observed cause, and proposed correction. Do not record candidate facts or confidential transcript text there.
- Do not add durable process rules to `memory/rules.md` unless the user asks for an error review or confirms the rule.
