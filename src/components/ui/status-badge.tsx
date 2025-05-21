import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  value: string;
  color: string;
}

export function StatusBadge({ value, color }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        color,
      )}
    >
      {value}
    </span>
  );
}
