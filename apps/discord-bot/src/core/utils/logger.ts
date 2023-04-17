import fs from 'fs';
import path from 'path';

export enum LogLevel {
  DEBUG = "debug",
  ERROR = 'error',
  INFO = 'info',
}

type Event = 'discord' | 'core' | 'compose' | 'verbose' | 'test';

interface LoggerOptions {
  productionMode: boolean;
}

const serializeLogMessage = (message: any): any => {
  if (typeof message === "object" && message !== null) {
    if (message instanceof Error) {
      const {name, message: errorMessage, stack} = message;
      return {name, message: errorMessage, stack};
    } else if (Array.isArray(message)) {
      return message.map((value) => serializeLogMessage(value));
    } else {
      const serializedMessage: { [key: string]: any } = {};
      for (const key in message) {
        serializedMessage[key] = serializeLogMessage(message[key]);
      }
      return serializedMessage;
    }
  } else {
    return message;
  }
};

const log = (level: LogLevel, event: Event, message: any, options: LoggerOptions): void => {
  const logMessage = typeof message === 'string' ? message : JSON.stringify(serializeLogMessage(message));
  const logString = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${event}] \n${logMessage}\n`;

  if (!options.productionMode) {
    console.log(logString);
  }

  if (event === 'test') return;

  const logFilePath = path.join("./", `${level}.log`);
  fs.appendFileSync(logFilePath, logString);
};

export const createLogger = (options: LoggerOptions) => ({
  debug: (event: Event, message: any) => log(LogLevel.DEBUG, event, message, options),
  error: (event: Event, message: any) => log(LogLevel.ERROR, event, message, options),
  info: (event: Event, message: any) => log(LogLevel.INFO, event, message, options),
});

export const logger = createLogger({
  productionMode: process.env.NODE_ENV === 'production' || false,
});
