import { useRef, useState } from "react";
import { ImageUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SliderField, SwitchField } from "@/components/ui/field";
import { useToast } from "@/lib/toast";
import { fileToLogoDataUrl, LOGO_ACCEPT } from "../logo";
import { useQr } from "../state";

export function LogoUploader() {
  const { state, dispatch } = useQr();
  const { push } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const hasLogo = state.logoOriginal !== null;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToLogoDataUrl(file);
      dispatch({ type: "SET_LOGO", dataUrl });
      push("success", "Logo added. Error correction set to High for scanability.");
    } catch (error) {
      push("error", error instanceof Error ? error.message : "Could not add that logo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeLogo() {
    dispatch({ type: "SET_LOGO", dataUrl: null });
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept={LOGO_ACCEPT}
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {hasLogo ? (
        <div className="flex items-center gap-3 rounded-xl border border-navy-900/10 bg-navy-50/50 p-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-navy-900/10 bg-white">
            <img
              src={state.logoProcessed ?? state.logoOriginal ?? ""}
              alt="Logo preview"
              className="max-h-12 max-w-12 object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-navy-800">Logo added</p>
            <p className="text-xs text-navy-400">Centered in the code with recovery headroom.</p>
          </div>
          <Button variant="danger" size="sm" onClick={removeLogo}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Remove
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-navy-900/20 bg-navy-50/40 px-4 py-6 text-center transition-colors hover:border-seafoam-400 hover:bg-seafoam-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafoam-500/50 disabled:opacity-60"
        >
          <ImageUp className="h-6 w-6 text-seafoam-600" aria-hidden="true" />
          <span className="text-sm font-medium text-navy-800">
            {busy ? "Processing..." : "Add a center logo"}
          </span>
          <span className="text-xs text-navy-400">PNG, JPG, SVG, or WebP, up to 4 MB</span>
        </button>
      )}

      {hasLogo ? (
        <div className="space-y-4 border-t border-navy-900/5 pt-4">
          <SliderField
            label="Logo size"
            min={15}
            max={40}
            value={Math.round(state.style.logoSize * 100)}
            onChange={(v) => dispatch({ type: "PATCH_STYLE", patch: { logoSize: v / 100 } })}
            format={(v) => `${v}%`}
          />
          <SliderField
            label="Logo padding"
            min={0}
            max={20}
            value={state.style.logoMargin}
            onChange={(v) => dispatch({ type: "PATCH_STYLE", patch: { logoMargin: v } })}
            format={(v) => `${v} px`}
          />
          <SwitchField
            label="White backdrop"
            hint="Adds a clean circular background behind the logo."
            checked={state.style.logoRing}
            onChange={(v) => dispatch({ type: "PATCH_STYLE", patch: { logoRing: v } })}
          />
        </div>
      ) : null}
    </div>
  );
}
