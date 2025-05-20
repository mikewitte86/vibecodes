"use client";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { invoiceColumns } from "@/columns/invoices";
import { invoices } from "@/data/invoices";

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const filtered = useMemo(
    () =>
      invoices.filter(
        (i) =>
          (status === "All" || i.status === status) &&
          (i.company.toLowerCase().includes(search.toLowerCase()) ||
            i.id.toLowerCase().includes(search.toLowerCase())),
      ),
    [search, status],
  );

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and track invoice status
        </p>
      </div>
      <div className="px-4 sm:px-6">
        <DataTable
          columns={invoiceColumns}
          data={filtered}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "Search invoices...",
          }}
          filter={{
            value: status,
            onChange: setStatus,
            options: [
              { value: "All", label: "All Statuses" },
              { value: "Paid", label: "Paid" },
              { value: "Pending", label: "Pending" },
              { value: "Overdue", label: "Overdue" },
            ],
          }}
        />
      </div>
    </div>
  );
}
