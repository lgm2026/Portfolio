import type { PhoneForm, SmsForm, WhatsAppForm } from "../types";

/** Keep a single leading plus and digits, drop everything else. */
export function sanitizePhone(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/\D/g, "");
}

export function buildPhonePayload(form: PhoneForm): string {
  const phone = sanitizePhone(form.phone);
  return phone ? `tel:${phone}` : "";
}

/** SMSTO is the classic QR form and the most widely recognized. */
export function buildSmsPayload(form: SmsForm): string {
  const phone = sanitizePhone(form.phone);
  if (!phone) return "";
  return `SMSTO:${phone}:${form.message}`;
}

/** wa.me links require country code digits with no plus sign. */
export function buildWhatsAppPayload(form: WhatsAppForm): string {
  const digits = form.phone.replace(/\D/g, "");
  if (!digits) return "";
  const message = form.message.trim();
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}
