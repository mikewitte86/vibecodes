"use client";

import {
  Users,
  FileText,
  RefreshCw,
  DollarSign,
  Clock,
  CheckCircle,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusCard } from "@/components/dashboard/status-card";
import { ActivityCard } from "@/components/dashboard/activity-card";

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
    <div className="space-y-8 pb-8">
      <div className="px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your agency&apos;s key metrics and performance.
        </p>
      </div>
      <div className="px-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <MetricCard key={i} {...m} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusCard
            title="Renewal Status"
            icon={<RefreshCw className="h-5 w-5 text-blue-600" />}
            items={renewalStatus}
          />
          <StatusCard
            title="Invoice Status"
            icon={<DollarSign className="h-5 w-5 text-blue-600" />}
            items={invoiceStatus}
          />
        </div>
        <ActivityCard
          title="Recent Activity"
          icon={<FileText className="h-5 w-5 text-blue-600" />}
          items={recentActivity}
        />
      </div>
    </div>
  );
}
