import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { memo } from "react";

export interface ActivityCardProps {
  title: string;
  icon: React.ReactNode;
  items: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    time: string;
    user: string;
    userIcon: React.ReactNode;
  }[];
}

export const ActivityCard = memo(function ActivityCard({ title, icon, items }: ActivityCardProps) {
  return (
    <Card className="shadow rounded-xl border border-gray-200 bg-white">
      <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-6 py-4 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base font-semibold text-gray-800">
            {title}
          </CardTitle>
        </div>
        <div className="text-right">
          <Link
            href="/"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            See More &rarr;
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((activity, i) => (
          <div key={i}>
            <div className="flex items-start gap-4">
              <div className="mt-1">{activity.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">
                  {activity.title}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {activity.desc}
                </div>
                <div className="flex items-center text-xs text-gray-400 gap-2">
                  <span>{activity.time}</span>
                  <span className="flex items-center gap-1">
                    {activity.userIcon}
                    {activity.user}
                  </span>
                </div>
              </div>
            </div>
            {i < items.length - 1 && <hr className="mt-4 border-gray-200" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}); 