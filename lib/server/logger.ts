type LogContext = Record<string, string | number | boolean | null | undefined>;

export function logInfo(message: string, context: LogContext = {}) {
  console.info(formatLog("info", message, context));
}

export function logWarn(message: string, context: LogContext = {}) {
  console.warn(formatLog("warn", message, context));
}

export function logError(message: string, context: LogContext = {}) {
  console.error(formatLog("error", message, context));
}

function formatLog(level: string, message: string, context: LogContext) {
  return JSON.stringify({
    app: "fresh-bloom",
    level,
    message,
    ...context,
  });
}
