import { styleText } from 'util';
import { LEVELS } from '#src/constant.js';

import type {
  LoggerLevels,
  TransportData,
  TransportOptions,
} from '#src/type.js';

type Colors = Parameters<typeof styleText>[0];

export class ConsoleTransport {
  static COLORS: Record<LoggerLevels, Colors> = {
    debug: 'grey',
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    fatal: 'black',
  } as const;

  static run(data: TransportData, options: TransportOptions) {
    let message: string;

    const space = options.pretty ? 2 : undefined;
    try {
      message = JSON.stringify(data, undefined, space);
    } catch {
      message = 'Stringify message error';
    }

    if (process.stdout.isTTY && options.pretty)
      message = ConsoleTransport.applyColor(message, data.type);

    ConsoleTransport.getConsoleMethod(data.type)(message);
  }

  static getConsoleMethod(type: LoggerLevels) {
    return LEVELS[type] > LEVELS['warn'] ? console.log : console.error;
  }

  static applyColor(message: string, type: LoggerLevels): string {
    const color = ConsoleTransport.COLORS[type];
    return styleText(color, message);
  }
}
