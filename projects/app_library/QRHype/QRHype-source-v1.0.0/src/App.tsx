import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalDialog, type LegalPage } from "@/components/layout/legal";
import { Card, StepCard } from "@/components/ui/card";
import { QrProvider, usePayload, useQr } from "./features/qr/state";
import { TypePicker } from "./features/qr/components/TypePicker";
import { DestinationForm } from "./features/qr/components/DestinationForm";
import { DesignControls } from "./features/qr/components/DesignControls";
import { PreviewPanel } from "./features/qr/components/PreviewPanel";
import { TYPE_META } from "./features/qr/constants";

function Hero() {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-seafoam-600/20 bg-seafoam-50 px-3 py-1 text-xs font-medium text-seafoam-800">
        Free forever. No sign up.
      </span>
      <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
        Create clean, custom QR codes in seconds.
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-navy-500">
        Thirteen code types, full styling control, and instant PNG, SVG, PDF, or
        JPG downloads. Everything runs in your browser, so your content never
        leaves your device.
      </p>
    </section>
  );
}

function Workspace() {
  const { state, dispatch } = useQr();
  const { validation } = usePayload();
  const meta = TYPE_META[state.qrType];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(340px,400px)] lg:items-start">
      <div className="space-y-6">
        <StepCard
          step="Step 1"
          title="Destination"
          question="Where do you want your QR code to direct?"
          id="destination"
        >
          <div className="space-y-6">
            <TypePicker
              value={state.qrType}
              onChange={(qrType) => dispatch({ type: "SET_TYPE", qrType })}
            />
            <div className="border-t border-navy-900/5 pt-6">
              <p className="mb-4 text-sm text-navy-400">{meta.description}</p>
              <DestinationForm type={state.qrType} errors={validation.errors} />
            </div>
          </div>
        </StepCard>

        <StepCard
          step="Step 2"
          title="Design"
          question="What do you want it to look like?"
          id="design"
        >
          <DesignControls />
        </StepCard>

        <div className="lg:hidden">
          <StepCard
            step="Step 3"
            title="Preview and download"
            question="Scan to test, then save your code."
            id="preview-mobile"
          >
            <PreviewPanel />
          </StepCard>
        </div>
      </div>

      <div className="hidden lg:block lg:sticky lg:top-20">
        <Card className="overflow-hidden">
          <div className="horizon-rule" aria-hidden="true" />
          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-seafoam-700">
              Step 3
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-navy-900">
              Preview and download
            </h2>
            <p className="mt-1 text-sm text-navy-500">Scan to test, then save your code.</p>
            <div className="mt-5">
              <PreviewPanel />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MobilePreviewJump() {
  const { ready } = usePayload();
  return (
    <a
      href="#preview-mobile"
      className={
        "fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-3 text-sm font-medium text-white shadow-lift transition-transform hover:scale-[1.03] lg:hidden " +
        (ready ? "" : "pointer-events-none opacity-0")
      }
      aria-hidden={!ready}
      tabIndex={ready ? 0 : -1}
    >
      <ArrowDown className="h-4 w-4" aria-hidden="true" />
      View code
    </a>
  );
}

export default function App() {
  const [legal, setLegal] = useState<LegalPage>(null);

  // Remove the first-paint splash once React has mounted.
  useEffect(() => {
    const splash = document.getElementById("splash");
    if (!splash) return;
    splash.classList.add("splash-out");
    const timer = window.setTimeout(() => splash.remove(), 400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <QrProvider>
        <div id="top" className="min-h-screen">
          <Header onOpenLegal={setLegal} />
          <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
            <Hero />
            <div className="mt-10">
              <Workspace />
            </div>
          </main>
          <Footer onOpenLegal={setLegal} />
          <MobilePreviewJump />
        </div>
        <LegalDialog page={legal} onClose={() => setLegal(null)} />
      </QrProvider>
    </MotionConfig>
  );
}
