import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import Config from '../config';

const logDirectory = path.join(__dirname, '../console-log');

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const opts = {
  filename: `${logDirectory}/application-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
}

const localLogger = createLogger({
  level: 'info',
  // format: format.json(),
  format: combine(
    label({ label: 'mongo-mysql' }),
    timestamp(),
    myFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    // new transports.File({ filename: 'localLogger/error.log', level: 'error' }),
    // new transports.File({ filename: 'localLogger/combined.log' })

    // 
    // - Daily basis localLogger
    // 
    new DailyRotateFile(opts)
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (Config.env !== 'production') {
  localLogger.add(new transports.Console({
    format: combine(
      label({ label: Config.host }),
      timestamp(),
      myFormat
    ),
  }));
}

export default localLogger