import type { WifiForm } from "../types";

/** Escape the characters the WIFI: format treats as special. */
export function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,":])/g, "\\$1");
}

export function buildWifiPayload(form: WifiForm): string {
  const ssid = form.ssid.trim();
  if (!ssid) return "";
  const parts: string[] = [`T:${form.encryption}`, `S:${escapeWifiValue(ssid)}`];
  if (form.encryption !== "nopass" && form.password) {
    parts.push(`P:${escapeWifiValue(form.password)}`);
  }
  if (form.hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}
