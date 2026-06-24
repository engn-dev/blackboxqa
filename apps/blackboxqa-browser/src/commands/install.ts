import { installDaemonRuntime } from "@blackboxqa/daemon-client";

// Install Playwright + runtime deps under ~/.blackboxqa/. Delegates to the
// shared daemon-client implementation (same runtime the daemon embeds).
export function installRuntime(): Promise<number> {
  return installDaemonRuntime();
}
