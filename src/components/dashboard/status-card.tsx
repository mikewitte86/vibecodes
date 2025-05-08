import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";

export interface StatusCardProps {
  title: string;
  icon: React.ReactNode;
  items: {
    label: string;
    value: string | number;
    sub: string;
    icon: React.ReactNode;
  }[];
}

export const StatusCard = memo(function StatusCard({ title, icon, items }: StatusCardProps) {
  return (
    <Card className="shadow rounded-xl border border-gray-200 bg-white">
      <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-6 py-4 flex flex-row items-center gap-2">
        {icon}
        <CardTitle className="text-base font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500">{item.sub}</div>
                </div>
              </div>
              <div className="font-semibold text-gray-700 text-base">
                {item.value}
              </div>
            </div>
            {i < items.length - 1 && <hr className="mt-3 border-gray-200" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}); 