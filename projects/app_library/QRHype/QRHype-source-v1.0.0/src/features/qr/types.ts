export type QrType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "wifi"
  | "vcard"
  | "whatsapp"
  | "location"
  | "event"
  | "applink"
  | "social"
  | "custom";

export interface UrlForm {
  url: string;
}

export interface TextForm {
  text: string;
}

export interface EmailForm {
  to: string;
  subject: string;
  body: string;
}

export interface PhoneForm {
  phone: string;
}

export interface SmsForm {
  phone: string;
  message: string;
}

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface WifiForm {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface VCardForm {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  notes: string;
}

export interface WhatsAppForm {
  phone: string;
  message: string;
}

export type LocationMode = "address" | "coords";

export interface LocationForm {
  mode: LocationMode;
  address: string;
  lat: string;
  lng: string;
}

export interface EventForm {
  title: string;
  start: string;
  end: string;
  location: string;
  description: string;
}

export interface AppLinkForm {
  link: string;
}

export type SocialPlatform =
  | "instagram"
  | "x"
  | "facebook"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "github"
  | "threads"
  | "pinterest"
  | "custom";

export interface SocialForm {
  platform: SocialPlatform;
  handle: string;
}

export interface CustomForm {
  payload: string;
}

export interface FormsState {
  url: UrlForm;
  text: TextForm;
  email: EmailForm;
  phone: PhoneForm;
  sms: SmsForm;
  wifi: WifiForm;
  vcard: VCardForm;
  whatsapp: WhatsAppForm;
  location: LocationForm;
  event: EventForm;
  applink: AppLinkForm;
  social: SocialForm;
  custom: CustomForm;
}

export type FgMode = "solid" | "gradient";
export type GradientKind = "linear" | "radial";
export type EcLevel = "L" | "M" | "Q" | "H";

export type DotsType =
  | "square"
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type CornerSquareStyle = "square" | "extra-rounded" | "dot";
export type CornerDotStyle = "square" | "dot";

export interface QrStyle {
  fgMode: FgMode;
  fgColor: string;
  fgColor2: string;
  gradientKind: GradientKind;
  /** Degrees, 0 to 360. Converted to radians for the renderer. */
  gradientRotation: number;
  bgTransparent: boolean;
  bgColor: string;
  dotsType: DotsType;
  cornerSquareStyle: CornerSquareStyle;
  cornerSquareColor: string;
  cornerDotStyle: CornerDotStyle;
  cornerDotColor: string;
  /** Quiet zone in pixels around the code. */
  margin: number;
  /** Rendered and exported size in pixels. */
  size: number;
  ecLevel: EcLevel;
  /** Logo width as a fraction of the code, 0.15 to 0.45. */
  logoSize: number;
  /** Clear padding around the logo in pixels. */
  logoMargin: number;
  /** Draw a white circular backdrop behind the logo. */
  logoRing: boolean;
}

export interface QrState {
  qrType: QrType;
  forms: FormsState;
  style: QrStyle;
  /** Original uploaded logo as a data URL. */
  logoOriginal: string | null;
  /** Logo after resize and optional backdrop, ready for the renderer. */
  logoProcessed: string | null;
}

export interface ValidationResult {
  /** Field name to message. Any entry blocks download. */
  errors: Record<string, string>;
  /** Non-blocking advice shown in the scanability panel. */
  warnings: string[];
}
