import { Injectable } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly prefix = '[Decision]';

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, args);
  }

  error(message: string, error?: unknown, ...args: unknown[]): void {
    this.log('error', message, [error, ...args]);
  }

  private log(level: LogLevel, message: string, args: unknown[]): void {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    const payload = args.length ? [this.prefix, message, ...args] : [this.prefix, message];
    fn.apply(console, payload);
  }
}
