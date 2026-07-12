import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { isValidHex } from "@/lib/color";

const inputClass =
  "w-full rounded-xl border border-navy-900/15 bg-white px-3.5 py-2.5 text-sm text-navy-900 " +
  "placeholder:text-navy-300 transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-seafoam-500/50 focus:border-seafoam-500 " +
  "aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus:ring-rose-300";

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

function FieldShell({ id, label, required, hint, error, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-800">
        {label}
        {required ? (
          <span className="text-seafoam-700" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-rose-700"
        >
          <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-navy-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface CommonFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

interface TextFieldProps extends CommonFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  maxLength?: number;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
  required,
  hint,
  error,
}: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={inputClass}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-required={required || undefined}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends CommonFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  mono?: boolean;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  mono,
  required,
  hint,
  error,
}: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <textarea
        id={id}
        rows={rows}
        className={cn(inputClass, "resize-y", mono && "font-mono text-xs leading-relaxed")}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-required={required || undefined}
      />
    </FieldShell>
  );
}

interface SelectFieldProps<T extends string> extends CommonFieldProps {
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  required,
  hint,
  error,
}: SelectFieldProps<T>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <div className="relative">
        <select
          id={id}
          className={cn(inputClass, "appearance-none pr-10")}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}

interface SwitchFieldProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SwitchField({ label, hint, checked, onChange }: SwitchFieldProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <label htmlFor={id} className="block cursor-pointer text-sm font-medium text-navy-800">
          {label}
        </label>
        {hint ? <p className="mt-0.5 text-xs text-navy-400">{hint}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafoam-500/50 focus-visible:ring-offset-2",
          checked ? "bg-seafoam-600" : "bg-navy-200",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
}: SliderFieldProps) {
  const id = useId();
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-navy-800">
          {label}
        </label>
        <span className="text-xs font-medium tabular-nums text-navy-500">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Native color swatch synced with an editable hex value. */
export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const id = useId();
  const validHex = isValidHex(value);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-800">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} color picker`}
          className="h-10 w-12 shrink-0 rounded-lg"
          value={validHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          id={id}
          type="text"
          className={cn(inputClass, "font-mono uppercase")}
          value={value}
          maxLength={7}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!validHex || undefined}
          aria-describedby={!validHex ? `${id}-error` : undefined}
        />
      </div>
      {!validHex ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-rose-700">
          Enter a hex color like #2A8171.
        </p>
      ) : null}
    </div>
  );
}

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}

/** Radio group styled as a segmented control. */
export function Segmented<T extends string>({ label, value, onChange, options }: SegmentedProps<T>) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-navy-800">{label}</legend>
      <div className="inline-flex w-full rounded-xl border border-navy-900/15 bg-navy-50/60 p-1">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-center text-sm font-medium transition-colors",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-seafoam-500/50",
                active ? "bg-white text-navy-900 shadow-sm" : "text-navy-500 hover:text-navy-700",
              )}
            >
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
