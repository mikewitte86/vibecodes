"use client";
import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { invoiceColumns } from "@/columns/invoices";
import { invoices } from "@/data/invoices";

export default function InvoicesPage() {
  const columns = useMemo(() => invoiceColumns, []);

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
          columns={columns}
          data={invoices}
        />
      </div>
    </div>
  );
}
