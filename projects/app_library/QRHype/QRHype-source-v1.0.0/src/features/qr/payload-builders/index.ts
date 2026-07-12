import type { FormsState, QrType } from "../types";
import { buildEmailPayload } from "./email";
import { buildEventPayload } from "./event";
import { buildLocationPayload } from "./location";
import { buildPhonePayload, buildSmsPayload, buildWhatsAppPayload } from "./phone";
import { buildSocialPayload } from "./social";
import { buildCustomPayload, buildTextPayload } from "./text";
import { buildAppLinkPayload, buildUrlPayload } from "./url";
import { buildVCardPayload } from "./vcard";
import { buildWifiPayload } from "./wifi";

/**
 * Turn the active form into the exact string encoded in the QR code.
 * Pure and side-effect free so it stays trivially unit-testable, and so a
 * future V2 (batch generation, an API, saved projects) can reuse it as-is.
 */
export function buildPayload(type: QrType, forms: FormsState): string {
  switch (type) {
    case "url":
      return buildUrlPayload(forms.url);
    case "text":
      return buildTextPayload(forms.text);
    case "email":
      return buildEmailPayload(forms.email);
    case "phone":
      return buildPhonePayload(forms.phone);
    case "sms":
      return buildSmsPayload(forms.sms);
    case "wifi":
      return buildWifiPayload(forms.wifi);
    case "vcard":
      return buildVCardPayload(forms.vcard);
    case "whatsapp":
      return buildWhatsAppPayload(forms.whatsapp);
    case "location":
      return buildLocationPayload(forms.location);
    case "event":
      return buildEventPayload(forms.event);
    case "applink":
      return buildAppLinkPayload(forms.applink);
    case "social":
      return buildSocialPayload(forms.social);
    case "custom":
      return buildCustomPayload(forms.custom);
  }
}
