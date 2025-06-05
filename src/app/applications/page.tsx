"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { applicationColumns } from "@/columns/applications";
import { applicationsApi } from "@/lib/api";
import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { AddApplicationDialog } from "@/components/modals/AddApplicationDialog";
import { Application, ApplicationsResponse } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const PER_PAGE = 10;

const subAgencies = [
  { name: "Lumen", value: "lumen" },
  { name: "Equal Parts", value: "equalparts" },
];
const applicationTypes = [
  { name: "New Business", value: "new_business" },
  { name: "Renewal", value: "renewal" },
  { name: "BOR Change", value: "bor_change" },
];

export default function ApplicationsPage() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { data, isLoading } = useQuery<ApplicationsResponse>({
    queryKey: ["applications", page],
    queryFn: () => applicationsApi.getApplications(page, PER_PAGE),
  });

  const safeData: ApplicationsResponse =
    data && data.body
      ? data
      : {
          statusCode: 200,
          body: {
            applications: [],
            count: 0,
            pagination: {
              page: 1,
              per_page: PER_PAGE,
              total: 0,
              total_pages: 1,
            },
          },
        };

  useEffect(() => {
    if (safeData.body.pagination?.total) {
      setTotalCount(safeData.body.pagination.total);
    }
  }, [safeData.body.pagination?.total]);

  const applications = (safeData.body.applications || []).map(
    (app: Application) => ({
      id: app.id,
      subAgencyName: app.name || "-",
      clientName: app.company?.name || "-",
      applicationLob:
        app.lines_of_business && app.lines_of_business.length > 0
          ? app.lines_of_business.map((lob) => lob.title || lob).join(", ")
          : "-",
      type: app.application_type || "-",
      primaryContact: app.brokerage_firm?.name || "-",
    }),
  );

  const total = safeData.body.pagination?.total || 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  const handleAddApplication = async () => {
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
                {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, totalCount)} of {totalCount} applications shown
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

      <div className="px-4 sm:px-6 mt-6 mb-4 flex flex-col md:flex-row gap-3 md:gap-4 items-start justify-between md:items-center">
        <div className="relative w-full max-w-[400px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="w-4 h-4" />
          </span>
          <Input className="pl-9 w-full" placeholder="Search applications..." />
        </div>
        <div className="flex items-center gap-4">
          <Select>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by Sub-Agency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sub-Agencies</SelectItem>
              {subAgencies.map((agency) => (
                <SelectItem key={agency.value} value={agency.value}>
                  {agency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {applicationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <DataTable
          columns={applicationColumns}
          data={applications}
          isLoading={isLoading}
          pagination={{
            pageIndex: page - 1,
            pageSize: PER_PAGE,
            pageCount: totalPages,
            onPageChange: (newPage) => setPage(newPage + 1),
          }}
        />
      </div>

      <AddApplicationDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleAddApplication}
        subAgencies={subAgencies}
        applicationTypes={applicationTypes}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}
