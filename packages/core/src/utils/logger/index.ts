// Copyright (C) LoginID

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  NONE, // For production
}

/**
 * A class for logging messages with different severity levels.
 */
export class Logger {
  private logLevel: LogLevel;

  /**
   * Creates a default Logger instance.
   * If the environment is production, the log level is set to `LogLevel.NONE`.
   * Otherwise, it defaults to `LogLevel.DEBUG`.
   *
   * @returns {Logger} A new instance of Logger with the appropriate log level.
   */
  static createDefault(): Logger {
    const isProduction = process.env.NODE_ENV === "production";
    const level = isProduction ? LogLevel.NONE : LogLevel.DEBUG;
    return new Logger(level);
  }

  /**
   * A default static logger instance with the appropriate log level.
   *
   * This logger is created using `Logger.createDefault()` and automatically
   * adjusts its log level based on the environment. In production, the log
   * level is set to `LogLevel.NONE`, while in other environments it defaults
   * to `LogLevel.DEBUG`.
   */
  static logger = Logger.createDefault();

  /**
   * Constructs a new Logger instance with the specified log level.
   *
   * @param {LogLevel} level - The log level to set. Defaults to `LogLevel.WARN`.
   */
  constructor(level: LogLevel = LogLevel.WARN) {
    this.logLevel = level;
  }

  /**
   * Logs a debug message if the current log level allows it.
   *
   * @param {string} message - The message to log.
   */
  debug(message: string): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`);
    }
  }

  /**
   * Logs an informational message if the current log level allows it.
   *
   * @param {string} message - The message to log.
   */
  info(message: string): void {
    if (this.logLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`);
    }
  }

  /**
   * Logs a warning message if the current log level allows it.
   *
   * @param {string} message - The message to log.
   */
  warn(message: string): void {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`);
    }
  }

  /**
   * Logs an error message if the current log level allows it.
   *
   * @param {string} message - The message to log.
   */
  error(message: string): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`);
    }
  }

  /**
   * Retrieves current set log level number.
   *
   * @return {number} The log level number.
   */
  get level() {
    return this.logLevel;
  }
}
