import type {
  CornerDotStyle,
  CornerSquareStyle,
  DotsType,
  EcLevel,
  FormsState,
  QrStyle,
  QrType,
  SocialPlatform,
} from "./types";

export interface TypeMeta {
  id: QrType;
  label: string;
  slug: string;
  description: string;
}

export const TYPE_META: Record<QrType, TypeMeta> = {
  url: {
    id: "url",
    label: "Website URL",
    slug: "url",
    description: "Open a web page when scanned.",
  },
  text: {
    id: "text",
    label: "Plain text",
    slug: "text",
    description: "Show a message, code, or note when scanned.",
  },
  email: {
    id: "email",
    label: "Email",
    slug: "email",
    description: "Open a pre-filled email draft.",
  },
  phone: {
    id: "phone",
    label: "Phone call",
    slug: "phone",
    description: "Start a call to this number.",
  },
  sms: {
    id: "sms",
    label: "SMS",
    slug: "sms",
    description: "Open a text message with the number and message filled in.",
  },
  wifi: {
    id: "wifi",
    label: "Wi-Fi network",
    slug: "wifi",
    description: "Join a Wi-Fi network without typing the password.",
  },
  vcard: {
    id: "vcard",
    label: "Contact card (vCard)",
    slug: "vcard",
    description: "Save a contact to the phone's address book.",
  },
  whatsapp: {
    id: "whatsapp",
    label: "WhatsApp",
    slug: "whatsapp",
    description: "Start a WhatsApp chat, with an optional first message.",
  },
  location: {
    id: "location",
    label: "Location or maps",
    slug: "location",
    description: "Open a place in the phone's maps app.",
  },
  event: {
    id: "event",
    label: "Calendar event",
    slug: "event",
    description: "Add an event to the phone's calendar.",
  },
  applink: {
    id: "applink",
    label: "App store or deep link",
    slug: "app-link",
    description: "Open an app store listing or an app deep link.",
  },
  social: {
    id: "social",
    label: "Social media profile",
    slug: "social",
    description: "Open a social profile from a handle or full link.",
  },
  custom: {
    id: "custom",
    label: "Custom raw payload",
    slug: "custom",
    description: "Encode any raw string exactly as written. Advanced.",
  },
};

export const TYPE_ORDER: QrType[] = [
  "url",
  "text",
  "email",
  "phone",
  "sms",
  "wifi",
  "vcard",
  "whatsapp",
  "location",
  "event",
  "applink",
  "social",
  "custom",
];

export const SOCIAL_PLATFORMS: { id: SocialPlatform; label: string; template: string | null }[] = [
  { id: "instagram", label: "Instagram", template: "https://instagram.com/{handle}" },
  { id: "x", label: "X (Twitter)", template: "https://x.com/{handle}" },
  { id: "facebook", label: "Facebook", template: "https://facebook.com/{handle}" },
  { id: "linkedin", label: "LinkedIn", template: "https://www.linkedin.com/in/{handle}" },
  { id: "tiktok", label: "TikTok", template: "https://www.tiktok.com/@{handle}" },
  { id: "youtube", label: "YouTube", template: "https://www.youtube.com/@{handle}" },
  { id: "github", label: "GitHub", template: "https://github.com/{handle}" },
  { id: "threads", label: "Threads", template: "https://www.threads.net/@{handle}" },
  { id: "pinterest", label: "Pinterest", template: "https://www.pinterest.com/{handle}" },
  { id: "custom", label: "Other (full URL)", template: null },
];

export const DOT_TYPE_OPTIONS: { value: DotsType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy rounded" },
  { value: "extra-rounded", label: "Extra rounded" },
];

export const CORNER_SQUARE_OPTIONS: { value: CornerSquareStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Rounded" },
  { value: "dot", label: "Dot" },
];

export const CORNER_DOT_OPTIONS: { value: CornerDotStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
];

export const EC_OPTIONS: { value: EcLevel; label: string }[] = [
  { value: "L", label: "L (7% recovery)" },
  { value: "M", label: "M (15% recovery)" },
  { value: "Q", label: "Q (25% recovery)" },
  { value: "H", label: "H (30% recovery)" },
];

