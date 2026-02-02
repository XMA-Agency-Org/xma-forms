import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "bg-card rounded-[var(--radius-xl)] border border-border p-6 shadow-sm",
        className
      )}
    >
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
