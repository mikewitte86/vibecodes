import { ExternalLink } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@/types/tables";
import { Customer } from "@/types/tables";

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: () => <span>COMPANY NAME</span>,
    size: 250,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 truncate block">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "policies",
    header: "ACTIVE POLICIES",
    size: 150,
    cell: ({ row }) => row.getValue("policies"),
  },
  {
    accessorKey: "premium",
    header: "PREMIUM",
    size: 150,
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("premium")}</span>
    ),
  },
  {
    accessorKey: "revenue",
    header: "REVENUE",
    size: 150,
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("revenue")}</span>
    ),
  },
  {
    accessorKey: "hubspot",
    header: "ACTIONS",
    size: 120,
    enableSorting: false,
    cell: ({ row }) => (
      <a
        href={row.original.hubspot}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-medium flex items-center gap-1 hover:underline"
      >
        HubSpot <ExternalLink className="h-4 w-4 inline" />
      </a>
    ),
  },
];

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: () => <span>CUSTOMER NAME</span>,
    size: 250,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 truncate block">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    size: 200,
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "phone",
    header: "PHONE",
    size: 150,
    cell: ({ row }) => row.getValue("phone"),
  },
]; 