import fs from 'fs';
import path from 'path';

enum LogLevel {
  DEBUG = "debug",
  ERROR = 'error',
  INFO = 'info',
}

type Event = 'discord' | 'core' | 'compose' | 'verbose';

interface LoggerOptions {
  productionMode: boolean;
}

const log = (level: LogLevel, event: Event, message: any, options: LoggerOptions): void => {
  const logString = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${event}] ${JSON.stringify(message)}\n`;
  if (!options.productionMode) {
    console.log(logString);
  }

  const logFilePath = path.join("./", `${level}.log`);
  fs.appendFileSync(logFilePath, logString);
};

export const createLogger = (options: LoggerOptions) => ({
  debug: (event: Event, message: any) => log(LogLevel.DEBUG, event, message, options),
  error: (event: Event, message: any) => log(LogLevel.ERROR, event, message, options),
  info: (event: Event, message: any) => log(LogLevel.INFO, event, message, options),
});

export const logger = createLogger({
  productionMode: process.env.NODE_ENV == 'PROD' || false,
});
