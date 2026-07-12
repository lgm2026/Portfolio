import type { EventForm } from "../types";
import { escapeVCardValue } from "./vcard";

/** "2026-07-07T14:30" from a datetime-local input becomes "20260707T143000". */
export function toEventDateTime(value: string): string {
  const compact = value.trim().replace(/[-:]/g, "");
  if (!compact) return "";
  return compact.length === 13 ? `${compact}00` : compact;
}

export function buildEventPayload(form: EventForm): string {
  const title = form.title.trim();
  const start = toEventDateTime(form.start);
  if (!title || !start) return "";

  const lines: string[] = ["BEGIN:VEVENT"];
  lines.push(`SUMMARY:${escapeVCardValue(title)}`);
  lines.push(`DTSTART:${start}`);
  const end = toEventDateTime(form.end);
  if (end) lines.push(`DTEND:${end}`);
  if (form.location.trim()) lines.push(`LOCATION:${escapeVCardValue(form.location.trim())}`);
  if (form.description.trim()) {
    lines.push(`DESCRIPTION:${escapeVCardValue(form.description.trim())}`);
  }
  lines.push("END:VEVENT");
  return lines.join("\n");
}
