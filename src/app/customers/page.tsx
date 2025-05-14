"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { customerColumns } from "@/columns/companies";
import { Customer } from "@/types/tables";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { fetchAuthSession } from "aws-amplify/auth";
import { get } from "@aws-amplify/api-rest";
import { cn } from "@/lib/utils";

function useCustomersQuery() {
  return useQuery<Customer[], Error>({
    queryKey: ["customers"],
    queryFn: async () => {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error("No auth token found");
      const response = get({
        apiName: "api",
        path: "/customers",
        options: {
          queryParams: { agency_id: "test-agency" },
          headers: {
            Authorization: token,
          },
        },
      });
      if (Array.isArray(response)) {
        return response as Customer[];
      } else {
        return [];
      }
    },
  });
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCustomersQuery();
  const filtered = data.filter(
    (c: Customer) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all customers from Ultron.
          </p>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCcw
            className={cn("h-4 w-4", isFetching ? "animate-spin" : "")}
          />
          &nbsp;Refresh
        </Button>
      </div>
      <div className="px-4 sm:px-6">
        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white shadow p-8 text-center text-gray-400 text-lg">
            Loading customers...
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-gray-200 bg-white shadow p-8 text-center text-red-500 text-lg">
            Failed to load customers
          </div>
        ) : (
          <DataTable
            columns={customerColumns}
            data={filtered}
            search={{
              value: search,
              onChange: setSearch,
              placeholder: "Search customers...",
            }}
          />
        )}
      </div>
    </div>
  );
}
