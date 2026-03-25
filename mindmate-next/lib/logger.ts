/**
 * Unified logger for MindMate.
 * In development, logs to the console.
 * In production, this can be connected to Sentry, LogRocket, or Datadog.
 */

type LogLevel = 'info' | 'warn' | 'error';

const IS_PROD = process.env.NODE_ENV === 'production';

export const logger = {
  info: (message: string, data?: any) => {
    if (!IS_PROD) {
      console.info(`[INFO] ${message}`, data || '');
    }
    // Production: send to analytics/logging service here
  },

  warn: (message: string, data?: any) => {
    if (!IS_PROD) {
      console.warn(`[WARN] ${message}`, data || '');
    } else {
      // Production: send to monitoring service as a warning
    }
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error || '');
    
    if (IS_PROD) {
      // Production: CRITICAL ERROR 
      // Example: Sentry.captureException(error);
    }
  },

  /**
   * Tracks custom events (e.g. "Report Submitted", "PDF Generated")
   */
  trackEvent: (eventName: string, metadata?: any) => {
    if (!IS_PROD) {
      console.log(`[EVENT] ${eventName}`, metadata || '');
    }
    // Production: send to PostHog, Mixpanel, etc.
  }
};

export default logger;
