---
name: interview-feedback-loop
description: Review a completed interview from a transcript, meeting notes, or a user recap; distinguish actual questions and answers from reconstruction, compare preparation with performance, and improve future practice.
---

# Interview Feedback Loop

Reconstruct what happened before judging it. Use the transcript's language for artifacts unless the user requests another; for mixed-language input, follow the current request.

## Source boundary

Prefer a complete transcript, then detailed notes, then a summary or user recap. If a user names a connected meeting service and its tools are available, use that service to obtain the requested source. No meeting service is required by this skill.

State the exact source type and coverage. A summary can support a summary-based review, not an invented transcript, verbatim answer, speaking pace, or interviewer reaction. Preserve uncertainty and speaker attribution; resolve ambiguous terms or numbers before reusing them.

Identify the role, interview stage, date, speakers, relevant preparation, and source from available evidence. Ask only for missing information that materially changes the review. Do not invent process status from positive feedback.

## Workspace and artifacts

For a concrete opportunity, the private workspace convention is `interview-prep/opportunities/{company-role}/`. These directories and personal files are not bundled. If the user asks for chat-only feedback, keep the review in chat.

Produce only artifacts the source and task support:

- `clean-transcript-{date}.md`: when a transcript exists, remove irrelevant filler without changing meaning. Preserve weak answers as spoken, speaker ownership, and `[unclear]` passages.
- `actual-questions-{date}.md`: separate interviewer questions, follow-ups, and candidate questions. Mark paraphrases and incomplete wording.
- `answer-comparison-{date}.md`: compare what was asked, what the candidate actually answered, relevant preparation, strengths, gaps, and a stronger answer based only on confirmed facts.
- `post-interview-analysis-{date}.md`: synthesize after reconstructing questions and answers. For notes-only input, explicitly state that answers are reconstructed and limit conclusions accordingly.

For a short review, these may be sections of one response or file. Do not create empty artifacts to satisfy a fixed checklist.

## Evaluate

For each material exchange, establish who asked the question and whether it was an interviewer test, a candidate's question, or a question turned back to the candidate. Distinguish the candidate's answer from the interviewer's description of the role.

Assess observable content and structure. Separate missing evidence from missing skill, poor preparation from a weak answer, and company process friction from candidate performance. Do not infer causal hiring outcomes or confidence from wording alone.

A stronger answer may reframe confirmed experience and clarify reasoning. Do not add unsupported achievements, metrics, authority, or confidential detail to improve the score.

## Reusable learning

Prefer real, relevant questions and follow-ups over generic mock questions. A useful default ordering is:

1. Questions and follow-ups from the same role and stage.
2. Interviewer statements that clarify role scope or hiring criteria.
3. Candidate questions that exposed a material risk or expectation.
4. Mock questions that revealed a supported weakness.
5. Generic preparation questions.

These are prioritization heuristics, not empirical probabilities or a fixed scoring model. Adjust by relevance to the next round.

If maintaining a private question bank, use `interview-prep/question-bank.md` or the user's existing location. Record a generalized question, competency, stage, source type/date, relevant follow-up, and priority rationale. Keep employer-specific facts and confidential wording in the opportunity folder. Add new career stories to `interview-prep/story-bank.md` only after user confirmation of accuracy and reuse.

No external feedback playbook is required. For recurring or severe agent process mistakes, use the bundled `error-review` skill when requested rather than automatically changing general rules.

## Finish

Report the source and its limitations, what worked, the main gap, changed preparation artifacts, and the next practice topic. Keep confirmed facts, interpretations, unknowns, and next actions distinct. Drafting a follow-up does not authorize sending it or changing hiring status.
