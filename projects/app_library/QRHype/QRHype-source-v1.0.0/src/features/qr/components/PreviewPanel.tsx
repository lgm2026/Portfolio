import { useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { useDebouncedValue } from "@/lib/hooks";
import { todayIso } from "@/lib/utils";
import { SAMPLE_PAYLOAD, TYPE_META } from "../constants";
import { buildQrOptions } from "../qr-options";
import { evaluateScanability } from "../scanability";
import { EXPORT_FORMATS, exportQr, type ExportFormat } from "../exporters";
import { useQr, usePayload } from "../state";
import { ScanabilityList } from "./ScanabilityList";

export function PreviewPanel() {
  const { state } = useQr();
  const { data, ready } = usePayload();
  const { push } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [exporting, setExporting] = useState(false);
  const [overflow, setOverflow] = useState(false);

  const showingSample = !ready;
  const renderData = ready ? data : SAMPLE_PAYLOAD;
  const logo = state.logoProcessed;

  // Debounce so dragging sliders and typing stay smooth.
  const debouncedData = useDebouncedValue(renderData, 140);
  const debouncedStyle = useDebouncedValue(state.style, 140);
  const debouncedLogo = useDebouncedValue(logo, 140);

  const options = useMemo(
    () => buildQrOptions(debouncedData, debouncedStyle, debouncedLogo, "svg"),
    [debouncedData, debouncedStyle, debouncedLogo],
  );

  // Create the instance once, then update it in place.
  useEffect(() => {
    if (!containerRef.current) return;
    const instance = new QRCodeStyling(options);
    qrRef.current = instance;
    containerRef.current.replaceChildren();
    instance.append(containerRef.current);
    return () => {
      qrRef.current = null;
    };
    // Intentionally run once; updates happen in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!qrRef.current) return;
    try {
      qrRef.current.update(options);
      setOverflow(false);
    } catch {
      // Thrown when the data cannot fit at the chosen error correction level.
      setOverflow(true);
    }
  }, [options]);

  const checks = useMemo(
    () =>
      evaluateScanability({
        style: state.style,
        payload: renderData,
        hasLogo: state.logoOriginal !== null,
        overflow,
      }),
    [state.style, state.logoOriginal, renderData, overflow],
  );

  const hasFailure = checks.some((c) => c.status === "fail");
  const canDownload = ready && !overflow && !hasFailure;
  const baseName = `qrhype-${TYPE_META[state.qrType].slug}-${todayIso()}`;

  async function onDownload() {
    if (!canDownload) return;
    setExporting(true);
    try {
      await exportQr({ data, style: state.style, logo, format, baseName });
      push("success", `Downloaded ${baseName}.${format}`);
    } catch (error) {
      push("error", error instanceof Error ? error.message : "Download failed.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center">
        <div
          className={showingSample ? "opacity-45 transition-opacity" : "transition-opacity"}
          aria-hidden={showingSample}
        >
          <div className="qr-frame checker rounded-2xl border border-navy-900/10 bg-white p-3 shadow-card">
            <div ref={containerRef} />
          </div>
        </div>
        <p className="mt-3 h-4 text-xs text-navy-400" aria-live="polite">
          {showingSample ? "Sample preview. Complete step 1 to generate your code." : null}
        </p>
      </div>

      <div>
        <div className="flex items-stretch gap-2">
          <div className="relative flex-1">
            <label htmlFor="export-format" className="sr-only">
              Download format
            </label>
            <select
              id="export-format"
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              className="h-11 w-full appearance-none rounded-xl border border-navy-900/15 bg-white pl-3.5 pr-9 text-sm font-medium text-navy-800 focus:outline-none focus:ring-2 focus:ring-seafoam-500/50"
            >
              {EXPORT_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400"
              aria-hidden="true"
            />
          </div>
          <Button
            size="lg"
            onClick={onDownload}
            disabled={!canDownload || exporting}
            className="flex-[1.4]"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
            Download
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-navy-400">
          {canDownload ? (
            <>
              Saves as{" "}
              <span className="font-mono text-navy-500">
                {baseName}.{format}
              </span>
            </>
          ) : ready ? (
            "Resolve the flagged issue above to enable download."
          ) : (
            "Complete step 1 to enable download."
          )}
        </p>
      </div>

      <ScanabilityList items={checks} />

      {ready ? (
        <details className="group rounded-xl border border-navy-900/10 bg-navy-50/40 px-3.5 py-2.5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-navy-700">
            View encoded payload
            <ChevronDown
              className="h-4 w-4 text-navy-400 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-navy-600">
            {data}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
