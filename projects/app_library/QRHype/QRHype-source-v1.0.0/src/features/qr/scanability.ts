import { contrastRatio, luminance } from "@/lib/color";
import { DATA_LENGTH_WARN } from "./constants";
import type { QrStyle } from "./types";

export type CheckStatus = "pass" | "warn" | "fail";

export interface CheckItem {
  id: string;
  status: CheckStatus;
  label: string;
  detail?: string;
}

interface ScanabilityInput {
  style: QrStyle;
  payload: string;
  hasLogo: boolean;
  /** True when the renderer could not fit the data at the current settings. */
  overflow: boolean;
}

/**
 * A practical pre-flight for real-world scanning. These checks advise, they
 * never block a download; the goal is a code that scans on the first try
 * from a phone at arm's length.
 */
export function evaluateScanability(input: ScanabilityInput): CheckItem[] {
  const { style, payload, hasLogo, overflow } = input;
  const items: CheckItem[] = [];

  // Contrast between modules and background.
  const effectiveBg = style.bgTransparent ? "#ffffff" : style.bgColor;
  const fgSamples = style.fgMode === "gradient" ? [style.fgColor, style.fgColor2] : [style.fgColor];
  const worstRatio = Math.min(...fgSamples.map((c) => contrastRatio(c, effectiveBg)));
  if (worstRatio >= 4) {
    items.push({ id: "contrast", status: "pass", label: "Strong contrast between code and background" });
  } else if (worstRatio >= 2.5) {
    items.push({
      id: "contrast",
      status: "warn",
      label: "Contrast is on the low side",
      detail: "Darker code colors or a lighter background will scan more reliably.",
    });
  } else {
    items.push({
      id: "contrast",
      status: "fail",
      label: "Contrast is too low for reliable scanning",
      detail: "This color and background combination may be hard to scan. Increase the difference between them.",
    });
  }

  // Inverted codes (light modules on dark background) trip up some readers.
  const worstFg = fgSamples.reduce((a, b) => (luminance(a) > luminance(b) ? a : b));
  if (!style.bgTransparent && luminance(worstFg) > luminance(effectiveBg)) {
    items.push({
      id: "inverted",
      status: "warn",
      label: "Light code on a dark background",
      detail: "Some scanners struggle with inverted codes. Dark modules on a light background are safest.",
    });
  }

  // Transparent backgrounds depend on the surface behind them.
  if (style.bgTransparent) {
    items.push({
      id: "transparent",
      status: "warn",
      label: "Transparent background",
      detail: "Scanability depends on the surface behind the code. Place it on a light, even background.",
    });
  }

  // Logo coverage and error correction headroom.
  if (hasLogo) {
    if (style.logoSize > 0.4) {
      items.push({
        id: "logo",
        status: "fail",
        label: "Logo is too large",
        detail: "Reduce the logo size below 40% so enough of the code survives.",
      });
    } else if (style.logoSize > 0.3) {
      items.push({
        id: "logo",
        status: "warn",
        label: "Large logo may reduce scanability",
        detail: "Logos above 30% of the code width start eating into recovery headroom.",
      });
    } else {
      items.push({ id: "logo", status: "pass", label: "Logo size leaves room for recovery" });
    }
    if (style.ecLevel !== "H") {
      items.push({
        id: "logo-ec",
        status: "warn",
        label: "Use error correction H with a logo",
        detail: "High recovery lets scanners rebuild the modules the logo covers.",
      });
    }
  }

  // Quiet zone.
  if (style.margin < 4) {
    items.push({
      id: "margin",
      status: "warn",
      label: "Quiet zone is very small",
      detail: "A margin of at least 8 px helps scanners find the code's edges.",
    });
  } else if (style.margin < 8) {
    items.push({
      id: "margin",
      status: "warn",
      label: "Quiet zone is a little tight",
      detail: "More breathing room around the code makes it easier to lock on.",
    });
  } else {
    items.push({ id: "margin", status: "pass", label: "Healthy quiet zone around the code" });
  }

  // Data density.
  if (overflow) {
    items.push({
      id: "density",
      status: "fail",
      label: "Too much data for these settings",
      detail: "Shorten the content or lower the error correction level.",
    });
  } else if (payload.length > DATA_LENGTH_WARN) {
    items.push({
      id: "density",
      status: "warn",
      label: "Dense code",
      detail: "Long content produces a fine-grained code. Print it larger or shorten the content.",
    });
  } else if (payload.length > 0) {
    items.push({ id: "density", status: "pass", label: "Comfortable data density" });
  }

  return items;
}
