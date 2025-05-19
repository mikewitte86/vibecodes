import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserIcon, Clock } from "lucide-react";

export type User = {
  name: string;
  email: string;
  role: string;
  agency: string;
  lastActive: string;
};

const statusColorMap: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-700",
  Pending: "bg-yellow-100 text-yellow-800",
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "NAME",
    size: 260,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center rounded-full bg-gray-100 h-9 w-9">
          <UserIcon className="h-5 w-5 text-gray-400" />
        </span>
        <div>
          <div className="font-medium text-gray-900 leading-tight">
            {row.original.name}
          </div>
          <div className="text-gray-500 text-sm leading-tight">
            {row.original.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "ROLE",
    size: 120,
    cell: ({ row }) => (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
        {row.original.role}
      </span>
    ),
  },
  {
    accessorKey: "agency",
    header: "AGENCY",
    size: 120,
    cell: ({ row }) => (
      <StatusBadge value={row.original.agency} colorMap={statusColorMap} />
    ),
  },
  {
    accessorKey: "lastActive",
    header: "LAST ACTIVE",
    size: 180,
    cell: ({ row }) => (
      <span className="flex items-center gap-2 text-gray-700 text-sm">
        <Clock className="h-4 w-4 text-gray-400" />
        {row.original.lastActive}
      </span>
    ),
  },
];
