/**
 * Logging Utility
 * Centralized logging system to replace console statements
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_COLORS = {
  ERROR: '#ff4444',
  WARN: '#ffaa00',
  INFO: '#4444ff',
  DEBUG: '#888888'
};

class Logger {
  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  setLevel(level) {
    this.level = level;
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    
    if (data) {
      return `${prefix} ${message}`, data;
    }
    return `${prefix} ${message}`;
  }

  log(level, message, data = null) {
    if (LOG_LEVELS[level] > this.level) return;

    const formattedMessage = this.formatMessage(level, message, data);
    
    if (this.isDevelopment) {
      // Use console with colors in development
      const color = LOG_COLORS[level];
      if (data) {
        console.log(`%c${formattedMessage}`, `color: ${color}`, data);
      } else {
        console.log(`%c${formattedMessage}`, `color: ${color}`);
      }
    } else {
      // In production, you might want to send logs to a service
      // For now, we'll just use console but with less verbose output
      if (level === 'ERROR' || level === 'WARN') {
        console.log(formattedMessage, data || '');
      }
    }
  }

  error(message, data = null) {
    this.log('ERROR', message, data);
  }

  warn(message, data = null) {
    this.log('WARN', message, data);
  }

  info(message, data = null) {
    this.log('INFO', message, data);
  }

  debug(message, data = null) {
    this.log('DEBUG', message, data);
  }

  // API specific logging
  apiRequest(method, url, data = null) {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  apiResponse(method, url, status, data = null) {
    const level = status >= 400 ? 'ERROR' : 'DEBUG';
    this.log(level, `API Response: ${method} ${url} - ${status}`, data);
  }

  apiError(method, url, error) {
    this.error(`API Error: ${method} ${url}`, error);
  }

  // Component specific logging
  componentMount(componentName, props = null) {
    this.debug(`Component Mounted: ${componentName}`, props);
  }

  componentUnmount(componentName) {
    this.debug(`Component Unmounted: ${componentName}`);
  }

  componentError(componentName, error) {
    this.error(`Component Error: ${componentName}`, error);
  }

  // User action logging
  userAction(action, data = null) {
    this.info(`User Action: ${action}`, data);
  }

  // Performance logging
  performance(operation, duration) {
    this.debug(`Performance: ${operation} took ${duration}ms`);
  }
}

// Create singleton instance
const logger = new Logger();

// Export both the instance and the class
export default logger;
export { Logger, LOG_LEVELS };
