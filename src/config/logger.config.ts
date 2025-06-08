import { LoggerService } from '@nestjs/common';
import { Logger, pino } from 'pino';

export const createLogger = (): Logger => {
  return pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'SYS:standard',
      },
    },
    level: process.env.LOG_LEVEL || 'info',
    base: {
      env: process.env.NODE_ENV,
      app: 'watch-api',
    },
  });
};

export class PinoLogger implements LoggerService {
  private context?: string;

  constructor(private readonly logger: Logger) {}

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, ...args: any[]) {
    this.logger.info({ context: this.context, ...args }, message);
  }

  error(message: string, trace?: string, ...args: any[]) {
    this.logger.error({ context: this.context, trace, ...args }, message);
  }

  warn(message: string, ...args: any[]) {
    this.logger.warn({ context: this.context, ...args }, message);
  }

  debug(message: string, ...args: any[]) {
    this.logger.debug({ context: this.context, ...args }, message);
  }

  verbose(message: string, ...args: any[]) {
    this.logger.trace({ context: this.context, ...args }, message);
  }
} 