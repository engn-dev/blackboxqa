# @blackboxqa/browser

> `blackboxqa-browser` — the browser-automation engine for
> [BlackboxQA](https://github.com/engn-dev/blackboxqa). Run sandboxed JavaScript against a real Chromium with
> persistent, named pages. This is **one-off** automation — nothing is recorded. For capture-enabled QA
> sessions with a `report.html`, use [`@blackboxqa/cli`](https://github.com/engn-dev/blackboxqa/tree/main/apps/blackboxqa).

Scripts are plain async JavaScript in a QuickJS sandbox with a Playwright-like API — no `require`,
`process`, `fs`, or `fetch`; just a pre-connected `browser`, `console`, and a few file helpers. A
background daemon owns the real Chromium and starts automatically when needed. Use it to navigate,
click, fill, scrape, screenshot, or check a page — fast.

## Install

Built from source (not published to npm) — see the
[repo README](https://github.com/engn-dev/blackboxqa#get-started):

```bash
git clone https://github.com/engn-dev/blackboxqa.git && cd blackboxqa
make install && make build
(cd apps/blackboxqa-browser && pnpm link --global)
blackboxqa-browser install        # one-time: download Chromium + runtime into ~/.blackboxqa
```

## Quickstart

```bash
# pipe a script via stdin
echo 'const p = await browser.getPage("main");
await p.goto("https://example.com");
console.log(await p.title());' | blackboxqa-browser run

# or run a file
blackboxqa-browser run ./script.js
```

`run` exits non-zero if the script throws, so it composes in shell pipelines and CI.

## Commands

| Command | What it does |
| --- | --- |
| `blackboxqa-browser run <FILE>` | Run a script file in the sandbox. |
| `blackboxqa-browser run` *(stdin)* | With no file, reads the script from stdin (`… \| blackboxqa-browser run`). |
| `blackboxqa-browser browsers` | List the daemon-managed browser instances currently running. |
| `blackboxqa-browser status` | Show daemon status. |
| `blackboxqa-browser install` | Install the embedded runtime (Chromium + Playwright + QuickJS) into `~/.blackboxqa`. |
| `blackboxqa-browser stop` | Stop the background daemon and every browser it's running. |

Run `blackboxqa-browser --help` for the full API reference and `blackboxqa-browser <command> --help` for
per-command detail.

## Global flags

| Flag | Effect |
| --- | --- |
| `--browser <NAME>` | Use a specific named, daemon-managed browser instance (reuse state across runs). |
| `--connect [URL]` | Attach to an already-running Chrome instead of the daemon's Chromium. Bare `--connect` auto-detects; pass a CDP URL like `--connect=http://localhost:9222` to target one explicitly. |
| `--headless` | Launch the daemon-managed Chromium with no visible window. |
| `--ignore-https-errors` | Ignore HTTPS certificate errors. |
| `--timeout <SECONDS>` | Maximum script execution time (fails fast instead of hanging). |
| `--inject-script <PATH>` | Pre-load a JavaScript file on every page in the context (repeatable). |
| `-v, --verbose` | Verbose diagnostics on stderr. |
| `--json` | Machine-readable JSON diagnostics on stderr. |

### Drive your real, logged-in browser

`--connect` attaches to a Chrome you already have open — handy for flows behind a login. Start Chrome
with remote debugging, then connect:

```bash
# launch (or relaunch) Chrome with a debugging port, then:
blackboxqa-browser --connect run ./scrape-dashboard.js
```

## Scripting

```js
const page = await browser.getPage("main");          // named, persistent page
await page.goto("https://news.ycombinator.com", { waitUntil: "domcontentloaded" });

const titles = await page.evaluate(() =>
  [...document.querySelectorAll("span.titleline > a")].slice(0, 10).map((a) => a.textContent)
);
console.log(JSON.stringify(titles));                   // stdout is the result

await saveScreenshot(await page.screenshot(), "hn.png");   // saved under ~/.blackboxqa/tmp/
```

- **Pages** — `browser.getPage(name)`, `browser.newPage()`, `browser.listPages()`,
  `browser.closePage(name)`. Pages are full Playwright `Page`s (`goto`, `click`, `fill`, `locator`,
  `evaluate`, `getByRole`, `waitForSelector`, `screenshot`, …).
- **Files** (sandboxed to `~/.blackboxqa/tmp/`) — `saveScreenshot(buffer, name)`, `writeFile(name, data)`,
  `readFile(name)`.
- **Limits** — no module system, no Node APIs; CPU and wall-clock are bounded (raise the budget with
  `--timeout`). Values crossing `evaluate` must be JSON-serializable.

Full reference:
[blackboxqa-scripting](https://github.com/engn-dev/blackboxqa/blob/main/skills/blackboxqa-scripting/references/REFERENCE.md).

## Related packages

- [`@blackboxqa/cli`](https://github.com/engn-dev/blackboxqa/tree/main/apps/blackboxqa) — record verifiable QA **sessions**
  (trace/video/HAR/console) and render a report.
- [`@blackboxqa/ui`](https://github.com/engn-dev/blackboxqa/tree/main/apps/blackboxqa-ui) — browse recorded sessions.

MIT · [source](https://github.com/engn-dev/blackboxqa)
