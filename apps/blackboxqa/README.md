# @blackboxqa/cli

> `blackboxqa` — the session orchestrator for [BlackboxQA](https://github.com/engn-dev/blackboxqa). Drive a real
> browser, record capture-enabled QA sessions (Playwright trace, video, network HAR, console, per-step
> screenshots), and render a self-contained `report.html` you can open, commit, or browse in a local UI.

[![npm](https://img.shields.io/npm/v/@blackboxqa/cli.svg)](https://www.npmjs.com/package/@blackboxqa/cli)
[![license](https://img.shields.io/npm/l/@blackboxqa/cli.svg)](https://github.com/engn-dev/blackboxqa)

BlackboxQA is built for **AI agents and developers who need verifiable, reproducible browser QA**. Every
run captures a trace, a video, a network log, console output, and per-step screenshots — and decodes
back to a reproducible Playwright script — with no instrumentation of your app. Scripts are plain
async JavaScript run in a sandboxed QuickJS runtime; a background daemon (Playwright + sandbox) starts
automatically when needed.

## How it works

You drive the daemon through a four-step session lifecycle:

| Step | Command | Result |
| --- | --- | --- |
| 1. start | `blackboxqa session start --name "checkout"` | prints a session id |
| 2. run | `blackboxqa run step.js --session <id> --step open` | one script per step |
| 3. end | `blackboxqa session end <id>` | writes `report.html` |
| 4. view | `blackboxqa ui` | browse every session |

## Install

```bash
npm i -g @blackboxqa/cli     # adds the `blackboxqa` command
blackboxqa install              # one-time: download Chromium + runtime (~150 MB) into ~/.blackboxqa
```

Prefer not to install globally? Prefix anything with `npx`:

```bash
npx @blackboxqa/cli install
```

Or set everything up interactively with the guided wizard — `npm create blackboxqa`.

## Quickstart

```bash
# 1. start a capture-enabled session (prints an id)
id=$(blackboxqa session start --name "checkout")

# 2. run scripts as ordered steps — one script per step (open → act → assert)
blackboxqa run ./open.js   --session "$id" --step "open"
blackboxqa run ./submit.js --session "$id" --step "submit"

# inline scripts work too (read from stdin):
echo 'const p = await browser.getPage("home");
await p.goto("https://example.com");
console.log(await p.title());' | blackboxqa run --session "$id" --step "home"

# 3. finish — collects artifacts and renders the report
blackboxqa session end "$id"            # -> ~/.blackboxqa/sessions/<id>/report.html

# 4. browse, search, and replay every session in a local viewer
blackboxqa ui
```

Each `--step` is one entry in the report, with its own trace group and **one** auto-captured
screenshot (taken from the last page opened during that step). So use **one primary named page per
step**, and reuse the same page name across steps to "click through" like a user — named pages persist
across steps within a session.

## Commands

| Command | What it does |
| --- | --- |
| `blackboxqa init` | One-shot setup: install the runtime, then print next steps. The friendlier wizard is `npm create blackboxqa`. |
| `blackboxqa install` | Install the embedded runtime (Chromium + Playwright + QuickJS) into `~/.blackboxqa`. |
| `blackboxqa session start` | Start a capture-enabled session; prints its id. Toggle capture with `--no-trace` / `--no-video` / `--no-har` / `--no-console`; `--headless` for unattended runs. |
| `blackboxqa run [FILE]` | Run a script (a file, or stdin if omitted) as one step. Requires `--session <id>`; label it with `--step <name>`; bound it with `--timeout <seconds>`. |
| `blackboxqa session end <id>` | Stop recording, collect artifacts, render `report.html` + `results.json`. `--stop-daemon` shuts the daemon down afterward if nothing else needs it. |
| `blackboxqa session abort <id>` | Best-effort teardown of a session — salvage a wedged run from whatever artifacts survived. |
| `blackboxqa session list` | List recorded sessions (table; `--json` for machine output). |
| `blackboxqa status [--session <id>]` | Daemon status, or one session's status. |
| `blackboxqa ui` | Launch the local session viewer. Options: `--dir <path>`, `--port`, `--host`, `--no-open`. |
| `blackboxqa stop` | Stop the background daemon and every browser/session it's running (alias: `blackboxqa daemon stop`). |

Global flags: `--json` (machine-readable output on stdout), `-v` / `--verbose` (more logging on
stderr). Run `blackboxqa --help` or `blackboxqa <command> --help` for the full reference.

> **Lifecycle tip:** `blackboxqa stop` aborts any live session and skips its `report.html`. For a clean
> report, always `blackboxqa session end <id>` **first**, then `blackboxqa stop`.

## Writing scripts

Scripts are plain **async JavaScript** in a QuickJS sandbox with a Playwright-like API — no `require`,
`process`, `fs`, or `fetch`; just a pre-connected `browser`, `console`, and a few file helpers.
Top-level `await` works.

```js
const page = await browser.getPage("home");          // named, persistent page
await page.goto("https://example.com", { waitUntil: "domcontentloaded" });
console.log(await page.title());

await page.locator("text=Sign in").click();
await saveScreenshot(await page.screenshot(), "signed-in.png");   // saveScreenshot(buffer, name)
```

- **Pages** — `browser.getPage(name)`, `browser.newPage()`, `browser.listPages()`,
  `browser.closePage(name)`. Pages are full Playwright `Page`s (`goto`, `click`, `fill`, `locator`,
  `evaluate`, `getByRole`, `waitForSelector`, …).
- **Files** (sandboxed to `~/.blackboxqa/tmp/`) — `saveScreenshot(buffer, name)`, `writeFile(name, data)`,
  `readFile(name)` to pass values between steps.

The full reference is built into this CLI — run `blackboxqa --help` or `blackboxqa run --help`
(the engine's `blackboxqa-browser --help` documents the same API), or read the
[blackboxqa-scripting reference](https://github.com/engn-dev/blackboxqa/blob/main/skills/blackboxqa-scripting/references/REFERENCE.md).

## Artifacts

Everything for a run lands under `~/.blackboxqa/sessions/<id>/`:

```
session.json   session metadata + per-step record
results.json   decoded results (steps, summary, artifact paths)
report.html    self-contained report — open it anywhere, commit it, share it
trace.zip      Playwright trace (DOM snapshots + actions, one group per step)
```

…plus the WebM video, the network HAR, the console log, and one screenshot per step.

## Use it from an AI agent

BlackboxQA ships skills, subagents, and `/blackboxqa:*` slash commands for Claude Code, Cursor, and Codex, so
an agent can plan and record QA for you:

```bash
# Claude Code: /plugin marketplace add engn-dev/blackboxqa  then  /plugin install blackboxqa@blackboxqa-marketplace
```

## Related packages

- [`@blackboxqa/browser`](https://www.npmjs.com/package/@blackboxqa/browser) — the engine for quick
  one-off automation (no recording, no report).
- [`@blackboxqa/ui`](https://www.npmjs.com/package/@blackboxqa/ui) — the `blackboxqa-viewer` session browser.
MIT · [source](https://github.com/engn-dev/blackboxqa)
