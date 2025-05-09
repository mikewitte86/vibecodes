import { StatusBadge } from "@/components/ui/status-badge";
import { renewalStatusColor } from "@/constants/statusColors";
import { ColumnDef } from "@tanstack/react-table";
import { Renewal } from "@/types/tables";

export const renewalColumns: ColumnDef<Renewal>[] = [
  { accessorKey: "company", header: "COMPANY", size: 200 },
  { accessorKey: "policyType", header: "POLICY TYPE", size: 180 },
  {
    accessorKey: "expiration",
    header: "EXPIRATION DATE",
    size: 140,
    cell: ({ row }) => row.getValue("expiration") as string,
  },
  { accessorKey: "premium", header: "PREMIUM", size: 120 },
  {
    accessorKey: "status",
    header: "STATUS",
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge value={status} colorMap={renewalStatusColor} />;
    },
  },
  {
    accessorKey: "days",
    header: "DAYS UNTIL",
    size: 100,
    cell: ({ row }) => {
      const value = row.getValue("days") as string;
      const days = parseInt(value);
      return <span className={days <= 30 ? "text-red-600" : ""}>{value}</span>;
    },
  },
]; 