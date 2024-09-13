import { LEVELS } from '#src/constant.js';
import { ConsoleTransport } from '#src/transport.js';

import type {
  LoggerLevels,
  LoggerContext,
  LoggerOptions,
  TransportData,
} from '#src/type.js';

export class Logger {
  private context: LoggerContext;
  private options: LoggerOptions;

  constructor(
    options: Partial<LoggerOptions> = {},
    context: LoggerContext = {},
  ) {
    const {
      level = Number(process.env.LOG_LEVEL) || LEVELS['info'],
      transports = [ConsoleTransport.run],
      pretty = process.env.NODE_ENV === 'development',
    } = options;

    this.context = context;
    this.options = { pretty, transports, level };
  }

  log(type: LoggerLevels, message: unknown) {
    const { level, transports } = this.options;
    const data: TransportData = { type, ...this.context };

    if (LEVELS[type] > level) return;

    if (message && typeof message === 'object' && !Array.isArray(message)) {
      if (message instanceof Error) {
        for (const key of Object.getOwnPropertyNames(message)) {
          data[key] = message[key as keyof typeof message];
        }
      } else {
        Object.assign(data, message);
      }
    } else {
      data.message = message;
    }

    for (const transport of transports) transport(data, this.options);
  }

  debug(message: unknown) {
    return this.log('debug', message);
  }

  info(message: unknown) {
    return this.log('info', message);
  }

  warn(message: unknown) {
    return this.log('warn', message);
  }

  error(message: unknown) {
    return this.log('error', message);
  }

  fatal(message: unknown) {
    return this.log('fatal', message);
  }

  createChild(context: LoggerContext = {}) {
    return new Logger(this.options, { ...this.context, ...context });
  }
}

export const logger = new Logger();
