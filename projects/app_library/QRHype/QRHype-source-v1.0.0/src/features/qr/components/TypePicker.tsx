import {
  AppWindow,
  AtSign,
  CalendarDays,
  Contact,
  FileCode2,
  Link2,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Share2,
  Type,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { TYPE_META, TYPE_ORDER } from "../constants";
import type { QrType } from "../types";
import { cn } from "@/lib/utils";

const ICONS: Record<QrType, LucideIcon> = {
  url: Link2,
  text: Type,
  email: AtSign,
  phone: Phone,
  sms: MessageSquare,
  wifi: Wifi,
  vcard: Contact,
  whatsapp: MessageCircle,
  location: MapPin,
  event: CalendarDays,
  applink: AppWindow,
  social: Share2,
  custom: FileCode2,
};

interface TypePickerProps {
  value: QrType;
  onChange: (type: QrType) => void;
}

export function TypePicker({ value, onChange }: TypePickerProps) {
  return (
    <fieldset>
      <legend className="sr-only">QR code type</legend>
      <div
        role="radiogroup"
        aria-label="QR code type"
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        {TYPE_ORDER.map((type) => {
          const Icon = ICONS[type];
          const meta = TYPE_META[type];
          const active = type === value;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(type)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafoam-500/50",
                active
                  ? "border-seafoam-500 bg-seafoam-50 text-navy-900"
                  : "border-navy-900/10 bg-white text-navy-600 hover:border-navy-900/20 hover:bg-navy-50/60",
              )}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", active ? "text-seafoam-700" : "text-navy-400")}
                aria-hidden="true"
              />
              <span className="text-sm font-medium leading-tight">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
