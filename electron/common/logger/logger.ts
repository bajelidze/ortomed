import { createLogger, format, transports } from 'winston';

const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message.trim()}`;
});

export default createLogger({
  level: 'info',
  format: format.combine(
    format.cli(),
    format.timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
  ],
});
