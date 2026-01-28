// src/utils/logger.ts

/**
 * Centralized Logger for Velvet Bites
 * Filters logs based on the environment to keep production logs clean.
 */
export const logger = {
  info: (msg: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[INFO]: ${msg}`);
    }
  },

  success: (msg: string) => {
    console.log(`[SUCCESS]: ${msg}`);
  },

  error: (msg: string, err?: any) => {
    // Errors are always logged, regardless of environment
    console.error(`[ERROR]: ${msg}`, err || "");
  },

  warn: (msg: string) => {
    console.warn(`[WARN]: ${msg}`);
  },
};
