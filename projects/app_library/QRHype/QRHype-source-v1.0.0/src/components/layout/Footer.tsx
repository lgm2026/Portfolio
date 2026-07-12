import { Monogram } from "@/components/brand/Monogram";
import type { LegalPage } from "./legal";

interface FooterProps {
  onOpenLegal: (page: LegalPage) => void;
}

export function Footer({ onOpenLegal }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-navy-900/5 bg-white/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div className="max-w-md">
            <p className="text-sm font-semibold text-navy-900">QRHype</p>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-500">
              Runs entirely in your browser. No login, no tracking, no stored
              data. Uploaded logos never leave your device.
            </p>
          </div>
          <nav aria-label="Legal" className="flex gap-5 text-sm">
            <button
              type="button"
              onClick={() => onOpenLegal("privacy")}
              className="text-navy-600 underline-offset-4 hover:text-navy-900 hover:underline"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal("terms")}
              className="text-navy-600 underline-offset-4 hover:text-navy-900 hover:underline"
            >
              Terms and disclaimer
            </button>
          </nav>
        </div>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Monogram decorative className="h-10 w-10 opacity-25 grayscale" />
          <p className="text-xs text-navy-400">
            © {new Date().getFullYear()} QRHype. All rights reserved. Version 1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
