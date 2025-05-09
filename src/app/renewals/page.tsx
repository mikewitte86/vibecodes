"use client";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { renewalColumns } from "@/columns/renewals";
import { renewals } from "@/data/renewals";

export default function RenewalsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const filtered = useMemo(
    () =>
      renewals.filter(
        (r) =>
          (status === "All" || r.status === status) &&
          (r.company.toLowerCase().includes(search.toLowerCase()) ||
            r.policyType.toLowerCase().includes(search.toLowerCase())),
    ),
    [search, status],
  );
  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">Next 90 Renewals</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track and manage upcoming policy renewals.
        </p>
      </div>
      <div className="px-4 sm:px-6">
        <DataTable
          columns={renewalColumns}
          data={filtered}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "Search renewals...",
          }}
          filter={{
            value: status,
            onChange: setStatus,
            options: [
              { value: "All", label: "All Statuses" },
              { value: "Not Started", label: "Not Started" },
              { value: "In Progress", label: "In Progress" },
              { value: "Quoted", label: "Quoted" },
            ],
          }}
        />
      </div>
    </div>
  );
}
