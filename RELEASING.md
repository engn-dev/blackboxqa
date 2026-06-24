# Releasing

BlackboxQA publishes a small set of public packages to npm under the `@blackboxqa` scope;
the rest stay private (bundled or embedded into the public ones).

## What publishes

| Package          | npm                | bin              | Notes                                              |
| ---------------- | ------------------ | ---------------- | -------------------------------------------------- |
| `@blackboxqa/cli`    | public             | `blackboxqa`         | Self-contained esbuild bundle (deps inlined)       |
| `@blackboxqa/browser`| public             | `blackboxqa-browser` | Self-contained bundle; embeds the daemon           |
| `@blackboxqa/ui`     | public             | —                | Astro node standalone — self-contained `dist/` (no runtime deps) |
| `create-blackboxqa`  | public (unscoped)  | `create-blackboxqa`  | `npm create blackboxqa` setup wizard                   |
| `@blackboxqa/daemon` | **private**        | —                | Embedded as a string into the CLI bundles          |
| `@blackboxqa/protocol`, `@blackboxqa/logger`, `@blackboxqa/cli-kit`, `@blackboxqa/daemon-client`, `@blackboxqa/config` | **private** | — | Bundled into the CLIs by esbuild |

`@blackboxqa/daemon`'s Playwright runtime and `@blackboxqa/ui` are **not** package dependencies — they're
fetched into `~/.blackboxqa/` at runtime (`blackboxqa install` for the daemon, first `blackboxqa ui` for the viewer),
so a plain `npm i -g @blackboxqa/cli` stays small.

## Prerequisites (one-time)

1. **npm scope** — the `@blackboxqa` org (or user scope) must exist on npmjs.com, and the `NPM_TOKEN`
   repo secret must be an automation token with publish rights. Scoped packages publish with
   `--access public` (already in the workflow).
2. **`create-blackboxqa` name** — confirm the unscoped name `create-blackboxqa` is available/owned on npm.
3. **Provenance** — the release workflow sets `id-token: write` so npm records build provenance;
   the `repository` field in each manifest must point at this repo (it does).

## Cutting a release

The guided way — `make release` (wraps `scripts/release.sh`): it refuses a dirty/stale tree,
prompts for the bump (patch/minor/major or a custom version), bumps every package in lockstep,
refreshes the lockfile, validates the build + npm packaging (dry-run), creates the
`chore(release): vX.Y.Z` commit and the annotated tag — then **stops and hands you the push**:

```bash
make release                  # interactive: pick patch / minor / major
make release BUMP=minor        # non-interactive bump
make release VERSION=1.4.0      # explicit version
# env knobs: YES=1 (skip confirm) · NO_VERIFY=1 (skip build+dry-run) · ALLOW_DIRTY=1
```

It prints the exact push to run last. Pushing the tag is intentionally manual — that push is what
publishes to npm.

The manual equivalent, if you'd rather run the steps yourself:

```bash
node scripts/sync-version.mjs 0.2.0   # one version across every package.json + plugin manifests + skill frontmatter
pnpm install                          # refresh the lockfile
git commit -am "chore(release): v0.2.0"  # NB: "release:" alone fails commitlint — use a conventional type
git tag v0.2.0
git push origin main --follow-tags
```

Pushing the tag triggers `.github/workflows/release.yml`, which verifies the tag matches the
workspace version, runs `pnpm build` (topo-ordered), and `pnpm -r publish --access public --provenance`.
`pnpm -r publish` automatically skips private packages and rewrites `workspace:*` to the concrete version.

## How updates reach agents

npm publishes the CLIs, but the agent plugin packs are served straight from this repo — a release
is what makes them update-visible. `scripts/sync-version.mjs`
stamps the same version into every manifest that update detection reads:

- **Claude Code** compares `.claude-plugin/marketplace.json` `plugins[].version` against the
  installed plugin — **no version bump, no visible update**. Users pull it with
  `/plugin marketplace update blackboxqa-marketplace` (or per-marketplace auto-update, which is OFF by
  default for third-party marketplaces).
- **Cursor / Codex** read `.cursor-plugin/plugin.json` and `plugins/blackboxqa/.codex-plugin/plugin.json`
  versions — both synced by the release flow. (Each `skills/*/SKILL.md` `metadata.version` is also
  synced for honesty, not detection.)

Shared doc content (scripting API, workflow rules) lives in `docs/snippets/` and is stitched into
the skills, README, and both CLIs' `--help` by `make docs` — edit snippets, restitch, commit;
`make check` fails on drift. See `docs/snippets/README.md`.

## Verifying a build locally (no publish)

```bash
pnpm build
pnpm --filter @blackboxqa/cli pack         # -> blackboxqa-cli-<v>.tgz
tar -tf blackboxqa-cli-*.tgz               # expect only dist/ (and examples/), no node_modules
```
