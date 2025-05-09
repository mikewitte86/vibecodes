"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { companyColumns } from "@/columns/companies";
import { companies } from "@/data/companies";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
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
          columns={companyColumns}
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
