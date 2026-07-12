import QRCodeStyling from "qr-code-styling";
import type { QrStyle } from "../types";
import { buildQrOptions } from "../qr-options";

export type ExportFormat = "png" | "svg" | "jpg" | "pdf";

export const EXPORT_FORMATS: { value: ExportFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "svg", label: "SVG" },
  { value: "pdf", label: "PDF" },
  { value: "jpg", label: "JPG" },
];

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image data."));
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not decode the rendered code."));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image conversion failed."))),
      type,
      quality,
    );
  });
}

/**
 * Renders the code to a canvas. The QR itself is produced by qr-code-styling
 * with no embedded image, then the logo is composited on top as a plain raster.
 * This deliberately avoids qr-code-styling's image-in-SVG canvas path, which
 * taints the canvas (blocking export) inside sandboxed frames.
 */
async function renderToCanvas(
  data: string,
  style: QrStyle,
  logo: string | null,
): Promise<HTMLCanvasElement> {
  const size = style.size;
  const instance = new QRCodeStyling(buildQrOptions(data, style, null, "canvas"));
  const qrRaw = await instance.getRawData("png");
  if (!(qrRaw instanceof Blob)) {
    throw new Error("The code could not be rendered for export.");
  }
  const qrImage = await loadImage(await blobToDataUrl(qrRaw));

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.drawImage(qrImage, 0, 0, size, size);

  if (logo) {
    const logoImage = await loadImage(logo);
    const box = size * style.logoSize;
    const offset = (size - box) / 2;
    ctx.drawImage(logoImage, offset, offset, box, box);
  }
  return canvas;
}

/** Flatten onto a solid background (JPG has no alpha channel). */
function flattenOntoWhite(source: HTMLCanvasElement, style: QrStyle): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.fillStyle = style.bgTransparent ? "#ffffff" : style.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0);
  return canvas;
}

async function exportPdf(canvas: HTMLCanvasElement, style: QrStyle, filename: string): Promise<void> {
  // jsPDF is loaded on demand so the initial page stays light.
  const { jsPDF } = await import("jspdf");
  const flattened = flattenOntoWhite(canvas, style);
  const dataUrl = flattened.toDataURL("image/png");
  const sizePt = (style.size * 72) / 96;
  const marginPt = 36;
  const pagePt = sizePt + marginPt * 2;
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [pagePt, pagePt] });
  pdf.addImage(dataUrl, "PNG", marginPt, marginPt, sizePt, sizePt);
  pdf.save(filename);
}

/** SVG export keeps the logo embedded as a data URI for a self-contained file. */
async function exportSvg(
  data: string,
  style: QrStyle,
  logo: string | null,
  filename: string,
): Promise<void> {
  const instance = new QRCodeStyling(buildQrOptions(data, style, logo, "svg"));
  const raw = await instance.getRawData("svg");
  if (!(raw instanceof Blob)) throw new Error("The code could not be rendered for export.");
  saveBlob(raw, filename);
}

export interface ExportRequest {
  data: string;
  style: QrStyle;
  logo: string | null;
  format: ExportFormat;
  /** Base name without extension, e.g. "qrhype-url-2026-07-07". */
  baseName: string;
}

/** Renders with the same options as the preview and saves in the chosen format. */
export async function exportQr(request: ExportRequest): Promise<void> {
  const { data, style, logo, format, baseName } = request;
  if (!data) throw new Error("Nothing to export yet.");

  if (format === "svg") {
    await exportSvg(data, style, logo, `${baseName}.svg`);
    return;
  }

  const canvas = await renderToCanvas(data, style, logo);

  if (format === "png") {
    saveBlob(await canvasToBlob(canvas, "image/png"), `${baseName}.png`);
    return;
  }
  if (format === "jpg") {
    const flat = flattenOntoWhite(canvas, style);
    saveBlob(await canvasToBlob(flat, "image/jpeg", 0.92), `${baseName}.jpg`);
    return;
  }
  await exportPdf(canvas, style, `${baseName}.pdf`);
}
