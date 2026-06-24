# @blackboxqa/ui

> `blackboxqa-viewer` — the local **session viewer** for [BlackboxQA](https://github.com/engn-dev/blackboxqa).
> Browse, search, organize, and replay recorded QA sessions (trace, video, network HAR, console,
> per-step screenshots) in your browser. Self-contained — no daemon, no setup.

[![npm](https://img.shields.io/npm/v/@blackboxqa/ui.svg)](https://www.npmjs.com/package/@blackboxqa/ui)
[![license](https://img.shields.io/npm/l/@blackboxqa/ui.svg)](https://github.com/engn-dev/blackboxqa)

Like `npx playwright show-trace`, but for whole BlackboxQA sessions: it spins up a local server, opens
your browser, and reads the artifacts that [`@blackboxqa/cli`](https://www.npmjs.com/package/@blackboxqa/cli)
wrote to `~/.blackboxqa/sessions`.

## Use

```bash
npm i -g @blackboxqa/ui            # adds the `blackboxqa-viewer` command
blackboxqa-viewer                     # browse ~/.blackboxqa/sessions, opens your browser

blackboxqa-viewer --dir ./artifacts   # point at a non-default sessions folder
```

No global install? `npx @blackboxqa/ui`. Stop it with `Ctrl-C`.

The BlackboxQA CLI also launches it for you — `blackboxqa ui` is the same viewer.

## Options

| Flag | Effect |
| --- | --- |
| `--dir <path>` | Sessions folder to serve (default: `~/.blackboxqa/sessions`). |
| `--port <port>` | Port to listen on (default: an open port). |
| `--host <host>` | Host/interface to bind. |
| `--no-open` | Start the server but don't open a browser (prints the URL). |

## What you can see

Each session opens to a report with everything captured during the run:

- **Steps** — every `blackboxqa run --step` as an ordered entry, pass/fail, with its screenshot.
- **Trace** — the Playwright trace: DOM snapshots and actions, grouped per step.
- **Video** — a WebM recording of the run.
- **Network** — the HAR: every request/response, status, and timing.
- **Console** — console output and page errors.
- **Summary** — steps passed/failed, console errors, network failures, duration.

Search and organize across every recorded session from the index.

## Related packages

- [`@blackboxqa/cli`](https://www.npmjs.com/package/@blackboxqa/cli) — record the sessions this viewer
  displays.
- [`@blackboxqa/browser`](https://www.npmjs.com/package/@blackboxqa/browser) — one-off automation engine.
- [`create-blackboxqa`](https://www.npmjs.com/package/create-blackboxqa) — `npm create blackboxqa` guided setup.

MIT · [source](https://github.com/engn-dev/blackboxqa)
