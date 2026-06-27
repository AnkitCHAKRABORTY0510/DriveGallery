import { env } from '@/config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class Logger {
  static info(message: string, meta?: Record<string, unknown>) {
    Logger.log('info', message, meta);
  }

  static warn(message: string, meta?: Record<string, unknown>) {
    Logger.log('warn', message, meta);
  }

  static error(message: string, error?: unknown, meta?: Record<string, unknown>) {
    Logger.log('error', message, { error, ...meta });
  }

  static debug(message: string, meta?: Record<string, unknown>) {
    if (env.NODE_ENV !== 'production') {
      Logger.log('debug', message, meta);
    }
  }

  private static log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    
    // In a real production app, this could be piped to Datadog, Axiom, etc.
    const logData = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };

    switch (level) {
      case 'info':
        console.log(JSON.stringify(logData));
        break;
      case 'warn':
        console.warn(JSON.stringify(logData));
        break;
      case 'error':
        console.error(JSON.stringify(logData));
        break;
      case 'debug':
        console.debug(JSON.stringify(logData));
        break;
    }
  }
}
