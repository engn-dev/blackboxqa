import { installDaemonRuntime } from "@blackboxqa/daemon-client";

// Install the embedded daemon runtime (Playwright + sandbox) under
// ~/.blackboxqa/. Shared with blackboxqa-browser; safe to run repeatedly.
export function installCommand(): Promise<number> {
  return installDaemonRuntime();
}
