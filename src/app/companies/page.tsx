"use client";

import { ExternalLink } from "lucide-react";
import {
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import * as React from "react";

const companies = [
  {
    name: "Acme Corporation",
    policies: 3,
    premium: "$24,500",
    revenue: "$4,900",
    hubspot: "#",
  },
  {
    name: "Dynamic Designs",
    policies: 1,
    premium: "$12,400",
    revenue: "$2,480",
    hubspot: "#",
  },
  {
    name: "Elite Enterprises",
    policies: 3,
    premium: "$27,500",
    revenue: "$5,500",
    hubspot: "#",
  },
  {
    name: "Global Manufacturing",
    policies: 5,
    premium: "$56,200",
    revenue: "$11,240",
    hubspot: "#",
  },
  {
    name: "Innovative Solutions",
    policies: 4,
    premium: "$32,100",
    revenue: "$6,420",
    hubspot: "#",
  },
  {
    name: "Premier Products",
    policies: 2,
    premium: "$19,800",
    revenue: "$3,960",
    hubspot: "#",
  },
  {
    name: "Stellar Services",
    policies: 1,
    premium: "$8,300",
    revenue: "$1,660",
    hubspot: "#",
  },
  {
    name: "TechCorp Industries",
    policies: 2,
    premium: "$18,750",
    revenue: "$3,750",
    hubspot: "#",
  },
];

type Company = (typeof companies)[number];

const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: () => <span>COMPANY NAME</span>,
    cell: ({ row }: { row: Row<Company> }) => (
      <span className="font-medium text-gray-900 truncate block">
        {row.getValue("name")}
      </span>
    ),
    size: 250,
  },
  {
    accessorKey: "policies",
    header: "ACTIVE POLICIES",
    cell: ({ row }: { row: Row<Company> }) => row.getValue("policies"),
    size: 150,
  },
  {
    accessorKey: "premium",
    header: "PREMIUM",
    cell: ({ row }: { row: Row<Company> }) => (
      <span className="font-mono">{row.getValue("premium")}</span>
    ),
    size: 150,
  },
  {
    accessorKey: "revenue",
    header: "REVENUE",
    cell: ({ row }: { row: Row<Company> }) => (
      <span className="font-mono">{row.getValue("revenue")}</span>
    ),
    size: 150,
  },
  {
    accessorKey: "hubspot",
    header: "ACTIONS",
    cell: ({ row }: { row: Row<Company> }) => (
      <a
        href={row.original.hubspot}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-medium flex items-center gap-1 hover:underline"
      >
        HubSpot <ExternalLink className="h-4 w-4 inline" />
      </a>
    ),
    size: 120,
    enableSorting: false,
  },
];

export default function CompaniesPage() {
  const [search, setSearch] = React.useState("");

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">Companies</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage all client companies.
        </p>
      </div>
      <div className="px-4 sm:px-6">
        <DataTable
          columns={columns}
          data={companies}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "Search companies...",
          }}
        />
      </div>
    </div>
  );
}
