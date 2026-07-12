import type { LocationForm } from "../types";

export function buildLocationPayload(form: LocationForm): string {
  if (form.mode === "coords") {
    const lat = form.lat.trim();
    const lng = form.lng.trim();
    if (!lat || !lng) return "";
    // geo: URIs open the default maps app on both major platforms.
    return `geo:${lat},${lng}`;
  }
  const address = form.address.trim();
  if (!address) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
