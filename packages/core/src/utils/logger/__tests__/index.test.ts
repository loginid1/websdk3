// Copyright (C) LoginID

import { Logger, LogLevel } from "../index.ts";

describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    jest.spyOn(console, "debug").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("logs messages at appropriate levels", () => {
    const logLevels = [
      { level: LogLevel.DEBUG, consoleMethod: console.debug },
      { level: LogLevel.INFO, consoleMethod: console.info },
      { level: LogLevel.WARN, consoleMethod: console.warn },
      { level: LogLevel.ERROR, consoleMethod: console.error },
      { level: LogLevel.NONE, consoleMethod: console.error },
    ];

    logLevels.forEach(({ level }) => {
      logger = new Logger(level);
      const message = `Test message for ${LogLevel[level]}`;

      logger.debug(message);
      logger.info(message);
      logger.warn(message);
      logger.error(message);

      switch (level) {
        case LogLevel.DEBUG:
          expect(console.debug).toHaveBeenCalledWith(`[DEBUG] ${message}`);
          expect(console.info).toHaveBeenCalledWith(`[INFO] ${message}`);
          expect(console.warn).toHaveBeenCalledWith(`[WARN] ${message}`);
          expect(console.error).toHaveBeenCalledWith(`[ERROR] ${message}`);
          break;

        case LogLevel.INFO:
          expect(console.debug).not.toHaveBeenCalled();
          expect(console.info).toHaveBeenCalledWith(`[INFO] ${message}`);
          expect(console.warn).toHaveBeenCalledWith(`[WARN] ${message}`);
          expect(console.error).toHaveBeenCalledWith(`[ERROR] ${message}`);
          break;

        case LogLevel.WARN:
          expect(console.debug).not.toHaveBeenCalled();
          expect(console.info).not.toHaveBeenCalled();
          expect(console.warn).toHaveBeenCalledWith(`[WARN] ${message}`);
          expect(console.error).toHaveBeenCalledWith(`[ERROR] ${message}`);
          break;

        case LogLevel.ERROR:
          expect(console.debug).not.toHaveBeenCalled();
          expect(console.info).not.toHaveBeenCalled();
          expect(console.warn).not.toHaveBeenCalled();
          expect(console.error).toHaveBeenCalledWith(`[ERROR] ${message}`);
          break;

        case LogLevel.NONE:
          expect(console.debug).not.toHaveBeenCalled();
          expect(console.info).not.toHaveBeenCalled();
          expect(console.warn).not.toHaveBeenCalled();
          expect(console.error).not.toHaveBeenCalled();
          break;

        default:
          throw new Error("Unknown log level");
      }

      jest.clearAllMocks();
    });
  });

  it("default ", () => {
    process.env.NODE_ENV = "production";
    logger = Logger.createDefault();
    expect(logger.level).toBe(LogLevel.NONE);

    process.env.NODE_ENV = "development";
    logger = Logger.createDefault();
    expect(logger.level).toBe(LogLevel.DEBUG);
  });
});
