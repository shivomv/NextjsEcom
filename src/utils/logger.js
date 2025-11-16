/**
 * Logging utility that only logs in development
 * Prevents console.log statements in production
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    // Always log errors
    console.error(...args);
  },
  
  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  
  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },
  
  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  }
};

export default logger;
