"use client";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { newBusinessColumns } from "@/columns/newBusiness";
import { deals } from "@/data/newBusiness";

export default function NewBusinessPage() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All");
  const filtered = useMemo(
    () =>
      deals.filter(
        (d) =>
          (stage === "All" || d.stage === stage) &&
          (d.company.toLowerCase().includes(search.toLowerCase()) ||
            d.contact.toLowerCase().includes(search.toLowerCase())),
      ),
    [search, stage],
  );

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">New Business</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and track new business opportunities.
        </p>
      </div>
      <div className="px-4 sm:px-6">
        <DataTable
          columns={newBusinessColumns}
          data={filtered}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "Search companies...",
          }}
          filter={{
            value: stage,
            onChange: setStage,
            options: [
              { value: "All", label: "All Stages" },
              { value: "Lead", label: "Lead" },
              { value: "Qualification", label: "Qualification" },
              { value: "Proposal", label: "Proposal" },
              { value: "Negotiation", label: "Negotiation" },
              { value: "Closed Won", label: "Closed Won" },
              { value: "Closed Lost", label: "Closed Lost" },
            ],
          }}
        />
      </div>
    </div>
  );
}
