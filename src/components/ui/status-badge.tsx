import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?: string;
  variant?: "default" | "destructive" | "warning" | "success" | "secondary";
  value?: string;
  color?: string;
}

export function StatusBadge({ status, variant = "default", value, color }: StatusBadgeProps) {
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    secondary: "bg-gray-100 text-gray-800",
  };

  if (value && color) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
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
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        variantStyles[variant]
      )}
    >
      {status}
    </span>
  );
}
