import { normalizeUrl } from "@/features/qr/payload-builders/url";
import { buildWifiPayload } from "@/features/qr/payload-builders/wifi";
import { buildVCardPayload } from "@/features/qr/payload-builders/vcard";
import { buildEmailPayload } from "@/features/qr/payload-builders/email";
import { buildSmsPayload, buildWhatsAppPayload } from "@/features/qr/payload-builders/phone";
import { buildLocationPayload } from "@/features/qr/payload-builders/location";
import { toEventDateTime, buildEventPayload } from "@/features/qr/payload-builders/event";
import { buildSocialPayload } from "@/features/qr/payload-builders/social";
import { contrastRatio } from "@/lib/color";
import { validateForm } from "@/features/qr/validators";
import type {
  EmailForm,
  EventForm,
  LocationForm,
  SmsForm,
  SocialForm,
  VCardForm,
  WhatsAppForm,
  WifiForm,
} from "@/features/qr/types";
import { DEFAULT_FORMS } from "@/features/qr/constants";

type Check = [string, boolean];
const results: Check[] = [];
function expect(name: string, cond: boolean) {
  results.push([name, cond]);
}

// URL normalization
expect("url adds https", normalizeUrl("example.com") === "https://example.com");
expect("url keeps https", normalizeUrl("https://a.com") === "https://a.com");
expect("url keeps custom scheme", normalizeUrl("myapp://x") === "myapp://x");
expect("url trims", normalizeUrl("  example.com ") === "https://example.com");

// Wi-Fi escaping
const wifi: WifiForm = { ssid: "My;Net", password: "p:a,s\"s", encryption: "WPA", hidden: true };
const wifiOut = buildWifiPayload(wifi);
expect("wifi escapes ssid semicolon", wifiOut.includes("S:My\\;Net"));
expect("wifi escapes password specials", wifiOut.includes("P:p\\:a\\,s\\\"s"));
expect("wifi hidden flag", wifiOut.includes("H:true"));
expect("wifi terminator", wifiOut.endsWith(";;"));
const wifiNoPass = buildWifiPayload({ ssid: "Open", password: "", encryption: "nopass", hidden: false });
expect("wifi nopass omits password", !wifiNoPass.includes("P:"));

// vCard
const vc: VCardForm = {
  firstName: "Ada",
  lastName: "Love, Lace",
  organization: "Analytical; Engines",
  title: "Engineer",
  phone: "+1 (843) 555-0199",
  email: "ada@example.com",
  website: "example.com",
  address: "1 Main St",
  notes: "Note; with, specials",
};
const vcOut = buildVCardPayload(vc);
expect("vcard begins", vcOut.startsWith("BEGIN:VCARD"));
expect("vcard version 3", vcOut.includes("VERSION:3.0"));
expect("vcard escapes comma in name", vcOut.includes("Love\\, Lace"));
expect("vcard escapes semicolon in org", vcOut.includes("Analytical\\; Engines"));
expect("vcard sanitizes phone", vcOut.includes("TEL;TYPE=CELL:+18435550199"));
expect("vcard url normalized", vcOut.includes("URL:https://example.com"));
expect("vcard ends", vcOut.trim().endsWith("END:VCARD"));

// Email
const email: EmailForm = { to: "a@b.com", subject: "Hi there", body: "Line one" };
const emailOut = buildEmailPayload(email);
expect("email mailto", emailOut.startsWith("mailto:a@b.com?"));
expect("email encodes subject", emailOut.includes("subject=Hi%20there"));
expect("email encodes body", emailOut.includes("body=Line%20one"));

// SMS
const sms: SmsForm = { phone: "+1 843 555 0199", message: "Hello" };
expect("sms format", buildSmsPayload(sms) === "SMSTO:+18435550199:Hello");

// WhatsApp
const wa: WhatsAppForm = { phone: "+1 (843) 555-0199", message: "Hey there" };
const waOut = buildWhatsAppPayload(wa);
expect("wa digits only", waOut.startsWith("https://wa.me/18435550199"));
expect("wa encodes text", waOut.includes("text=Hey%20there"));

// Location
const geoLoc: LocationForm = { mode: "coords", address: "", lat: "33.6891", lng: "-78.8867" };
expect("geo uri", buildLocationPayload(geoLoc) === "geo:33.6891,-78.8867");
const addrLoc: LocationForm = { mode: "address", address: "Myrtle Beach, SC", lat: "", lng: "" };
expect("address maps url", buildLocationPayload(addrLoc).includes("query=Myrtle%20Beach%2C%20SC"));

// Event
expect("event dt pads seconds", toEventDateTime("2026-07-07T14:30") === "20260707T143000");
const ev: EventForm = {
  title: "Launch",
  start: "2026-07-07T14:30",
  end: "2026-07-07T15:30",
  location: "HQ",
  description: "Kickoff",
};
const evOut = buildEventPayload(ev);
expect("event vevent", evOut.startsWith("BEGIN:VEVENT"));
expect("event dtstart", evOut.includes("DTSTART:20260707T143000"));
expect("event dtend", evOut.includes("DTEND:20260707T153000"));

// Social
const social: SocialForm = { platform: "instagram", handle: "@coastal" };
expect("social strips at and builds url", buildSocialPayload(social) === "https://instagram.com/coastal");
const socialFull: SocialForm = { platform: "custom", handle: "https://example.com/me" };
expect("social custom passthrough", buildSocialPayload(socialFull) === "https://example.com/me");

// Contrast
expect("contrast black on white is 21", Math.round(contrastRatio("#000000", "#ffffff")) === 21);
expect("contrast identical is 1", Math.round(contrastRatio("#2a8171", "#2a8171")) === 1);

// Validation gates
const badUrl = validateForm("url", { ...DEFAULT_FORMS, url: { url: "" } });
expect("empty url errors", Object.keys(badUrl.errors).length > 0);
const okUrl = validateForm("url", { ...DEFAULT_FORMS, url: { url: "example.com" } });
expect("valid url passes", Object.keys(okUrl.errors).length === 0);
const badEvent = validateForm("event", {
  ...DEFAULT_FORMS,
  event: { title: "X", start: "2026-07-07T15:30", end: "2026-07-07T14:30", location: "", description: "" },
});
expect("event end before start errors", "end" in badEvent.errors);

const failed = results.filter(([, ok]) => !ok);
for (const [name, ok] of results) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length > 0) process.exit(1);
