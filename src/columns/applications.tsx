import { ColumnDef } from "@tanstack/react-table";
import { TruncatedCell } from "@/components/ui/truncated-cell";
import { StatusBadge } from "@/components/ui/status-badge";

export interface Application {
  id: string;
  subAgencyName: string;
  clientName: string;
  applicationLob: string;
  type: string;
  primaryContact: string;
}

const typeColor: Record<string, string> = {
  "New Business": "bg-green-100 text-green-800",
  Renewal: "bg-blue-100 text-blue-800",
  "BOR Change": "bg-purple-100 text-purple-800",
};

export const applicationColumns: ColumnDef<Application, unknown>[] = [
  {
    accessorKey: "subAgencyName",
    header: () => <TruncatedCell text="Sub-Agency Name" />,
    cell: ({ row }) => (
      <TruncatedCell text={row.getValue("subAgencyName") as string} />
    ),
  },
  {
    accessorKey: "clientName",
    header: () => <TruncatedCell text="Client Name" />,
    cell: ({ row }) => (
      <TruncatedCell text={row.getValue("clientName") as string} />
    ),
  },
  {
    accessorKey: "applicationLob",
    header: () => <TruncatedCell text="Application LOB" />,
    cell: ({ row }) => (
      <TruncatedCell text={row.getValue("applicationLob") as string} />
    ),
  },
  {
    accessorKey: "type",
    header: () => <TruncatedCell text="Type" />,
    cell: ({ row }) => {
      const value = row.getValue("type") as string;
      return (
        <StatusBadge
          value={value}
          color={typeColor[value] || "bg-gray-100 text-gray-700"}
        />
      );
    },
  },
  {
    accessorKey: "primaryContact",
    header: () => <TruncatedCell text="Primary Contact" />,
    cell: ({ row }) => (
      <TruncatedCell text={row.getValue("primaryContact") as string} />
    ),
  },
];
