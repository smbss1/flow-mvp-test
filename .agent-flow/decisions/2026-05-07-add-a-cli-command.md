```yaml
---
id: add-a-cli-command
title: Add a CLI command
status: accepted
date: 2026-05-07
session_id: 2026-05-07-add-a-cli-command
decisions:
  - id: D-01
    kind: task
    weight: light
    statement: "Add a `box` CLI with a `hello` command that GETs /posts from jsonplaceholder.typicode.com and prints results to stdout."
  - id: D-02
    kind: task
    weight: light
    statement: "Render the /posts response as a table using `console.table()`, not raw JSON."
  - id: D-03
    kind: principle
    weight: light
    statement: "Introduce no new dependencies for CLI output; rely on Node 22 built-ins only."
prior_decisions_referenced: []
---

# Context

The project has no CLI, no `bin` entry in `package.json`, and no third-party dependencies. The task is to add a minimal `box hello` command that fetches public data and presents it readably. All decisions stay inside the zero-dependency, vanilla Node.js constraint already in place.

# Decisions

No heavy decisions. All choices here are low-cost and reversible: the endpoint, the output format, and the rendering method can each be changed with a few lines of code.

# Light decisions (operational)

- **D-01** — Add `box` binary with a `hello` command; wire it via `bin` in `package.json`.
- **D-02** — Fetch `GET /posts` from `https://jsonplaceholder.typicode.com/posts`; print with `console.table()`.
- **D-03** — No new npm dependencies; `console.table` and `fetch` (Node 22 built-in) are sufficient.

# Out of scope for this iteration

- Additional subcommands beyond `hello`.
- Error handling beyond a basic fetch failure message.
- Output flags (e.g., `--json`, `--csv`).
- Any CLI argument parsing library.

# Open questions for follow-up

None.
```