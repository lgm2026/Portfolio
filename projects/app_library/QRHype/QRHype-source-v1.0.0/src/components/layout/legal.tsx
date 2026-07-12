import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/lib/toast";
import { downloadOfflineApp } from "@/features/offline";

export type LegalPage = "privacy" | "terms" | null;

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-navy-900">{heading}</h3>
      <div className="mt-1 space-y-2 text-sm leading-relaxed text-navy-600">{children}</div>
    </div>
  );
}

function OfflineDownloadButton() {
  const { push } = useToast();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await downloadOfflineApp();
      push("success", "Saved a self-contained copy. Open it any time, even offline.");
    } catch (error) {
      push("error", error instanceof Error ? error.message : "Could not save the offline copy.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="mt-1 inline-flex items-center gap-2 rounded-lg border border-seafoam-600/25 bg-seafoam-50 px-3 py-2 text-sm font-medium text-seafoam-800 transition-colors hover:bg-seafoam-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafoam-500/50 disabled:opacity-60"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-4 w-4" aria-hidden="true" />
      )}
      Download QRHype for offline use
    </button>
  );
}

interface LegalDialogProps {
  page: LegalPage;
  onClose: () => void;
}

export function LegalDialog({ page, onClose }: LegalDialogProps) {
  return (
    <>
      <Dialog open={page === "privacy"} title="Privacy" onClose={onClose}>
        <p>
          QRHype is built to respect your privacy completely. The app runs
          entirely in your browser.
        </p>
        <Section heading="What we collect">
          <p>
            Nothing. There are no accounts, no analytics, no cookies for
            tracking, and no advertising. We do not have a server that receives
            your content, so there is nothing for us to see or store.
          </p>
        </Section>
        <Section heading="Your content stays local">
          <p>
            The text, links, and details you enter are used only in your browser
            to generate the code you see. When you close the tab, that
            information is gone.
          </p>
        </Section>
        <Section heading="Logo uploads">
          <p>
            Any logo you add is read and processed on your own device. It is
            never uploaded, transmitted, or saved anywhere outside your browser.
          </p>
        </Section>
        <Section heading="Offline use">
          <p>
            QRHype can be installed and used offline. Because everything runs on
            your device, no network connection is needed to create or download a
            code.
          </p>
          <p>
            You can also save the whole app as a single file and open it later
            with no internet at all.
          </p>
          <OfflineDownloadButton />
        </Section>
      </Dialog>

      <Dialog open={page === "terms"} title="Terms and disclaimer" onClose={onClose}>
        <Section heading="Free to use">
          <p>
            QRHype is provided free of charge for personal and commercial use.
            The QR codes you generate are yours to use however you like.
          </p>
        </Section>
        <Section heading="Provided as is">
          <p>
            The tool is offered without warranties of any kind. While QRHype
            works to produce accurate, scannable codes, you are responsible for
            testing each code before you print, share, or publish it.
          </p>
        </Section>
        <Section heading="Test before you print">
          <p>
            Scanning can be affected by size, contrast, print quality, logos,
            and the surface a code is placed on. Always scan your final code with
            more than one device before committing it to print or distribution.
          </p>
        </Section>
        <Section heading="Trademark">
          <p>
            QR Code is a registered trademark of Denso Wave Incorporated. QRHype
            is an independent tool and is not affiliated with or endorsed by
            Denso Wave.
          </p>
        </Section>
        <Section heading="Limitation of liability">
          <p>
            QRHype and its makers are not liable for any loss or damage arising
            from the use of codes generated with this tool. Use of the app
            constitutes acceptance of these terms.
          </p>
        </Section>
      </Dialog>
    </>
  );
}
