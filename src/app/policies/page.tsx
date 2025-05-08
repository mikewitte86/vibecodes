"use client";
import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

const policies = [
  {
    company: "Acme Corporation",
    type: "General Liability",
    status: "Active",
    premium: "$12,500",
    carrier: "Insurance Co",
    effective: "2023-01-01",
    number: "GL-123456",
  },
  {
    company: "TechCorp Industries",
    type: "Professional Liability",
    status: "Active",
    premium: "$8,200",
    carrier: "Tech Insure",
    effective: "2023-03-15",
    number: "PL-789012",
  },
  {
    company: "Global Manufacturing",
    type: "Property",
    status: "Active",
    premium: "$15,750",
    carrier: "Property Guard",
    effective: "2023-02-01",
    number: "PR-345678",
  },
  {
    company: "Stellar Services",
    type: "Workers Comp",
    status: "Pending",
    premium: "$9,300",
    carrier: "Workers First",
    effective: "2023-09-01",
    number: "WC-901234",
  },
  {
    company: "Innovative Solutions",
    type: "Cyber",
    status: "Active",
    premium: "$6,800",
    carrier: "Cyber Shield",
    effective: "2023-06-15",
    number: "CY-567890",
  },
];

type Policy = (typeof policies)[number];

const statusColor: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: "company",
    header: "COMPANY",
    cell: ({ row }: { row: Row<Policy> }) => (
      <span className="font-medium text-gray-900 truncate block">
        {row.getValue("company") as string}
      </span>
    ),
    size: 180,
  },
  {
    accessorKey: "type",
    header: "TYPE",
    cell: ({ row }: { row: Row<Policy> }) => (
      <span className="flex items-center gap-2 font-medium text-gray-800 truncate">
        <FileText className="h-4 w-4 text-blue-500 shrink-0" />
        <span className="truncate">{row.getValue("type") as string}</span>
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }: { row: Row<Policy> }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs max-w-[150px] font-semibold ${statusColor[status] || "bg-gray-100 text-gray-800"}`}
        >
          {status}
        </span>
      );
    },
    size: 100,
  },
  {
    accessorKey: "premium",
    header: "PREMIUM",
    cell: ({ row }: { row: Row<Policy> }) => (
      <span className="font-mono">{row.getValue("premium") as string}</span>
    ),
    size: 100,
  },
  {
    accessorKey: "carrier",
    header: "CARRIER",
    cell: ({ row }: { row: Row<Policy> }) => (
      <span className="truncate max-w-[120px] block">
        {row.getValue("carrier") as string}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: "effective",
    header: "EFFECTIVE DATE",
    cell: ({ row }: { row: Row<Policy> }) =>
      row.getValue("effective") as string,
    size: 130,
  },
  {
    accessorKey: "number",
    header: "POLICY NUMBER",
    cell: ({ row }: { row: Row<Policy> }) => (
      <span className="truncate max-w-[100px] block">
        {row.getValue("number") as string}
      </span>
    ),
    size: 150,
  },
];

export default function PoliciesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(
    () =>
      policies.filter(
        (p) =>
          (status === "All" || p.status === status) &&
          (p.company.toLowerCase().includes(search.toLowerCase()) ||
            p.type.toLowerCase().includes(search.toLowerCase()) ||
            p.number.toLowerCase().includes(search.toLowerCase())),
      ),
    [search, status],
  );

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">Policies</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage all insurance policies
        </p>
      </div>
      <div className="px-4 sm:px-6">
        <DataTable
          columns={columns}
          data={filtered}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "Search policies...",
          }}
          filter={{
            value: status,
            onChange: setStatus,
            options: [
              { value: "All", label: "All Statuses" },
              { value: "Active", label: "Active" },
              { value: "Pending", label: "Pending" },
            ],
          }}
        />
      </div>
    </div>
  );
}
