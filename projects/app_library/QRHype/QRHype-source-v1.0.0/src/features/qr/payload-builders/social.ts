import { SOCIAL_PLATFORMS } from "../constants";
import type { SocialForm } from "../types";
import { normalizeUrl } from "./url";

export function buildSocialPayload(form: SocialForm): string {
  const input = form.handle.trim();
  if (!input) return "";
  // Full links are used as-is so unusual profile paths still work.
  if (/^https?:\/\//i.test(input) || input.includes("/")) {
    return normalizeUrl(input);
  }
  const platform = SOCIAL_PLATFORMS.find((p) => p.id === form.platform);
  if (!platform || platform.template === null) {
    return normalizeUrl(input);
  }
  const handle = input.replace(/^@/, "");
  return platform.template.replace("{handle}", encodeURIComponent(handle));
}
