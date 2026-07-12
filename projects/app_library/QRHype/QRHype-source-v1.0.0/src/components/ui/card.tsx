import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-navy-900/10 bg-white/90 shadow-card backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

interface StepCardProps {
  step: string;
  title: string;
  question?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

/** A step card: horizon rule, wide-tracked step label, title, question. */
export function StepCard({ step, title, question, children, className, id }: StepCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} id={id}>
      <div className="horizon-rule" aria-hidden="true" />
      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-seafoam-700">
          {step}
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-navy-900">{title}</h2>
        {question ? <p className="mt-1 text-sm text-navy-500">{question}</p> : null}
        <div className="mt-5">{children}</div>
      </div>
    </Card>
  );
}
