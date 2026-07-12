import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafoam-500/50 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
    "disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-seafoam-600 text-white hover:bg-seafoam-700 active:bg-seafoam-800 shadow-sm",
        secondary:
          "border border-navy-900/15 bg-white text-navy-800 hover:bg-navy-50 active:bg-navy-100",
        ghost: "text-navy-700 hover:bg-navy-900/5 active:bg-navy-900/10",
        danger: "text-rose-700 hover:bg-rose-50 active:bg-rose-100",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
