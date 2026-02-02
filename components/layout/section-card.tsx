import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div className={cn("rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}
