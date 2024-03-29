import { createLogger, format, transports } from 'winston';
import { DateTime } from 'luxon';

const myFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  let msg = `${level}[${DateTime.fromISO(timestamp).toISO()}]: ${message.trim()}`;

  if (meta != undefined && meta.length > 0) {
    msg += ' ' + JSON.stringify(meta);
  }

  return msg;
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
