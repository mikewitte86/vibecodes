"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { applicationColumns } from "@/columns/applications";
import { applicationsApi } from "@/lib/api";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { AddApplicationDialog } from "@/components/modals/AddApplicationDialog";

const PER_PAGE = 10;

type ApplicationsApiResponse = {
  statusCode: number;
  body: {
    applications: any[];
    pagination?: { total: number };
  };
};

const subAgencies = [
  { name: "Lumen", value: "Lumen" },
  { name: "Equal Parts", value: "equalparts" },
];
const applicationTypes = [
  { name: "New Business", value: "new_business" },
  { name: "Renewal", value: "renewal" },
  { name: "BOR Change", value: "bor_change" },
];
const clients = [
  { value: "acme", label: "Acme Corporation", status: "Active" },
  { value: "techstart", label: "TechStart Inc", status: "Active" },
  { value: "global", label: "Global Manufacturing" },
  { value: "retail", label: "Retail Solutions", status: "Active" },
];
const contacts = [
  { value: "john", label: "John Smith" },
  { value: "jane", label: "Jane Doe" },
  { value: "robert", label: "Robert Johnson" },
  { value: "sarah", label: "Sarah Williams" },
  { value: "michael", label: "Michael Brown" },
];

export default function ApplicationsPage() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { data, isLoading } = useQuery<ApplicationsApiResponse>({
    queryKey: ["applications", page],
    queryFn: () => applicationsApi.getApplications(page, PER_PAGE),
  });

  const safeData =
    data && data.body
      ? data
      : { body: { applications: [], pagination: { total: 0 } } };

  useEffect(() => {
    if (safeData.body.pagination?.total) {
      setTotalCount(safeData.body.pagination.total);
    }
  }, [safeData.body.pagination?.total]);

  const applications = (safeData.body.applications || []).map((app: any) => ({
    id: app.id,
    subAgencyName: app.name || "-",
    clientName: app.company?.name || "-",
    applicationLob:
      app.lines_of_business.length > 0
        ? app.lines_of_business.map((lob: any) => lob.title || lob).join(", ")
        : "-",
    type: app.application_type || "-",
    primaryContact: app.brokerage_firm.name || "-",
  }));

  const total = safeData.body.pagination?.total || 0;
  const hasMorePages = page * PER_PAGE < total;
  const start = (page - 1) * PER_PAGE + 1;
  const end = Math.min(page * PER_PAGE, totalCount);

  const handleAddApplication = async (form: any) => {
    setIsSubmitting(true);
    setError(null);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalCount > 0 && (
              <span className="mr-2">
                {start}–{end} of {totalCount} applications shown
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Application
          </Button>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <DataTable
          columns={applicationColumns}
          data={applications}
          isLoading={isLoading}
          paginationToken={String(page)}
          onPaginationChange={(token) => {
            if (token) {
              setPage(parseInt(token, 10));
            }
          }}
          hasMorePages={hasMorePages}
          nextPageToken={String(page + 1)}
          prevPageToken={page > 1 ? String(page - 1) : undefined}
        />
      </div>

      <AddApplicationDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleAddApplication}
        subAgencies={subAgencies}
        applicationTypes={applicationTypes}
        clients={clients}
        contacts={contacts}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}
