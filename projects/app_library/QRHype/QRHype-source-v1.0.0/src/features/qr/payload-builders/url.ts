import type { AppLinkForm, UrlForm } from "../types";

const SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

/** Trim input and prepend https:// when no scheme is present. */
export function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (SCHEME_PATTERN.test(value)) return value;
  return `https://${value}`;
}

export function hasCustomScheme(raw: string): boolean {
  const value = raw.trim();
  return SCHEME_PATTERN.test(value) && !/^https?:/i.test(value);
}

export function buildUrlPayload(form: UrlForm): string {
  return normalizeUrl(form.url);
}

export function buildAppLinkPayload(form: AppLinkForm): string {
  const value = form.link.trim();
  if (!value) return "";
  // Custom schemes like myapp://path pass through untouched.
  if (SCHEME_PATTERN.test(value)) return value;
  return `https://${value}`;
}
