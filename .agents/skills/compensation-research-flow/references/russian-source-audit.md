# Source Audit for Russian IT Compensation Research

This is a reusable audit checklist, not a historical salary snapshot. It contains no real candidate cases, employer-specific observations, salary figures, or tax rates. Discover and inspect current sources during each research task.

## Candidate source families

Use these names only as search starting points. Their current availability, access requirements, coverage, and methodology must be checked:

| Source family | Possible starting points | What to verify |
|---|---|---|
| Employer evidence | Official career site, current offer, recruiter band, policy | Relevant role/entity, effective date, components, binding versus explanatory wording |
| Structured market data | Habr Career salary service; hh.ru salary products | Collection method, population, filters, period, slice count, gross/net basis, paid versus posted salary |
| Salary-disclosed vacancies | Official postings and role-appropriate job boards | Live status, location, scope, period, range basis, bonus inclusion |
| Community self-reports | Salary Radar or a role-appropriate public collection | Questionnaire, respondent status, event dates, comparability, verification, duplicates |
| Employer reviews | Public employee-review platforms and communities | Source attribution, firsthand versus retold event, role/date context, narrative limits |
| Broad market commentary | Published research and survey summaries | Population, method, component definitions, scope of the conclusion |

A named source is not an endorsement or a guarantee of sufficient coverage. Skip any source that does not match the requested population. Keep separate collections separate unless their relationship and overlapping observations are documented.

## Audit the collection

Record:

- source owner and public entry point;
- audit/access date and collection window;
- who can submit and whether participation is voluntary;
- what verification, moderation, deduplication, and outlier handling are documented;
- whether records describe current employees, former employees, offers, or expectations;
- whether salary effective date differs from publication date;
- which values are actually inspectable;
- the requested slice and its observation count;
- access restrictions without trying to bypass them.

Use `unknown` for undocumented processes. Do not infer verification from a polished interface, authentication, publication, or audience size.

## Coverage matrix

For each field, mark `present`, `missing`, or `ambiguous`, and explain its effect on the comparison:

| Dimension | Why it matters |
|---|---|
| Role and actual scope | Similar titles can hide different responsibilities |
| Grade and calibration | Self-declared grades may not align across employers |
| Location, work format, legal entity | Geography and entity can change the relevant population |
| Employment model | Employee and contractor compensation have different components |
| Currency and gross/net basis | Unspecified bases cannot be mixed numerically |
| Fixed-pay period and paid months | Monthly, annual, and partial-year values differ |
| Bonus base, frequency, target/cap/actual | Frequency alone does not define expected cash |
| Equity, benefits, sign-on | Total compensation may be incomplete |
| Event and publication dates | A recent post can describe an old event |
| Duplicate/event identifiers | Cross-posts may not be independent observations |
| Relevant slice count and method | A platform-wide count does not establish local precision |

## Common failure modes

- Merging several role families because they share an employer name.
- Counting subscribers or posts as independent salary observations.
- Treating an archived collection as current because it remains accessible.
- Combining net base salary with gross total compensation.
- Treating a maximum or promised bonus as an actual annual payout.
- Calling posted ranges actual employee pay.
- Inferring a market median from a few volunteered reports.
- Summing component medians as though they described one respondent.
- Generalizing a community survey beyond its participant population.
- Using a public salary anecdote to infer a private candidate's income.

## Neutral worked reasoning pattern

Suppose an official policy states a bonus frequency, while a community record reports a bonus amount but omits whether it was target or paid. Record frequency as confirmed policy content and the amount as a self-report with an unknown basis. The agreement does not establish expected payout. The next step is to request role-specific target, eligibility, and payout-history evidence.

If two observations use the same title but differ in scope, location, or pay basis, list them separately. Missing comparability is a research gap; an average does not repair it.

## Output of the audit

Conclude with:

1. Which claims each source can support.
2. Which fields remain missing or ambiguous.
3. Whether the records are comparable and independent enough for the intended conclusion.
4. Which current evidence could resolve the most consequential gap.

Keep raw personal reports and private employer materials in the user's designated private workspace. Publish only generalized methodology or data explicitly cleared for publication.
