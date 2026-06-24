import { homedir } from "node:os";
import { join } from "node:path";
import { daemonPipeName } from "./ipc/pipename.js";

const DIR_NAME = ".blackboxqa";
const DAEMON_SOCKET = "daemon.sock";
const DAEMON_PID = "daemon.pid";
const DAEMON_BUNDLE = "daemon.mjs";
const SANDBOX_CLIENT = "sandbox-client.js";
const PACKAGE_JSON = "package.json";
const TMP_DIR = "tmp";
const SESSIONS_DIR = "sessions";
const SESSION_RECORD = "session.json";
const SESSION_MANIFEST = "manifest.json";
const SESSION_RESULTS = "results.json";
const SESSION_REPORT = "report.html";

export function home(): string {
  const dir = homedir();
  if (!dir) {
    throw new Error("Could not determine home directory");
  }
  return dir;
}

export function blackboxqaDir(): string {
  return join(home(), DIR_NAME);
}

export function daemonSocketPath(): string {
  return join(blackboxqaDir(), DAEMON_SOCKET);
}

export function daemonPidPath(): string {
  return join(blackboxqaDir(), DAEMON_PID);
}

export function daemonBundlePath(): string {
  return join(blackboxqaDir(), DAEMON_BUNDLE);
}

export function sandboxClientPath(): string {
  return join(blackboxqaDir(), SANDBOX_CLIENT);
}

export function packageJsonPath(): string {
  return join(blackboxqaDir(), PACKAGE_JSON);
}

export function tmpDir(): string {
  return join(blackboxqaDir(), TMP_DIR);
}

// Endpoint path used by net.createConnection / createServer. On POSIX this
// is a Unix domain socket path; on Windows it is a named-pipe path
// (`\\.\pipe\blackboxqa-daemon-{user}`) — Node's `net` module accepts both.
export function daemonEndpoint(): string {
  if (process.platform === "win32") {
    return `\\\\.\\pipe\\${daemonPipeName()}`;
  }
  return daemonSocketPath();
}

// ---- Session artifact layout: ~/.blackboxqa/sessions/<id>/ ----
// Shared by the daemon (writes trace/video/HAR/console + manifest) and the
// `blackboxqa` orchestrator (writes session.json, reads artifacts, renders report).

export function sessionsRootDir(): string {
  return join(blackboxqaDir(), SESSIONS_DIR);
}

export function sessionDir(sessionId: string): string {
  return join(sessionsRootDir(), sessionId);
}

export function sessionRecordPath(sessionId: string): string {
  return join(sessionDir(sessionId), SESSION_RECORD);
}

export function sessionManifestPath(sessionId: string): string {
  return join(sessionDir(sessionId), SESSION_MANIFEST);
}

// Canonical, schema-versioned per-session record (references every artifact).
export function sessionResultsPath(sessionId: string): string {
  return join(sessionDir(sessionId), SESSION_RESULTS);
}

export function sessionReportPath(sessionId: string): string {
  return join(sessionDir(sessionId), SESSION_REPORT);
}
