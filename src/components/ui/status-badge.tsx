import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?: string;
  variant?: "default" | "destructive" | "warning" | "success" | "secondary";
  value?: string;
  color?: string;
}

export function StatusBadge({ status, variant = "default", value, color }: StatusBadgeProps) {
  const variantStyles = {
    default: "bg-blue-50 text-blue-700 border border-blue-200",
    destructive: "bg-red-50 text-red-700 border border-red-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    secondary: "bg-gray-50 text-gray-700 border border-gray-200",
  };

  if (value && color) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
          color
        )}
      >
        {value}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        variantStyles[variant]
      )}
    >
      {status}
    </span>
  );
}
