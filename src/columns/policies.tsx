import { StatusBadge } from "@/components/ui/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { Policy } from "@/lib/api";
import { TruncatedCell } from "@/components/ui/truncated-cell";

const policyStatusColor: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-700",
};

export const policyColumns: ColumnDef<Policy>[] = [
  {
    accessorKey: "number",
    header: () => <TruncatedCell text="Policy Number" />,
    size: 100,
    cell: ({ row }) => (
      <TruncatedCell
        text={row.getValue("number") as string}
        className="font-medium"
      />
    ),
  },
  {
    accessorKey: "carrier",
    size: 120,
    header: () => <TruncatedCell text="Carrier" />,
    cell: ({ row }) => (
      <TruncatedCell text={row.getValue("carrier") as string} />
    ),
  },
  {
    accessorKey: "line_of_business",
    size: 100,
    header: () => <TruncatedCell text="Line of Business" />,
    cell: ({ row }) => {
      const lob = row.getValue("line_of_business") as {
        lineOfBusinessName: string;
      }[];
      return <TruncatedCell text={lob?.[0]?.lineOfBusinessName || "N/A"} />;
    },
  },
  {
    accessorKey: "status",
    size: 80,
    header: () => <TruncatedCell text="Status" />,
    cell: ({ row }) => {
      const status = (row.getValue("status") as string).toLowerCase();
      return (
        <StatusBadge
          value={status}
          color={policyStatusColor[status] || "bg-gray-100 text-gray-700"}
        />
      );
    },
  },
  {
    accessorKey: "premium",
    size: 100,
    header: () => <TruncatedCell text="Premium" />,
    cell: ({ row }) => (
      <span className="font-mono whitespace-nowrap">
        ${(row.getValue("premium") as number).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "insured",
    size: 120,
    header: () => <TruncatedCell text="Insured" />,
    cell: ({ row }) => {
      const insured = row.getValue("insured") as { name: string };
      return <TruncatedCell text={insured?.name || "N/A"} />;
    },
  },
  {
    accessorKey: "effective_date",
    size: 100,
    header: () => <TruncatedCell text="Effective Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("effective_date") as string);
      return (
        <span className="whitespace-nowrap">{date.toLocaleDateString()}</span>
      );
    },
  },
  {
    accessorKey: "expiration_date",
    size: 100,
    header: () => <TruncatedCell text="Expiration Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiration_date") as string);
      return (
        <span className="whitespace-nowrap">{date.toLocaleDateString()}</span>
      );
    },
  },
];
