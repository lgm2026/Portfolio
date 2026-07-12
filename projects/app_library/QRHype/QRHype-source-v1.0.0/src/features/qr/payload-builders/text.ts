import type { CustomForm, TextForm } from "../types";

export function buildTextPayload(form: TextForm): string {
  return form.text;
}

export function buildCustomPayload(form: CustomForm): string {
  return form.payload;
}
