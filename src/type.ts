import type { LEVELS } from '#src/constant.js';

export type LoggerContext = Record<string, unknown>;
export type LoggerLevels = keyof typeof LEVELS;

export type LoggerOptions = {
  pretty: boolean;
  transports: LoggerTransport[];
  level: number;
};

export type TransportData = { type: LoggerLevels } & Record<string, unknown>;
export type TransportOptions = Omit<LoggerOptions, 'transports'>;

export type LoggerTransport = (
  data: TransportData,
  options: TransportOptions,
) => void;
