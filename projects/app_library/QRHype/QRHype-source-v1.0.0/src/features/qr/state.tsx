import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { DEFAULT_FORMS, DEFAULT_STYLE, STYLE_PRESETS } from "./constants";
import { withBackdropRing } from "./logo";
import { buildPayload } from "./payload-builders";
import type { FormsState, QrState, QrStyle, QrType, ValidationResult } from "./types";
import { validateForm } from "./validators";

type QrAction =
  | { type: "SET_TYPE"; qrType: QrType }
  | { type: "PATCH_FORM"; qrType: QrType; patch: Partial<FormsState[QrType]> }
  | { type: "PATCH_STYLE"; patch: Partial<QrStyle> }
  | { type: "APPLY_PRESET"; presetId: string }
  | { type: "RESET_STYLE" }
  | { type: "SET_LOGO"; dataUrl: string | null }
  | { type: "SET_LOGO_PROCESSED"; dataUrl: string | null };

const INITIAL_STATE: QrState = {
  qrType: "url",
  forms: DEFAULT_FORMS,
  style: DEFAULT_STYLE,
  logoOriginal: null,
  logoProcessed: null,
};

function reducer(state: QrState, action: QrAction): QrState {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, qrType: action.qrType };
    case "PATCH_FORM": {
      const current = state.forms[action.qrType];
      const next = { ...current, ...action.patch };
      return {
        ...state,
        forms: { ...state.forms, [action.qrType]: next } as FormsState,
      };
    }
    case "PATCH_STYLE":
      return { ...state, style: { ...state.style, ...action.patch } };
    case "APPLY_PRESET": {
      const preset = STYLE_PRESETS.find((p) => p.id === action.presetId);
      if (!preset) return state;
      return { ...state, style: { ...state.style, ...preset.patch } };
    }
    case "RESET_STYLE": {
      // Reset every design control; a logo stays until removed explicitly.
      const ecLevel = state.logoOriginal ? "H" : DEFAULT_STYLE.ecLevel;
      return { ...state, style: { ...DEFAULT_STYLE, ecLevel } };
    }
    case "SET_LOGO": {
      if (action.dataUrl === null) {
        return { ...state, logoOriginal: null, logoProcessed: null };
      }
      // Default to high error correction so the covered modules recover.
      return {
        ...state,
        logoOriginal: action.dataUrl,
        style: { ...state.style, ecLevel: "H" },
      };
    }
    case "SET_LOGO_PROCESSED":
      return { ...state, logoProcessed: action.dataUrl };
  }
}

interface QrContextValue {
  state: QrState;
  dispatch: Dispatch<QrAction>;
}

const QrContext = createContext<QrContextValue | null>(null);

export function QrProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Derive the renderer-ready logo whenever the source or ring setting changes.
  const { logoOriginal } = state;
  const { logoRing } = state.style;
  useEffect(() => {
    let cancelled = false;
    if (!logoOriginal) {
      dispatch({ type: "SET_LOGO_PROCESSED", dataUrl: null });
      return;
    }
    if (!logoRing) {
      dispatch({ type: "SET_LOGO_PROCESSED", dataUrl: logoOriginal });
      return;
    }
    withBackdropRing(logoOriginal)
      .then((processed) => {
        if (!cancelled) dispatch({ type: "SET_LOGO_PROCESSED", dataUrl: processed });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "SET_LOGO_PROCESSED", dataUrl: logoOriginal });
      });
    return () => {
      cancelled = true;
    };
  }, [logoOriginal, logoRing]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <QrContext.Provider value={value}>{children}</QrContext.Provider>;
}

export function useQr(): QrContextValue {
  const ctx = useContext(QrContext);
  if (!ctx) throw new Error("useQr must be used inside QrProvider");
  return ctx;
}

/** Typed access to one destination form plus a partial patch setter. */
export function useFormSlice<K extends QrType>(
  qrType: K,
): [FormsState[K], (patch: Partial<FormsState[K]>) => void] {
  const { state, dispatch } = useQr();
  const patch = useCallback(
    (p: Partial<FormsState[K]>) => dispatch({ type: "PATCH_FORM", qrType, patch: p }),
    [dispatch, qrType],
  );
  return [state.forms[qrType], patch];
}

export interface PayloadInfo {
  data: string;
  validation: ValidationResult;
  /** True when the payload is complete and error free. */
  ready: boolean;
}

/** Validation plus the encoded payload for the active destination. */
export function usePayload(): PayloadInfo {
  const { state } = useQr();
  const { qrType, forms } = state;
  return useMemo(() => {
    const validation = validateForm(qrType, forms);
    const hasErrors = Object.keys(validation.errors).length > 0;
    const data = hasErrors ? "" : buildPayload(qrType, forms);
    return { data, validation, ready: !hasErrors && data.length > 0 };
  }, [qrType, forms]);
}
