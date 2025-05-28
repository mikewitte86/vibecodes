import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { USER_ROLES_TYPES, USER_STATUS } from "@/enums";
import { TruncatedCell } from "@/components/ui/truncated-cell";

const roleLabels: Record<string, string> = {
  [USER_ROLES_TYPES.SUPER_ADMIN]: "Super Admin",
  [USER_ROLES_TYPES.AGENCY_ADMIN]: "Agency Admin",
};

const statusLabels: Record<string, string> = {
  [USER_STATUS.CONFIRMED]: "Confirmed",
  [USER_STATUS.PENDING]: "Pending",
  [USER_STATUS.DISABLED]: "Disabled",
  [USER_STATUS.FORCE_CHANGE_PASSWORD]: "Force Change Password",
};

const roleColors: Record<string, string> = {
  [USER_ROLES_TYPES.SUPER_ADMIN]: "bg-purple-100 text-purple-700",
  [USER_ROLES_TYPES.AGENCY_ADMIN]: "bg-blue-100 text-blue-700",
};

const statusColors: Record<string, string> = {
  [USER_STATUS.CONFIRMED]: "bg-green-100 text-green-700",
  [USER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [USER_STATUS.DISABLED]: "bg-gray-100 text-gray-700",
  [USER_STATUS.FORCE_CHANGE_PASSWORD]: "bg-orange-100 text-orange-700",
};

const agencyLabels: Record<string, string> = {
  equalparts: "Equal Parts",
  lumen: "Lumen",
  assurely: "Assurely",
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => <TruncatedCell text="Name" />,
    cell: ({ row }) => (
      <TruncatedCell
        text={row.getValue("name") as string}
        className="font-medium"
      />
    ),
  },
  {
    accessorKey: "email",
    header: () => <TruncatedCell text="Email" />,
    cell: ({ row }) => <TruncatedCell text={row.getValue("email") as string} />,
  },
  {
    accessorKey: "user_role",
    header: () => <TruncatedCell text="Role" />,
    cell: ({ row }) => {
      const role = row.getValue("user_role") as string;
      return (
        <StatusBadge
          value={roleLabels[role] || role}
          color={roleColors[role] || "bg-gray-100 text-gray-700"}
        />
      );
    },
  },
  {
    accessorKey: "agency_id",
    header: () => <TruncatedCell text="Agency" />,
    cell: ({ row }) => {
      const agency = row.getValue("agency_id") as string;
      return (
        <TruncatedCell text={agencyLabels[agency.toLowerCase()] || agency} />
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <TruncatedCell text="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <StatusBadge
          value={statusLabels[status] || status}
          color={statusColors[status] || "bg-gray-100 text-gray-700"}
        />
      );
    },
  },
  {
    accessorKey: "last_modified",
    header: () => <TruncatedCell text="Last Modified" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("last_modified") as string);
      return (
        <span className="whitespace-nowrap">{date.toLocaleDateString()}</span>
      );
    },
  },
];
