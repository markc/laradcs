---
name: write-journal-entry
description: How to write a _journal/YYYY-MM-DD.md entry — append-style, narrative, includes gotchas
---

# Write a journal entry

The `_journal/` directory is laradcs's append-only audit trail.
Every work session that produces meaningful changes should leave
an entry. CLAUDE.md mandates that **the last 3 entries are read
on session startup** so future you (or future Claude) inherit
context.

## Where

- `_journal/YYYY-MM-DD.md` — one file per calendar day
- If a date file already exists, **append** to it (don't overwrite)
- File names use **`YYYY-MM-DD`** with hyphens, never `YYYYMMDD`,
  per the global doc convention

## Format

```markdown
# 2026-04-15 — One-line headline

## Morning session — <topic>

[narrative paragraphs about what shipped, why, how]

### Subsection (if needed)

[more detail]

## Sharp edges caught

- Bug 1 — symptom, root cause, fix
- Bug 2 — ...

## Next session

- [ ] Item 1
- [ ] Item 2

---

## Afternoon session — <next topic>

[append more sessions to the same date file with `---` separators]
```

The headline is just for the file's H1. Each session is an H2
with its own narrative.

## What to include

**Always:**
- What shipped (commits, file paths)
- Why the change was needed
- Any **non-obvious decisions** and their rationale
- Sharp edges / gotchas with full root-cause analysis
- What's still TODO or deferred

**Sometimes:**
- Snippets of error output (helps grep later)
- Links to external resources you used
- Performance numbers if relevant (build times, test counts)
- Quotes from the user if they're going to matter for context

**Never:**
- Code from files (the git history has it; don't duplicate)
- Routine trivia (every git command you ran)
- Speculation about future plans (use a plan doc instead)

## Write for future-you

The journal exists because **memory is unreliable** and code
diffs don't capture intent. Six months from now, when something
breaks, future-you needs to be able to grep the journal for
relevant context. So:

- Write the **why**, not just the **what**
- Use unambiguous file paths and SHAs
- Capture gotchas in enough detail that you could reproduce
  the bug if you wanted to

## Verify

Before committing the journal entry:

```bash
ls _journal/ | tail -5
```

Confirm the new file is there and the date is correct.

## Don't

- Don't put **decisions** in the journal — those go in `_doc/`
  as design docs that survive longer
- Don't put **TODOs** in the journal — use a real task tracker
  for those, the journal is a log
- Don't put **secrets** in the journal — env keys, API tokens,
  credentials. The journal is committed to a public repo.
