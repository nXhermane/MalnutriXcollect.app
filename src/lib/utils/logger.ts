export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  enableTimestamp: boolean;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
}

const MAX_HISTORY_SIZE = 50;
const MAX_DATA_DEPTH = 2;

function safeSerialize(data: unknown, depth = 0): unknown {
  if (depth > MAX_DATA_DEPTH) return '[truncated]';
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;
  if (data instanceof Error) return { message: data.message, name: data.name };

  try {
    if (Array.isArray(data)) {
      return data.slice(0, 10).map((item) => safeSerialize(item, depth + 1));
    }
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(data as object).slice(0, 20)) {
      result[key] = safeSerialize((data as Record<string, unknown>)[key], depth + 1);
    }
    return result;
  } catch {
    return '[unserializable]';
  }
}

class Logger {
  private config: LoggerConfig;
  private logHistory: LogEntry[] = [];
  private context?: string;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      enabled: __DEV__,
      minLevel: __DEV__ ? LogLevel.DEBUG : LogLevel.WARN,
      enableTimestamp: false,
      ...config,
    };
  }

  setContext(context: string): Logger {
    const child = new Logger(this.config);
    child.context = context;
    child.logHistory = this.logHistory;
    return child;
  }

  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  setMinLevel(level: LogLevel): void {
    this.config.minLevel = level;
  }

  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: Error | unknown): void {
    this.log(LogLevel.ERROR, message, error);
  }

  fatal(message: string, error?: Error | unknown): void {
    this.log(LogLevel.FATAL, message, error);
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.config.enabled || level < this.config.minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: this.config.enableTimestamp ? new Date().toISOString() : '',
      context: this.context,
      data: data !== undefined ? safeSerialize(data) : undefined,
    };

    this.addToHistory(entry);
    this.consoleOutput(entry);
  }

  private consoleOutput(entry: LogEntry): void {
    const { level, message, timestamp, context, data } = entry;
    const levelLabels = ['[DEBUG]', '[INFO]', '[WARN]', '[ERROR]', '[FATAL]'];
    const prefix = [timestamp, levelLabels[level], context ? `[${context}]` : '']
      .filter(Boolean)
      .join('');
    const fullMessage = `${prefix} ${message}`;

    if (data !== undefined) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(fullMessage, data);
          break;
        case LogLevel.INFO:
          console.info(fullMessage, data);
          break;
        case LogLevel.WARN:
          console.warn(fullMessage, data);
          break;
        default:
          console.error(fullMessage, data);
          break;
      }
    } else {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(fullMessage);
          break;
        case LogLevel.INFO:
          console.info(fullMessage);
          break;
        case LogLevel.WARN:
          console.warn(fullMessage);
          break;
        default:
          console.error(fullMessage);
          break;
      }
    }
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    if (this.logHistory.length > MAX_HISTORY_SIZE) {
      this.logHistory.shift();
    }
  }

  getHistory(filter?: { level?: LogLevel; context?: string }): LogEntry[] {
    if (!filter) return [...this.logHistory];
    return this.logHistory.filter((entry) => {
      if (filter.level !== undefined && entry.level !== filter.level) return false;
      if (filter.context !== undefined && entry.context !== filter.context) return false;
      return true;
    });
  }

  clearHistory(): void {
    this.logHistory = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2);
  }

  time(label: string): () => void {
    const start = Date.now();
    return () => this.debug(`⏱️ ${label}: ${Date.now() - start}ms`);
  }

  group(label: string, callback: () => void): void {
    if (__DEV__) {
      console.group(label);
      callback();
      console.groupEnd();
    } else {
      callback();
    }
  }

  async wrapAsync<T>(fn: () => Promise<T>, context: string): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      this.error(`Error in ${context}`, error as Error);
      return null;
    }
  }
}

export const logger = new Logger();
export { Logger };
export const createLogger = (context: string): Logger => logger.setContext(context);