export const DEFAULT_STYLE: QrStyle = {
  fgMode: "solid",
  fgColor: "#16324a",
  fgColor2: "#2a8171",
  gradientKind: "linear",
  gradientRotation: 45,
  bgTransparent: false,
  bgColor: "#ffffff",
  dotsType: "rounded",
  cornerSquareStyle: "extra-rounded",
  cornerSquareColor: "#16324a",
  cornerDotStyle: "dot",
  cornerDotColor: "#2a8171",
  margin: 12,
  size: 320,
  ecLevel: "Q",
  logoSize: 0.25,
  logoMargin: 6,
  logoRing: true,
};

export const DEFAULT_FORMS: FormsState = {
  url: { url: "" },
  text: { text: "" },
  email: { to: "", subject: "", body: "" },
  phone: { phone: "" },
  sms: { phone: "", message: "" },
  wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  vcard: {
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    notes: "",
  },
  whatsapp: { phone: "", message: "" },
  location: { mode: "address", address: "", lat: "", lng: "" },
  event: { title: "", start: "", end: "", location: "", description: "" },
  applink: { link: "" },
  social: { platform: "instagram", handle: "" },
  custom: { payload: "" },
};

export interface StylePreset {
  id: string;
  name: string;
  /** Small swatch shown on the preset chip. */
  swatch: [string, string];
  patch: Partial<QrStyle>;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "classic",
    name: "Classic",
    swatch: ["#000000", "#ffffff"],
    patch: {
      fgMode: "solid",
      fgColor: "#000000",
      bgTransparent: false,
      bgColor: "#ffffff",
      dotsType: "square",
      cornerSquareStyle: "square",
      cornerSquareColor: "#000000",
      cornerDotStyle: "square",
      cornerDotColor: "#000000",
    },
  },
  {
    id: "seafoam",
    name: "Seafoam",
    swatch: ["#2a8171", "#ffffff"],
    patch: {
      fgMode: "solid",
      fgColor: "#2a8171",
      bgTransparent: false,
      bgColor: "#ffffff",
      dotsType: "rounded",
      cornerSquareStyle: "extra-rounded",
      cornerSquareColor: "#1e453f",
      cornerDotStyle: "dot",
      cornerDotColor: "#2a8171",
    },
  },
  {
    id: "coastal-gradient",
    name: "Coastal gradient",
    swatch: ["#399e8a", "#16324a"],
    patch: {
      fgMode: "gradient",
      fgColor: "#2a8171",
      fgColor2: "#16324a",
      gradientKind: "linear",
      gradientRotation: 45,
      bgTransparent: false,
      bgColor: "#ffffff",
      dotsType: "extra-rounded",
      cornerSquareStyle: "extra-rounded",
      cornerSquareColor: "#16324a",
      cornerDotStyle: "dot",
      cornerDotColor: "#2a8171",
    },
  },
  {
    id: "navy-executive",
    name: "Navy executive",
    swatch: ["#16324a", "#f5f2ea"],
    patch: {
      fgMode: "solid",
      fgColor: "#16324a",
      bgTransparent: false,
      bgColor: "#f5f2ea",
      dotsType: "classy-rounded",
      cornerSquareStyle: "square",
      cornerSquareColor: "#16324a",
      cornerDotStyle: "square",
      cornerDotColor: "#16324a",
    },
  },
  {
    id: "slate-minimal",
    name: "Slate minimal",
    swatch: ["#345067", "#e6edf3"],
    patch: {
      fgMode: "solid",
      fgColor: "#345067",
      bgTransparent: false,
      bgColor: "#ffffff",
      dotsType: "dots",
      cornerSquareStyle: "dot",
      cornerSquareColor: "#345067",
      cornerDotStyle: "dot",
      cornerDotColor: "#345067",
    },
  },
  {
    id: "sand-and-sea",
    name: "Sand and sea",
    swatch: ["#25675c", "#fbfaf7"],
    patch: {
      fgMode: "solid",
      fgColor: "#25675c",
      bgTransparent: false,
      bgColor: "#fbfaf7",
      dotsType: "rounded",
      cornerSquareStyle: "extra-rounded",
      cornerSquareColor: "#16324a",
      cornerDotStyle: "dot",
      cornerDotColor: "#25675c",
    },
  },
];

/** Shown in the preview while step 1 is incomplete. */
export const SAMPLE_PAYLOAD = "https://qrhype.example";

/** Above this the code gets dense and slower to scan. */
export const DATA_LENGTH_WARN = 500;
