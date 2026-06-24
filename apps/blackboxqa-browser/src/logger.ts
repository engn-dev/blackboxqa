import { createRootLogger } from "@blackboxqa/cli-kit";
import type { Logger } from "@blackboxqa/logger";

// Root CLI logger. Diagnostics go to stderr; stdout stays clean for
// machine-readable output. See @blackboxqa/cli-kit createRootLogger.
export const logger: Logger = createRootLogger("blackboxqa-browser");
