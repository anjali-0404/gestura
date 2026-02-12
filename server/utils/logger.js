// utils/logger.js - Logging utility
const logLevel = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARN: 'WARN',
  DEBUG: 'DEBUG'
};

const log = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}`;
  
  if (level === logLevel.ERROR) {
    console.error(logEntry, data || '');
  } else if (level === logLevel.WARN) {
    console.warn(logEntry, data || '');
  } else {
    console.log(logEntry, data || '');
  }
};

export const logger = {
  info: (message, data) => log(logLevel.INFO, message, data),
  error: (message, data) => log(logLevel.ERROR, message, data),
  warn: (message, data) => log(logLevel.WARN, message, data),
  debug: (message, data) => log(logLevel.DEBUG, message, data)
};

export default logger;
