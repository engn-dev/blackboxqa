# Changelog

## Unreleased

### Added

- Initial blackboxqa monorepo scaffold (pnpm + Turborepo).
- Bootstrapped from MIT-licensed upstream work by Sawyer Hood (see `LICENSE`). Migrated:
  - `cli-ts/` → `apps/blackboxqa-browser/` (browser engine CLI, bin: `blackboxqa-browser`)
  - `daemon/` → `apps/blackboxqa-daemon/` (internal Playwright host + QuickJS sandbox)
  - `daemon/src/protocol.ts` → `packages/protocol/` (Zod schemas, single source of truth)
- Shared `@blackboxqa/config` package (tsconfig bases).
- `@blackboxqa/logger` — shared pino-backed structured logging, used by the daemon
  (writes to `~/.blackboxqa/daemon.log`) and the CLI (stderr; `--verbose` /
  `BBQA_LOG_LEVEL`).
- [Ultracite](https://docs.ultracite.ai/) (Biome) for linting + formatting,
  enforced in CI; replaced Prettier and removed the unused eslint-config package.
- Dropped the Rust and Go CLI implementations and their docs entirely.
