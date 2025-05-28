import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { TruncatedCell } from "@/components/ui/truncated-cell";

const customerStatusColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
  PENDING: "bg-yellow-100 text-yellow-800",
};

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "tenant_id",
    header: () => <TruncatedCell text="Sub-agency Name" />,
    size: 120,
    cell: ({ row }) => (
      <TruncatedCell text={row.getValue("tenant_id") as string} />
    ),
  },
  {
    accessorKey: "name",
    header: () => <TruncatedCell text="Company Name" />,
    size: 100,
    cell: ({ row }) => <TruncatedCell text={row.getValue("name") as string} />,
  },
  {
    accessorKey: "id",
    header: () => <TruncatedCell text="Company ID" />,
    size: 200,
    cell: ({ row }) => <TruncatedCell text={row.getValue("id") as string} />,
  },
  {
    accessorKey: "status",
    header: () => <TruncatedCell text="Company Status" />,
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <StatusBadge
          value={status}
          color={customerStatusColor[status] || "bg-gray-100 text-gray-700"}
        />
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => <TruncatedCell text="Primary Contact Name" />,
    size: 120,
    cell: ({ row }) => (
      <TruncatedCell text={(row.getValue("phone") as string | null) || "N/A"} />
    ),
  },
  {
    accessorKey: "is_prospect",
    header: () => <TruncatedCell text="Profile Data" />,
    size: 80,
    cell: ({ row }) => {
      const hasProfile = !(row.getValue("is_prospect") as boolean);
      return (
        <span className="whitespace-nowrap">{hasProfile ? "Yes" : "No"}</span>
      );
    },
  },
  {
    accessorKey: "nowcerts_id",
    header: () => <TruncatedCell text="Active Policies" />,
    size: 80,
    cell: ({ row }) => {
      const nowcertsId = row.getValue("nowcerts_id") as string;
      return (
        <span className="whitespace-nowrap font-mono">
          {nowcertsId === "UNKNOWN" ? "0" : nowcertsId}
        </span>
      );
    },
  },
  {
    accessorKey: "hubspot_id",
    header: () => <TruncatedCell text="Total Premium" />,
    size: 100,
    cell: ({ row }) => {
      const hubspotId = row.getValue("hubspot_id") as string;
      return (
        <span className="whitespace-nowrap font-mono">
          {hubspotId ? `$${hubspotId}` : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "broker_buddha_id",
    header: () => <TruncatedCell text="Total Commission" />,
    size: 100,
    cell: ({ row }) => {
      const brokerBuddhaId = row.getValue("broker_buddha_id") as string | null;
      return (
        <span className="whitespace-nowrap font-mono">
          {brokerBuddhaId ? `$${brokerBuddhaId}` : "N/A"}
        </span>
      );
    },
  },
];
