import { MonitorDown } from "lucide-react";
import { Monogram } from "@/components/brand/Monogram";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/lib/hooks";
import type { LegalPage } from "./legal";

interface HeaderProps {
  onOpenLegal: (page: LegalPage) => void;
}

export function Header({ onOpenLegal }: HeaderProps) {
  const { canInstall, install } = useInstallPrompt();

  return (
    <header className="sticky top-0 z-40 border-b border-navy-900/5 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafoam-500/50">
          <Monogram />
          <span className="text-base font-semibold tracking-tight text-navy-900">QRHype</span>
        </a>
        <nav aria-label="Site" className="flex items-center gap-1">
          {canInstall ? (
            <Button variant="secondary" size="sm" onClick={install} className="mr-1 hidden sm:inline-flex">
              <MonitorDown className="h-4 w-4" aria-hidden="true" />
              Install app
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" onClick={() => onOpenLegal("privacy")}>
            Privacy
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenLegal("terms")}>
            Terms
          </Button>
        </nav>
      </div>
    </header>
  );
}
