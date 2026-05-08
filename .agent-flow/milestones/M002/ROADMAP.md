---
id: M002
title: V1 systems smoke test
spec_id: SPEC-v1-systems-smoke
success_criteria:
  - "Worker and shared proxy can complete a real task on the sandbox repo"
  - "The repo contains enough linked code and docs to make codemap and discover useful"
  - "At least one milestone can produce a REPORT.html with decisions, tasks and metrics"
slices:
  - id: S01
    title: Runtime and proxy fixtures
    goal: "Exercise worker execution, shared proxy, auth-adjacent logic and noisy test output on a realistic backend task"
    estimated_tasks: 1
    depends_on: []
    risk: medium
  - id: S02
    title: Codemap and discovery fixtures
    goal: "Create a small multi-file surface with cross-file symbols and documentation so codemap and discovery have meaningful context"
    estimated_tasks: 1
    depends_on:
      - S01
    risk: low
ready_to_plan:
  - S01
  - S02
decisions:
  - id: D-01
    kind: principle
    statement: "Keep auth errors stable and explicit so review, reducers and discovery can reason about them"
  - id: D-02
    kind: principle
    statement: "Prefer small cross-file modules over one big file so codemap and discovery have real navigation value"
---

# M002 — V1 systems smoke test
