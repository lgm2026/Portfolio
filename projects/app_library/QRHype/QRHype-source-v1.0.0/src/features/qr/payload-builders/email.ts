import type { EmailForm } from "../types";

export function buildEmailPayload(form: EmailForm): string {
  const to = form.to.trim();
  if (!to) return "";
  const params: string[] = [];
  if (form.subject.trim()) params.push(`subject=${encodeURIComponent(form.subject)}`);
  if (form.body.trim()) params.push(`body=${encodeURIComponent(form.body)}`);
  return params.length > 0 ? `mailto:${to}?${params.join("&")}` : `mailto:${to}`;
}
