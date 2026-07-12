import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { CheckItem, CheckStatus } from "../scanability";
import { cn } from "@/lib/utils";

const ICONS: Record<CheckStatus, typeof CheckCircle2> = {
  pass: CheckCircle2,
  warn: AlertTriangle,
  fail: XCircle,
};

const TONES: Record<CheckStatus, string> = {
  pass: "text-seafoam-600",
  warn: "text-amber-500",
  fail: "text-rose-500",
};

export function ScanabilityList({ items }: { items: CheckItem[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-navy-400">
        Scanability
      </p>
      <ul className="space-y-2">
        {items.map((item) => {
          const Icon = ICONS[item.status];
          return (
            <li key={item.id} className="flex items-start gap-2.5">
              <Icon
                className={cn("mt-0.5 h-4 w-4 shrink-0", TONES[item.status])}
                aria-hidden="true"
              />
              <div>
                <p className="text-sm leading-snug text-navy-700">{item.label}</p>
                {item.detail ? (
                  <p className="mt-0.5 text-xs leading-snug text-navy-400">{item.detail}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
