import { installCommand } from "./install.js";

// First-run setup: install the browser runtime, then point the user at the
// agent plugin and the viewer. Skills/agents/commands install via the plugin
// marketplaces (Claude Code / Cursor / Codex) — there is no separate skill
// installer.
export async function initCommand(): Promise<number> {
  process.stdout.write(
    "Setting up blackboxqa…\n\n▶ Installing the browser runtime (Chromium)\n"
  );
  const runtime = await installCommand();
  if (runtime !== 0) {
    return runtime;
  }

  process.stdout.write(
    [
      "",
      "✓ blackboxqa is ready.",
      "",
      "  Browse recorded sessions:        blackboxqa-viewer   (after: npm i -g @blackboxqa/ui)",
      "  Claude Code plugin:              /plugin marketplace add engn-dev/blackboxqa",
      "                                   /plugin install blackboxqa@blackboxqa-marketplace",
      "  Try a demo:                      see examples/ in the repo",
      "",
    ].join("\n")
  );
  return 0;
}
