# create-blackboxqa

> The guided setup wizard for [BlackboxQA](https://github.com/engn-dev/blackboxqa) — an AI-agent QA toolkit
> that drives real browsers, records QA sessions (Playwright trace, video, network HAR, console), and
> renders self-contained verification reports.

[![npm](https://img.shields.io/npm/v/create-blackboxqa.svg)](https://www.npmjs.com/package/create-blackboxqa)
[![license](https://img.shields.io/npm/l/create-blackboxqa.svg)](https://github.com/engn-dev/blackboxqa)

One command to get BlackboxQA and its browser runtime set up — no flags to remember. Every step just
shells out to the same published commands you could run by hand, so there's no magic and nothing
bespoke to uninstall. Agent integration (skills, Claude Code plugin) is deliberately left to you:
after setup the wizard prints the exact commands to run.

## Use

```bash
npm create blackboxqa
# or:  npm init blackboxqa  ·  pnpm create blackboxqa  ·  yarn create blackboxqa
```

You'll get a checklist (space toggles, enter confirms). Recommended items are pre-selected:

| Step | Default | What it runs |
| --- | --- | --- |
| Install the `blackboxqa` command globally | ✓ | `npm i -g @blackboxqa/cli` |
| Install the browser runtime (Chromium) | ✓ | `blackboxqa install` |
| Also install `blackboxqa-browser` globally | — | `npm i -g @blackboxqa/browser` |
| Also install the `blackboxqa-viewer` viewer globally | — | `npm i -g @blackboxqa/ui` |

Installing the CLIs globally puts `blackboxqa`, `blackboxqa-browser`, and `blackboxqa-viewer` on your `PATH` so
day-to-day use drops the `npx` prefix. The wizard never installs the plugins itself — once setup
completes it prints the commands (Claude Code `/plugin …`, Cursor / Codex marketplace) so each
agent's own mechanism does the work.

### Non-interactive

In a pipe or CI (no TTY), the wizard prints the exact commands to run instead of prompting — safe to
inspect before executing.

## After setup

Add the agent integration yourself (one-time):

```bash
# Claude Code: /plugin marketplace add engn-dev/blackboxqa  then  /plugin install blackboxqa@blackboxqa-marketplace
```

Then record a session:

```bash
blackboxqa session start --name "checkout"   # start a recorded session (prints an id)
blackboxqa run ./step.js --session <id> --step "open"
blackboxqa session end <id>                  # -> ~/.blackboxqa/sessions/<id>/report.html
blackboxqa-viewer                            # browse recorded sessions
```

Using a coding agent? Try `/blackboxqa:verify` (plan QA for your changes) or `/blackboxqa:session` (record a
flow) in Claude Code / Cursor / Codex. See `examples/` in the repo for runnable demos.

## Related packages

- [`@blackboxqa/cli`](https://www.npmjs.com/package/@blackboxqa/cli) — the `blackboxqa` session orchestrator.
- [`@blackboxqa/browser`](https://www.npmjs.com/package/@blackboxqa/browser) — one-off automation engine.
- [`@blackboxqa/ui`](https://www.npmjs.com/package/@blackboxqa/ui) — the `blackboxqa-viewer` session browser.

MIT · [source](https://github.com/engn-dev/blackboxqa)
