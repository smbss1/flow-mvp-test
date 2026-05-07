---
id: M001
title: MVP smoke test
spec_id: SPEC-mvp-smoke
success_criteria:
  - "A slugify helper exists at src/slugify.js"
  - "tests/slugify.test.js exercises at least three cases via node:test"
slices:
  - id: S01
    title: Add slugify utils
    goal: "Provide a small slugify helper and verify it through node:test"
    estimated_tasks: 1
    depends_on: []
    risk: low
ready_to_plan:
  - S01
decisions:
  - id: D-01
    kind: principle
    statement: "Tests must use node:test (no external test framework)"
---

# M001 — MVP smoke test
