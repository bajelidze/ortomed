import { createLogger, format, transports } from 'winston';

const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message.trim()}`;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.cli(),
    format.timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console(),
  ],
});

export default logger;
