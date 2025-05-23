"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { policyColumns } from "@/columns/policies";
import { policyApi } from "@/lib/api";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PoliciesPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["policies"],
    queryFn: () => policyApi.getPolicies("lumen"),
  });

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Policies</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data?.body?.filter_applied && (
              <span className="mr-2">Showing {data.body.filter_applied}</span>
            )}
            {data?.body?.pagination && (
              <span>
                ({data.body.pagination.total_items} total policies)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCcw
              className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <DataTable
          columns={policyColumns}
          data={data?.body?.policies || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
