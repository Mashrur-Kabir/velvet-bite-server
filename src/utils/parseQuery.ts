// src/utils/parseQuery.ts
// Pure string/input manipulation

/**
 * Ensures a query parameter is a single string.
 * Filters out arrays or nested objects provided by Express query parser.
 */
export const getStringQuery = (param: unknown): string | undefined => {
  return typeof param === "string" ? param : undefined;
};

/**
 * Translates URL string logic ("true"/"false") into Boolean logic.
 * Returns undefined for empty strings or missing values to prevent unintended filtering.
 */
export const parseBooleanQuery = (value: unknown): boolean | undefined => {
  const strValue = typeof value === "string" ? value : undefined;

  if (strValue === "true") return true;
  if (strValue === "false") return false;

  return undefined;
};
