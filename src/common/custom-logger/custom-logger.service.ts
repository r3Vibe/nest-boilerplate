import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromisess } from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  async logToFile(entry: string) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(new Date())}\t${entry}`;
    try {
      if (!fs.existsSync(path.join(__dirname, '../../logs'))) {
        await fsPromisess.mkdir(path.join(__dirname, '../../logs'));
      }
      await fsPromisess.appendFile(
        path.join(__dirname, '../../logs', 'app.log'),
        `${formattedEntry}\n`,
      );
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  }
  log(message: any, context?: string): void {
    const entry = `${context}\t${message}`;
    this.logToFile(entry);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string): void {
    const entry = `${stackOrContext}\t${message}`;
    this.logToFile(entry);
    super.error(message, stackOrContext);
  }
}
