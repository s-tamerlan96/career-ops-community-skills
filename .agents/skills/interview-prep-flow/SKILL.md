---
name: interview-prep-flow
description: Use when preparing a candidate for a job interview from a vacancy, recruiter message, company, or interview stage; especially HR screens, hiring-manager rounds, technical/product interviews, CPO/final rounds, compensation/location checks, and role-fit comparisons.
---

# Interview Prep Flow

## Overview

Prepare interview packs that are tied to the vacancy, the candidate's actual proof points, and current company/market context. The output should help the candidate decide what to say, what to ask, what to avoid, and where the role may be risky.

In an upstream `career-ops` workspace, read `modes/interview-prep.md` when available for the detailed base workflow. This extension pack does not include upstream modes or personal source files. If they are absent, use the candidate sources provided in the current conversation and the workflow below; never infer missing career facts.

## Inputs

Use whatever is available:

- vacancy URL or pasted JD
- recruiter message or interview notes
- interview stage: HR, hiring manager, technical, Head of Monetization, CPO/final
- candidate sources: `cv.md`, `config/profile.yml`, `modes/_profile.md`, `article-digest.md` if present
- existing prep files in `interview-prep/`, especially `story-bank.md`
- opportunity state files: `interview-prep/active-opportunities.md`, `interview-prep/case-log.md`, and `data/applications.md`

If the vacancy/company page is referenced, verify it with current browsing. Do not rely on memory for job scope, location, salary, or process.

## Core Rules

- Generate in the user's language unless they ask otherwise.
- Do not invent sourced facts. Label role-derived guesses as `[inferred from JD]`.
- Highlight mismatches early: compensation, relocation, B2B/contract setup, role scope, seniority, decision rights.
- Never disclose private personal constraints externally unless the user explicitly asks.
- For career-ops projects, save durable prep to `interview-prep/opportunities/{company-slug}-{role-slug}/` when there is a concrete role or meaningful process.
- Do not treat every folder under `interview-prep/opportunities/` as active. Check `active-opportunities.md` and `case-log.md` first.
- Keep external-facing scripts specific and natural; avoid generic motivational language and corporate-speak.

## Workflow

### 1. Identify Audience

Classify the next round:

| Round | Main Screen |
|---|---|
| HR / recruiter | motivation, comp, location, timeline, basic fit |
| Hiring manager | scope fit, ownership, leadership, first 90 days |
| Technical/product | domain depth, trade-offs, metrics, cases, collaboration |
| CPO/final | strategy, org design, decision rights, growth path, offer conditions |

If the audience is unclear, prepare both likely packs but state the uncertainty.

### 2. Load Candidate Fit

Read candidate sources before drafting answers. Pull only relevant proof points:

- portfolio scale and revenue
- closest product/domain experience
- domain-relevant delivery, business model, analytics, and experiment examples
- team/process leadership
- AI/product-ops examples if useful
- location and compensation boundaries

Do not force every proof point into one answer.

### 3. Research Vacancy And Market

Extract structured facts:

- responsibilities, requirements, reporting line, team structure
- product stage and business problem
- location/relocation/contract signals
- public company/product context
- current market context for the role domain

For technical interviews, use sourced research to identify possible domain pressure points. Label inferred concerns as hypotheses. For game-product roles, examples include LiveOps cadence, personalization, economy health, monetization quality, tooling, analytics, segmentation, and post-launch review.

### 4. Build HR Pack

Include:

- 60-90 second intro
- "why this company / role"
- "why looking now"
- compensation script
- location/relocation/B2B script
- red flags and direct clarifier questions
- 5-8 questions to ask HR

The goal is to pass fit gates without overcommitting before comp and format are clear.

### 5. Build Technical Pack

Include:

- likely technical/product questions they may ask
- strong answer patterns, not memorized essays
- provocative questions to ask them
- sideways questions to use only if the conversation is going well
- one realistic test case with answer structure

For LiveOps/monetization roles, cover:

- event calendar design under KPI pressure
- offer/reward balance
- segmentation and personalization
- A/B tests and guardrail metrics
- player-driven economy risks
- production system, quality gates, incidents
- post-launch review loop

### 6. Build CPO / Final Pack

Move broad questions here:

- why the role exists now
- 12-month product priorities
- boundaries between adjacent roles
- decision rights and veto rights
- success after probation and after one year
- growth path
- B2B/relocation/compensation alignment before offer

Do not spend CPO time on config-level details unless they reveal role authority.

### 7. Map Stories

Map each expected question to 1-2 proof points. Use STAR+R when needed:

- Situation
- Task
- Action
- Result
- Reflection

If the story bank is empty, draft compact story angles from `cv.md` and `_profile.md` instead of blocking.

### 8. Save And Summarize

When preparing a full pack:

- if the user wants durable tracking, add or update `interview-prep/active-opportunities.md`; label unclear status as unconfirmed
- save or update `interview-prep/opportunities/{company-slug}-{role-slug}/interview-pack.md`
- update `interview-prep/case-log.md` and write `case-retrospective.md` only when the user or direct evidence confirms that the case closed
- mention what changed
- summarize the top position, top risks, and next questions in chat

For quick requests, answer in chat only and offer the highest-signal bullets first.

## Output Shape

Use this structure unless the user asks for something shorter:

```markdown
## Positioning
## Fit And Risks
## HR Answers
## Technical Questions
## Questions To Ask
## Test Case
## Red Flags
## Next-Step Script
```

## Common Mistakes

- Treating every interview as the same audience.
- Giving the same proof point in every round without changing the angle.
- Asking CPO operational questions that belong to a hiring manager.
- Ignoring relocation, B2B, and compensation until the end.
- Calling a revenue-positive event successful without checking retention, sentiment, economy health, and delayed effects.
- Drafting generic "I am excited" answers without tying them to the product's actual operating problem.
