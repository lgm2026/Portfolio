export const LOGO_ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp";
export const LOGO_MAX_BYTES = 4 * 1024 * 1024;

const CANVAS_SIZE = 512;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not decode that image."));
    image.src = src;
  });
}

/**
 * Everything happens in the browser. The file is read locally, resized on a
 * canvas, and returned as a data URL. It is never uploaded anywhere.
 */
export async function fileToLogoDataUrl(file: File): Promise<string> {
  if (file.size > LOGO_MAX_BYTES) {
    throw new Error("Logo files must be 4 MB or smaller.");
  }
  const dataUrl = await readFileAsDataUrl(file);
  try {
    return await normalizeLogo(dataUrl);
  } catch {
    // Some SVGs cannot be rasterized here; the renderer can still place the
    // original, so fall back rather than fail the upload.
    return dataUrl;
  }
}

/** Resize onto a square transparent canvas so oversized files stay light. */
async function normalizeLogo(dataUrl: string): Promise<string> {
  const image = await loadImage(dataUrl);
  const width = image.naturalWidth || CANVAS_SIZE;
  const height = image.naturalHeight || CANVAS_SIZE;
  const scale = Math.min(1, CANVAS_SIZE / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");
  ctx.drawImage(image, 0, 0, w, h);
  return canvas.toDataURL("image/png");
}

/**
 * Draw the logo centered on a white circular backdrop. The pale ring keeps
 * busy logos legible and preserves a clean landing zone inside the code.
 */
export async function withBackdropRing(dataUrl: string): Promise<string> {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");

  const center = CANVAS_SIZE / 2;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(center, center, center, 0, Math.PI * 2);
  ctx.fill();

  const inner = CANVAS_SIZE * 0.72;
  const width = image.naturalWidth || inner;
  const height = image.naturalHeight || inner;
  const scale = Math.min(inner / width, inner / height);
  const w = width * scale;
  const h = height * scale;
  ctx.drawImage(image, center - w / 2, center - h / 2, w, h);
  return canvas.toDataURL("image/png");
}
