import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionItem({ title, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();
  return (
    <div className="border-b border-navy-900/10 last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafoam-500/50"
        >
          <span className="text-sm font-semibold text-navy-800">{title}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-navy-400 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
      {open ? (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-5 pt-1">
          {children}
        </div>
      ) : null}
    </div>
  );
}
