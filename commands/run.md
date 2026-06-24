---
description: Automate a one-off browser task with BlackboxQA — navigate, click, scrape, screenshot — and return the result.
argument-hint: "<what to automate>"
---

Delegate to the `automate-agent` subagent. Give it the task: **$ARGUMENTS**.

Ask it to write a BlackboxQA script (using the `blackboxqa-scripting` API), run it with
`npx @blackboxqa/browser run`, and report the result. For a *recorded* run with a report instead of a
one-off, use `/blackboxqa:session`.
