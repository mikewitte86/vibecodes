"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  FileText,
  RefreshCw,
  DollarSign,
  Clock,
  CheckCircle,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function Home() {
  const metrics = [
    {
      title: "Total Premium",
      value: "$1.2M",
      icon: <DollarSign className="h-6 w-6 text-blue-600" />,
      trend: { value: "+12%", positive: true, text: "from last period" },
    },
    {
      title: "Active Clients",
      value: "124",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      trend: { value: "+8%", positive: true, text: "from last period" },
    },
    {
      title: "Active Policies",
      value: "256",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      trend: { value: "+5%", positive: true, text: "from last period" },
    },
    {
      title: "Pending Renewals",
      value: "18",
      icon: <RefreshCw className="h-6 w-6 text-blue-600" />,
      trend: { value: "2 due this week", positive: false, text: "" },
    },
  ];

  const renewalStatus = [
    {
      label: "Total Renewals",
      value: 32,
      sub: "Next 90 days",
      icon: <RefreshCw className="h-4 w-4 text-blue-600" />,
    },
    {
      label: "Not Started",
      value: 15,
      sub: "Need attention",
      icon: <Clock className="h-4 w-4 text-gray-400" />,
    },
    {
      label: "In Progress",
      value: 12,
      sub: "Being processed",
      icon: <RefreshCw className="h-4 w-4 text-blue-400" />,
    },
    {
      label: "Total Premium",
      value: "$450K",
      sub: "Renewable premium",
      icon: <DollarSign className="h-4 w-4 text-blue-600" />,
    },
  ];

  const invoiceStatus = [
    {
      label: "Outstanding Amount",
      value: "$110.5K",
      sub: "Total unpaid",
      icon: <DollarSign className="h-4 w-4 text-blue-600" />,
    },
    {
      label: "Overdue Invoices",
      value: 5,
      sub: "Need attention",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    },
    {
      label: "Pending Invoices",
      value: 12,
      sub: "Awaiting payment",
      icon: <Clock className="h-4 w-4 text-gray-400" />,
    },
    {
      label: "Paid This Month",
      value: "$245K",
      sub: "Monthly total",
      icon: <CheckCircle className="h-4 w-4 text-blue-600" />,
    },
  ];

  const recentActivity = [
    {
      icon: <FileText className="h-5 w-5 text-green-500" />,
      title: "New policy created for Acme Inc.",
      desc: "General Liability Policy – $1.2M coverage",
      time: "2 hours ago",
      user: "Jane Smith",
      userIcon: <Users className="h-4 w-4 inline mr-1 text-gray-400" />,
    },
    {
      icon: <UserPlus className="h-5 w-5 text-blue-500" />,
      title: "New contact added: John Doe",
      desc: "Primary Contact – TechCorp",
      time: "Yesterday",
      user: "Mike Johnson",
      userIcon: <Users className="h-4 w-4 inline mr-1 text-gray-400" />,
    },
    {
      icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
      title: "Renewal alert: Global Industries",
      desc: "Policy expiring in 30 days – $56,200 premium",
      time: "2 days ago",
      user: "System",
      userIcon: <RefreshCw className="h-4 w-4 inline mr-1 text-gray-400" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your agency's key metrics and performance.
        </p>
      </div>
      <div className="px-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <Card
              key={i}
              className="shadow-md rounded-xl border border-gray-200 bg-white"
            >
              <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-6 py-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">{m.icon}</div>
                <div className="text-right">
                  <CardTitle className="text-sm font-semibold text-gray-700">
                    {m.title}
                  </CardTitle>
                  <div className="text-2xl font-bold text-gray-900">
                    {m.value}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {m.trend && (
                  <div
                    className={twMerge(
                      "flex items-center text-sm font-medium",
                      m.trend.positive ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {m.trend.positive ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {m.trend.value}
                    {m.trend.text && (
                      <span className="ml-1 text-gray-500 font-normal">
                        {m.trend.text}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow rounded-xl border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-6 py-4 flex flex-row items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-semibold text-gray-800">
                Renewal Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {renewalStatus.map((item, i) => (
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
                  {i < renewalStatus.length - 1 && (
                    <hr className="mt-3 border-gray-200" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow rounded-xl border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-6 py-4 flex flex-row items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-semibold text-gray-800">
                Invoice Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoiceStatus.map((item, i) => (
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
                  {i < invoiceStatus.length - 1 && (
                    <hr className="mt-3 border-gray-200" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <Card className="shadow rounded-xl border border-gray-200 bg-white">
          <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-6 py-4 flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-semibold text-gray-800">
                Recent Activity
              </CardTitle>
            </div>
            <div className="text-right">
              <a
                href="/"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                See More &rarr;
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, i) => (
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
                {i < recentActivity.length - 1 && (
                  <hr className="mt-4 border-gray-200" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
