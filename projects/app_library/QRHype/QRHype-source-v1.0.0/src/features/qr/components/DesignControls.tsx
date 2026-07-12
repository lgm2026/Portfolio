import { RotateCcw } from "lucide-react";
import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ColorField,
  Segmented,
  SelectField,
  SliderField,
  SwitchField,
} from "@/components/ui/field";
import {
  CORNER_DOT_OPTIONS,
  CORNER_SQUARE_OPTIONS,
  DOT_TYPE_OPTIONS,
  EC_OPTIONS,
  STYLE_PRESETS,
} from "../constants";
import { useQr } from "../state";
import type { QrStyle } from "../types";
import { LogoUploader } from "./LogoUploader";

export function DesignControls() {
  const { state, dispatch } = useQr();
  const { style } = state;

  const patch = (p: Partial<QrStyle>) => dispatch({ type: "PATCH_STYLE", patch: p });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-navy-800">Style presets</p>
        <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "RESET_STYLE" })}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => dispatch({ type: "APPLY_PRESET", presetId: preset.id })}
            className="group flex items-center gap-2.5 rounded-xl border border-navy-900/10 bg-white px-3 py-2 text-left transition-colors hover:border-navy-900/25 hover:bg-navy-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafoam-500/50"
          >
            <span
              className="flex h-6 w-6 shrink-0 overflow-hidden rounded-md border border-navy-900/10"
              aria-hidden="true"
            >
              <span className="h-full w-1/2" style={{ background: preset.swatch[0] }} />
              <span className="h-full w-1/2" style={{ background: preset.swatch[1] }} />
            </span>
            <span className="text-xs font-medium text-navy-700">{preset.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-navy-900/10">
        <div className="px-4">
          <AccordionItem title="Colors" defaultOpen>
            <div className="space-y-4">
              <Segmented
                label="Code fill"
                value={style.fgMode}
                onChange={(fgMode) => patch({ fgMode })}
                options={[
                  { value: "solid", label: "Solid" },
                  { value: "gradient", label: "Gradient" },
                ]}
              />
              <ColorField
                label={style.fgMode === "gradient" ? "Gradient start" : "Code color"}
                value={style.fgColor}
                onChange={(fgColor) => patch({ fgColor })}
              />
              {style.fgMode === "gradient" ? (
                <>
                  <ColorField
                    label="Gradient end"
                    value={style.fgColor2}
                    onChange={(fgColor2) => patch({ fgColor2 })}
                  />
                  <Segmented
                    label="Gradient type"
                    value={style.gradientKind}
                    onChange={(gradientKind) => patch({ gradientKind })}
                    options={[
                      { value: "linear", label: "Linear" },
                      { value: "radial", label: "Radial" },
                    ]}
                  />
                  {style.gradientKind === "linear" ? (
                    <SliderField
                      label="Gradient angle"
                      min={0}
                      max={360}
                      value={style.gradientRotation}
                      onChange={(gradientRotation) => patch({ gradientRotation })}
                      format={(v) => `${v}°`}
                    />
                  ) : null}
                </>
              ) : null}
              <div className="border-t border-navy-900/5 pt-4">
                <SwitchField
                  label="Transparent background"
                  hint="Export with no background fill. Best on light surfaces."
                  checked={style.bgTransparent}
                  onChange={(bgTransparent) => patch({ bgTransparent })}
                />
              </div>
              {!style.bgTransparent ? (
                <ColorField
                  label="Background color"
                  value={style.bgColor}
                  onChange={(bgColor) => patch({ bgColor })}
                />
              ) : null}
            </div>
          </AccordionItem>

          <AccordionItem title="Shape">
            <div className="space-y-4">
              <SelectField
                label="Module style"
                value={style.dotsType}
                onChange={(dotsType) => patch({ dotsType })}
                options={DOT_TYPE_OPTIONS}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label="Corner frame"
                  value={style.cornerSquareStyle}
                  onChange={(cornerSquareStyle) => patch({ cornerSquareStyle })}
                  options={CORNER_SQUARE_OPTIONS}
                />
                <ColorField
                  label="Frame color"
                  value={style.cornerSquareColor}
                  onChange={(cornerSquareColor) => patch({ cornerSquareColor })}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label="Corner center"
                  value={style.cornerDotStyle}
                  onChange={(cornerDotStyle) => patch({ cornerDotStyle })}
                  options={CORNER_DOT_OPTIONS}
                />
                <ColorField
                  label="Center color"
                  value={style.cornerDotColor}
                  onChange={(cornerDotColor) => patch({ cornerDotColor })}
                />
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Logo">
            <LogoUploader />
          </AccordionItem>

          <AccordionItem title="Advanced">
            <div className="space-y-4">
              <SliderField
                label="Size"
                min={200}
                max={1024}
                step={16}
                value={style.size}
                onChange={(size) => patch({ size })}
                format={(v) => `${v} px`}
              />
              <SliderField
                label="Quiet zone (margin)"
                min={0}
                max={40}
                value={style.margin}
                onChange={(margin) => patch({ margin })}
                format={(v) => `${v} px`}
              />
              <SelectField
                label="Error correction"
                value={style.ecLevel}
                onChange={(ecLevel) => patch({ ecLevel })}
                options={EC_OPTIONS}
                hint="Higher recovery survives damage and logos but makes a denser code."
              />
            </div>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}
