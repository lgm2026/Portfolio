import { normalizeUrl, hasCustomScheme } from "../payload-builders/url";
import { toEventDateTime } from "../payload-builders/event";
import type { FormsState, QrType, ValidationResult } from "../types";
import { isValidEmail, isValidHttpUrl, phoneDigitCount } from "./common";

function empty(): ValidationResult {
  return { errors: {}, warnings: [] };
}

function validateUrlLike(raw: string, field: string, result: ValidationResult): void {
  const value = raw.trim();
  if (!value) {
    result.errors[field] = "Enter the address this code should open.";
    return;
  }
  const normalized = normalizeUrl(value);
  if (hasCustomScheme(value)) {
    result.warnings.push(
      "Custom link schemes only open on devices with the matching app installed.",
    );
    return;
  }
  if (!isValidHttpUrl(normalized)) {
    result.errors[field] = "That does not look like a valid web address.";
  }
}

function validatePhoneField(
  raw: string,
  field: string,
  result: ValidationResult,
  required: boolean,
): void {
  const value = raw.trim();
  if (!value) {
    if (required) result.errors[field] = "Enter a phone number.";
    return;
  }
  const digits = phoneDigitCount(value);
  if (digits < 5) {
    result.errors[field] = "That phone number looks too short.";
  } else if (digits > 15) {
    result.errors[field] = "That phone number looks too long.";
  } else if (digits < 7) {
    result.warnings.push("Short phone numbers may not dial correctly everywhere.");
  }
}

export function validateForm(type: QrType, forms: FormsState): ValidationResult {
  const result = empty();

  switch (type) {
    case "url": {
      validateUrlLike(forms.url.url, "url", result);
      break;
    }
    case "text": {
      if (!forms.text.text.trim()) {
        result.errors.text = "Enter the text to encode.";
      }
      break;
    }
    case "email": {
      const to = forms.email.to.trim();
      if (!to) {
        result.errors.to = "Enter the recipient email address.";
      } else if (!isValidEmail(to)) {
        result.errors.to = "That does not look like a valid email address.";
      }
      break;
    }
    case "phone": {
      validatePhoneField(forms.phone.phone, "phone", result, true);
      break;
    }
    case "sms": {
      validatePhoneField(forms.sms.phone, "phone", result, true);
      break;
    }
    case "wifi": {
      if (!forms.wifi.ssid.trim()) {
        result.errors.ssid = "Enter the network name (SSID).";
      }
      if (forms.wifi.encryption !== "nopass" && !forms.wifi.password) {
        result.errors.password = "Enter the network password, or set security to None.";
      }
      break;
    }
    case "vcard": {
      if (!forms.vcard.firstName.trim() && !forms.vcard.lastName.trim()) {
        result.errors.firstName = "Enter at least a first or last name.";
      }
      if (forms.vcard.email.trim() && !isValidEmail(forms.vcard.email)) {
        result.errors.email = "That does not look like a valid email address.";
      }
      if (forms.vcard.phone.trim()) {
        validatePhoneField(forms.vcard.phone, "phone", result, false);
      }
      if (forms.vcard.website.trim() && !isValidHttpUrl(normalizeUrl(forms.vcard.website))) {
        result.errors.website = "That does not look like a valid web address.";
      }
      break;
    }
    case "whatsapp": {
      const raw = forms.whatsapp.phone.trim();
      if (!raw) {
        result.errors.phone = "Enter a phone number with country code.";
      } else {
        const digits = phoneDigitCount(raw);
        if (digits < 7 || digits > 15) {
          result.errors.phone = "Enter the full number with country code, digits only.";
        }
      }
      break;
    }
    case "location": {
      if (forms.location.mode === "address") {
        if (!forms.location.address.trim()) {
          result.errors.address = "Enter an address or place name.";
        }
      } else {
        const lat = Number(forms.location.lat);
        const lng = Number(forms.location.lng);
        if (forms.location.lat.trim() === "" || Number.isNaN(lat)) {
          result.errors.lat = "Enter a latitude between -90 and 90.";
        } else if (lat < -90 || lat > 90) {
          result.errors.lat = "Latitude must be between -90 and 90.";
        }
        if (forms.location.lng.trim() === "" || Number.isNaN(lng)) {
          result.errors.lng = "Enter a longitude between -180 and 180.";
        } else if (lng < -180 || lng > 180) {
          result.errors.lng = "Longitude must be between -180 and 180.";
        }
      }
      break;
    }
    case "event": {
      if (!forms.event.title.trim()) {
        result.errors.title = "Enter an event title.";
      }
      if (!forms.event.start.trim()) {
        result.errors.start = "Choose a start date and time.";
      }
      if (forms.event.start && forms.event.end) {
        const start = toEventDateTime(forms.event.start);
        const end = toEventDateTime(forms.event.end);
        if (end <= start) {
          result.errors.end = "The end time must be after the start time.";
        }
      }
      break;
    }
    case "applink": {
      validateUrlLike(forms.applink.link, "link", result);
      break;
    }
    case "social": {
      const handle = forms.social.handle.trim();
      if (!handle) {
        result.errors.handle = "Enter a profile handle or full link.";
      } else if (forms.social.platform === "custom" && !isValidHttpUrl(normalizeUrl(handle))) {
        result.errors.handle = "Enter the full profile link for this platform.";
      } else if (/\s/.test(handle)) {
        result.errors.handle = "Handles and links cannot contain spaces.";
      }
      break;
    }
    case "custom": {
      if (!forms.custom.payload) {
        result.errors.payload = "Enter the raw payload to encode.";
      } else {
        result.warnings.push(
          "Raw payloads are encoded exactly as written. Malformed payloads may not scan as expected.",
        );
      }
      break;
    }
  }

  return result;
}
