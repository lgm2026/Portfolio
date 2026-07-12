// Provides a downloadable, fully self-contained copy of QRHype for offline use.
//
// In the single-file build (__QRHYPE_OFFLINE__ === "self") the running document
// is already self-contained, so we capture its markup at load time, before the
// app mutates the DOM, and hand that back. In the standard multi-file build we
// fetch the companion qrhype-offline.html that ships alongside the app.

// Captured once at module evaluation, which runs before React mounts. Guarded
// so the capture and its cost are dropped entirely from the multi-file build.
const PRISTINE_DOCUMENT =
  __QRHYPE_OFFLINE__ === "self" && typeof document !== "undefined"
    ? `<!doctype html>\n${document.documentElement.outerHTML}`
    : "";

const OFFLINE_FILENAME = "QRHype-offline.html";

function triggerDownload(blob: Blob, filename: string): void {
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

/**
 * Saves a single HTML file that runs QRHype with no server and no network.
 * Open the downloaded file in any browser, including by double-clicking it.
 */
export async function downloadOfflineApp(): Promise<void> {
  if (__QRHYPE_OFFLINE__ === "self") {
    if (!PRISTINE_DOCUMENT) throw new Error("Offline copy is unavailable here.");
    triggerDownload(
      new Blob([PRISTINE_DOCUMENT], { type: "text/html;charset=utf-8" }),
      OFFLINE_FILENAME,
    );
    return;
  }

  // Multi-file build: fetch the self-contained file shipped next to the app.
  const url = new URL("qrhype-offline.html", document.baseURI).toString();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("The offline copy could not be reached. Try again while online.");
  }
  triggerDownload(await response.blob(), OFFLINE_FILENAME);
}
