import { ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { invoiceStatusColor } from "@/constants/statusColors";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/types/tables";

export const invoiceColumns: ColumnDef<Invoice>[] = [
  { accessorKey: "id", header: "INVOICE ID", size: 120 },
  { accessorKey: "company", header: "COMPANY", size: 200 },
  { accessorKey: "amount", header: "AMOUNT", size: 120 },
  {
    accessorKey: "issue",
    header: "ISSUE DATE",
    size: 120,
    cell: ({ row }) => row.getValue("issue") as string,
  },
  {
    accessorKey: "due",
    header: "DUE DATE",
    size: 120,
    cell: ({ row }) => row.getValue("due") as string,
  },
  {
    accessorKey: "status",
    header: "STATUS",
    size: 90,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge value={status} colorMap={invoiceStatusColor} />;
    },
  },
  {
    accessorKey: "days",
    header: "DAYS OUTSTANDING",
    size: 140,
    cell: ({ row }) => {
      const value = row.getValue("days") as string;
      const status = row.getValue("status") as string;
      const isOverdue = status === "Overdue";
      return <span className={isOverdue ? "text-red-600" : ""}>{value}</span>;
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    size: 150,
    cell: () => (
      <a
        href="#"
        className="text-blue-600 font-medium flex items-center gap-1 hover:underline"
      >
        View in Ascend <ExternalLink className="h-4 w-4 inline" />
      </a>
    ),
  },
]; 