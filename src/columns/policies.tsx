import { StatusBadge } from "@/components/ui/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { Policy } from "@/lib/api";

const policyStatusColor: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-700",
};

export const policyColumns: ColumnDef<Policy>[] = [
  {
    accessorKey: "number",
    header: "Policy Number",
    cell: ({ row }) => (
      <span className="truncate max-w-[100px] block font-medium">{row.getValue("number") as string}</span>
    ),
  },
  {
    accessorKey: "carrier",
    header: "Carrier",
    cell: ({ row }) => (
      <span className="truncate max-w-[120px] block">{row.getValue("carrier") as string}</span>
    ),
  },
  {
    accessorKey: "line_of_business",
    header: "Line of Business",
    cell: ({ row }) => {
      const lob = row.getValue("line_of_business") as { lineOfBusinessName: string }[];
      return (
        <span className="truncate max-w-[100px] block">
          {lob?.[0]?.lineOfBusinessName || "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string).toLowerCase();
      return <StatusBadge value={status} color={policyStatusColor[status] || "bg-gray-100 text-gray-700"} />;
    },
  },
  {
    accessorKey: "premium",
    header: "Premium",
    cell: ({ row }) => (
      <span className="font-mono whitespace-nowrap">${(row.getValue("premium") as number).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "insured",
    header: "Insured",
    cell: ({ row }) => {
      const insured = row.getValue("insured") as { name: string };
      return <span className="truncate max-w-[120px] block">{insured?.name || "N/A"}</span>;
    },
  },
  {
    accessorKey: "effective_date",
    header: "Effective Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("effective_date") as string);
      return <span className="whitespace-nowrap">{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "expiration_date",
    header: "Expiration Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiration_date") as string);
      return <span className="whitespace-nowrap">{date.toLocaleDateString()}</span>;
    },
  },
]; 