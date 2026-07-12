export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const host = url.hostname;
    return host.length > 0 && (host.includes(".") || host === "localhost");
  } catch {
    return false;
  }
}

/** Sanity check on digit count, not a full E.164 validation. */
export function phoneDigitCount(value: string): number {
  return value.replace(/\D/g, "").length;
}
