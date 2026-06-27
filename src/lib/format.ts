/** Small display formatters shared across catalog UI. Pure + unit-tested. */

/** Human file size from kilobytes, e.g. 4470 -> "4.5 MB". Undefined -> "PDF". */
export function formatFileSize(kb?: number): string {
  if (kb == null) return "PDF";
  return `${(kb / 1000).toFixed(1)} MB`;
}

/**
 * Turn an enum/snake_case token into a display label, e.g. "fire_smoke" -> "Fire Smoke".
 * Uses replaceAll so tokens with more than one underscore are fully converted (the old
 * `.replace("_", " ")` only replaced the first underscore).
 */
export function humanizeEnum(value?: string): string {
  if (!value) return "";
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
