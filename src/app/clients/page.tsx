"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { customerColumns } from "@/columns/companies";
import { customerApi } from "@/lib/api";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomersPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerApi.getCustomers("lumen"),
  });

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data?.body?.count && (
              <span>({data.body.count} total clients)</span>
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
          columns={customerColumns}
          data={data?.body?.customers || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
