import monogramUrl from "@/assets/monogram.png";
import { cn } from "@/lib/utils";

interface MonogramProps {
  className?: string;
  decorative?: boolean;
}

/**
 * The supplied monogram mark. To rebrand, overwrite src/assets/monogram.png
 * with a transparent PNG (square, 512 px or larger) and run `npm run icons`
 * to regenerate the favicon and app icons from it.
 */
export function Monogram({ className, decorative }: MonogramProps) {
  return (
    <img
      src={monogramUrl}
      alt={decorative ? "" : "QRHype monogram"}
      aria-hidden={decorative || undefined}
      className={cn("h-8 w-8 object-contain", className)}
      draggable={false}
    />
  );
}
