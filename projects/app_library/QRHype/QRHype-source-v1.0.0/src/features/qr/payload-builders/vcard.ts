import type { VCardForm } from "../types";
import { sanitizePhone } from "./phone";
import { normalizeUrl } from "./url";

/** vCard 3.0 text escaping for backslash, newline, comma, semicolon. */
export function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildVCardPayload(form: VCardForm): string {
  const first = form.firstName.trim();
  const last = form.lastName.trim();
  if (!first && !last) return "";

  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(`N:${escapeVCardValue(last)};${escapeVCardValue(first)};;;`);
  lines.push(`FN:${escapeVCardValue([first, last].filter(Boolean).join(" "))}`);
  if (form.organization.trim()) lines.push(`ORG:${escapeVCardValue(form.organization.trim())}`);
  if (form.title.trim()) lines.push(`TITLE:${escapeVCardValue(form.title.trim())}`);
  if (form.phone.trim()) lines.push(`TEL;TYPE=CELL:${sanitizePhone(form.phone)}`);
  if (form.email.trim()) lines.push(`EMAIL:${form.email.trim()}`);
  if (form.website.trim()) lines.push(`URL:${normalizeUrl(form.website)}`);
  if (form.address.trim()) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCardValue(form.address.trim())};;;;`);
  }
  if (form.notes.trim()) lines.push(`NOTE:${escapeVCardValue(form.notes.trim())}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}
