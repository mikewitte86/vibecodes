import { User } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { businessStageColor } from "@/constants/statusColors";
import { ColumnDef } from "@tanstack/react-table";
import { Deal } from "@/types/tables";

export const newBusinessColumns: ColumnDef<Deal>[] = [
  { accessorKey: "company", header: "COMPANY", size: 200 },
  {
    accessorKey: "contact",
    header: "CONTACT",
    size: 160,
    cell: ({ row }) => {
      const value = row.getValue("contact") as string;
      return (
        <span className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "stage",
    header: "STAGE",
    size: 100,
    cell: ({ row }) => {
      const stage = row.getValue("stage") as string;
      return <StatusBadge value={stage} colorMap={businessStageColor} />;
    },
  },
  { accessorKey: "value", header: "VALUE", size: 120 },
  { accessorKey: "source", header: "SOURCE", size: 120 },
  {
    accessorKey: "created",
    header: "CREATED DATE",
    size: 120,
    cell: ({ row }) => row.getValue("created") as string,
  },
  {
    accessorKey: "last",
    header: "LAST ACTIVITY",
    size: 120,
    cell: ({ row }) => row.getValue("last") as string,
  },
]; 