import React from "react";

interface StatusBadgeProps {
  value: string;
  colorMap: Record<string, string>;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ value, colorMap, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${colorMap[value] || "bg-gray-100 text-gray-800"} ${className}`}
  >
    {value}
  </span>
); 