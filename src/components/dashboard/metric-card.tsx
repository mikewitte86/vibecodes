import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

export interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
    text?: string;
  };
}

export const MetricCard = memo(function MetricCard({
  title,
  value,
  icon,
  trend,
}: MetricCardProps) {
  return (
    <Card className="shadow-md rounded-xl border border-gray-200 bg-white">
      <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-6 py-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">{icon}</div>
        <div className="text-right">
          <CardTitle className="text-sm font-semibold text-gray-700">
            {title}
          </CardTitle>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {trend && (
          <div
            className={cn(
              "flex items-center text-sm font-medium",
              trend.positive ? "text-green-600" : "text-red-600",
            )}
          >
            {trend.positive ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {trend.value}
            {trend.text && (
              <span className="ml-1 text-gray-500 font-normal">
                {trend.text}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}); 