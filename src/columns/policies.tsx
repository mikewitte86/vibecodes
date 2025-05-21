import { FileText } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { Policy } from "@/types/tables";

const policyStatusColor: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

export const policyColumns: ColumnDef<Policy>[] = [
  {
    accessorKey: "company",
    header: "COMPANY",
    size: 180,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 truncate block">
        {row.getValue("company") as string}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "TYPE",
    size: 160,
    cell: ({ row }) => (
      <span className="flex items-center gap-2 font-medium text-gray-800 truncate">
        <FileText className="h-4 w-4 text-blue-500 shrink-0" />
        <span className="truncate">{row.getValue("type") as string}</span>
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge value={status} color={(policyStatusColor as Record<string, string>)[status] || "bg-gray-100 text-gray-700"} />;
    },
  },
  {
    accessorKey: "premium",
    header: "PREMIUM",
    size: 100,
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("premium") as string}</span>
    ),
  },
  {
    accessorKey: "carrier",
    header: "CARRIER",
    size: 120,
    cell: ({ row }) => (
      <span className="truncate max-w-[120px] block">{row.getValue("carrier") as string}</span>
    ),
  },
  {
    accessorKey: "effective",
    header: "EFFECTIVE DATE",
    size: 130,
    cell: ({ row }) => row.getValue("effective") as string,
  },
  {
    accessorKey: "number",
    header: "POLICY NUMBER",
    size: 150,
    cell: ({ row }) => (
      <span className="truncate max-w-[100px] block">{row.getValue("number") as string}</span>
    ),
  },
]; 