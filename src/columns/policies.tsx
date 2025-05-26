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
    header: () => <TruncatedCell text="Policy Number" maxWidth="max-w-[100px]" />,
    cell: ({ row }) => (
      <TruncatedCell 
        text={row.getValue("number") as string} 
        maxWidth="max-w-[100px]"
        className="font-medium"
      />
    ),
  },
  {
    accessorKey: "carrier",
    header: () => <TruncatedCell text="Carrier" maxWidth="max-w-[120px]" />,
    cell: ({ row }) => (
      <TruncatedCell 
        text={row.getValue("carrier") as string} 
        maxWidth="max-w-[120px]"
      />
    ),
  },
  {
    accessorKey: "line_of_business",
    header: () => <TruncatedCell text="Line of Business" maxWidth="max-w-[100px]" />,
    cell: ({ row }) => {
      const lob = row.getValue("line_of_business") as { lineOfBusinessName: string }[];
      return (
        <TruncatedCell 
          text={lob?.[0]?.lineOfBusinessName || "N/A"} 
          maxWidth="max-w-[100px]"
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <TruncatedCell text="Status" maxWidth="max-w-[80px]" />,
    cell: ({ row }) => {
      const status = (row.getValue("status") as string).toLowerCase();
      return <StatusBadge value={status} color={policyStatusColor[status] || "bg-gray-100 text-gray-700"} />;
    },
  },
  {
    accessorKey: "premium",
    header: () => <TruncatedCell text="Premium" maxWidth="max-w-[100px]" />,
    cell: ({ row }) => (
      <span className="font-mono whitespace-nowrap">${(row.getValue("premium") as number).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "insured",
    header: () => <TruncatedCell text="Insured" maxWidth="max-w-[120px]" />,
    cell: ({ row }) => {
      const insured = row.getValue("insured") as { name: string };
      return (
        <TruncatedCell 
          text={insured?.name || "N/A"} 
          maxWidth="max-w-[120px]"
        />
      );
    },
  },
  {
    accessorKey: "effective_date",
    header: () => <TruncatedCell text="Effective Date" maxWidth="max-w-[100px]" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("effective_date") as string);
      return <span className="whitespace-nowrap">{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "expiration_date",
    header: () => <TruncatedCell text="Expiration Date" maxWidth="max-w-[100px]" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiration_date") as string);
      return <span className="whitespace-nowrap">{date.toLocaleDateString()}</span>;
    },
  },
]; 