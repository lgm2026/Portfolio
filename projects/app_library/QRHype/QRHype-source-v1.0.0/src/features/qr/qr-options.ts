import type { Options } from "qr-code-styling";
import type { QrStyle } from "./types";

interface FgFill {
  color?: string;
  gradient?: NonNullable<Options["dotsOptions"]>["gradient"];
}

function foregroundFill(style: QrStyle): FgFill {
  if (style.fgMode === "gradient") {
    return {
      gradient: {
        type: style.gradientKind,
        rotation: (style.gradientRotation * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: style.fgColor },
          { offset: 1, color: style.fgColor2 },
        ],
      },
    };
  }
  return { color: style.fgColor };
}

/**
 * Single source of truth for renderer options. The live preview and every
 * export format call this, so what you see is exactly what you download.
 */
export function buildQrOptions(
  data: string,
  style: QrStyle,
  logo: string | null,
  drawType: "canvas" | "svg" = "canvas",
): Partial<Options> {
  const options: Partial<Options> = {
    type: drawType,
    width: style.size,
    height: style.size,
    data,
    margin: style.margin,
    qrOptions: {
      errorCorrectionLevel: style.ecLevel,
    },
    dotsOptions: {
      type: style.dotsType,
      ...foregroundFill(style),
    },
    backgroundOptions: {
      color: style.bgTransparent ? "rgba(255,255,255,0)" : style.bgColor,
    },
    cornersSquareOptions: {
      type: style.cornerSquareStyle,
      color: style.cornerSquareColor,
    },
    cornersDotOptions: {
      type: style.cornerDotStyle,
      color: style.cornerDotColor,
    },
  };

  if (logo) {
    options.image = logo;
    options.imageOptions = {
      imageSize: style.logoSize,
      margin: style.logoMargin,
      hideBackgroundDots: true,
      // Use the data URL directly. The default (true) triggers an internal
      // XHR against the image, which is blocked in sandboxed frames and would
      // hang rendering and export.
      saveAsBlob: false,
    };
  }

  return options;
}
