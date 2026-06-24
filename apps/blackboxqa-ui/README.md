# @blackboxqa/ui

> `blackboxqa-viewer` — the local **session viewer** for [BlackboxQA](https://github.com/engn-dev/blackboxqa).
> Browse, search, organize, and replay recorded QA sessions (trace, video, network HAR, console,
> per-step screenshots) in your browser. Self-contained — no daemon, no setup.

Like `npx playwright show-trace`, but for whole BlackboxQA sessions: it spins up a local server, opens
your browser, and reads the artifacts that [`@blackboxqa/cli`](https://github.com/engn-dev/blackboxqa/tree/main/apps/blackboxqa)
wrote to `~/.blackboxqa/sessions`.

## Use

Built from source (not published to npm) — see the
[repo README](https://github.com/engn-dev/blackboxqa#get-started). Then:

```bash
blackboxqa-viewer                     # browse ~/.blackboxqa/sessions, opens your browser
blackboxqa-viewer --dir ./artifacts   # point at a non-default sessions folder
```

Stop it with `Ctrl-C`.

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

- [`@blackboxqa/cli`](https://github.com/engn-dev/blackboxqa/tree/main/apps/blackboxqa) — record the sessions this viewer
  displays.
- [`@blackboxqa/browser`](https://github.com/engn-dev/blackboxqa/tree/main/apps/blackboxqa-browser) — one-off automation engine.

MIT · [source](https://github.com/engn-dev/blackboxqa)
