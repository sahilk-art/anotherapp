import { Injectable, Logger } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLogger {
  private logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
    ],
  });

  log(message: string, context?: string) {
    this.logger.info({ message, context, timestamp: new Date().toISOString() });
  }

  error(message: string, stack?: string, context?: string) {
    this.logger.error({ message, stack, context, timestamp: new Date().toISOString() });
  }

  warn(message: string, context?: string) {
    this.logger.warn({ message, context, timestamp: new Date().toISOString() });
  }
}
