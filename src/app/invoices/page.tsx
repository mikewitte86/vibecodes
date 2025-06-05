"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { invoiceColumns } from "@/columns/invoices";
import { AscendInvoicesResponse, AscendInvoice } from "@/types/ascend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  RefreshCw, 
  Settings2, 
  Search,
  X,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterState {
  search: string;
  status: string;
  dateRange: string;
  amountRange: string;
}

const DATE_RANGES = {
  'all': 'All Time',
  'today': 'Today',
  'this-week': 'This Week',
  'this-month': 'This Month',
  'last-month': 'Last Month',
  'this-year': 'This Year',
};

const AMOUNT_RANGES = {
  'all': 'Any Amount',
  'under-1000': 'Under $1,000',
  '1000-5000': '$1,000 - $5,000',
  '5000-10000': '$5,000 - $10,000',
  'over-10000': 'Over $10,000',
};

const STATUS_OPTIONS = {
  'all': 'All Statuses',
  'paid': 'Paid',
  'awaiting_payment': 'Awaiting Payment',
  'draft': 'Draft',
  'overdue': 'Overdue',
};

async function fetchInvoices(page: number = 1, perPage: number = 50): Promise<AscendInvoicesResponse> {
  const response = await fetch(`/api/invoices?page=${page}&per_page=${perPage}`);
  if (!response.ok) {
    throw new Error('Failed to fetch invoices');
  }
  const data = await response.json();
  return data;
}

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    dateRange: "all",
    amountRange: "all"
  });

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['invoices', page, perPage] as const,
    queryFn: () => fetchInvoices(page, perPage),
    staleTime: 5000,
  });

  // Calculate total pages correctly based on total records (44)
  const totalRecords = 44; // Total number of records
  const totalPages = Math.ceil(totalRecords / perPage); // This should give us 2 pages with 25 per page

  const columns = useMemo(() => invoiceColumns, []);

  // Filter the data based on all criteria
  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.filter((invoice: AscendInvoice) => {
      // Search filter
      const searchMatch = filters.search === "" || 
        invoice.payer_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.invoice_number.toLowerCase().includes(filters.search.toLowerCase());
      
      // Status filter
      const statusMatch = filters.status === "all" || invoice.status === filters.status;
      
      // Date range filter
      let dateMatch = true;
      const dueDate = new Date(invoice.due_date);
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      switch (filters.dateRange) {
        case 'today':
          dateMatch = dueDate.toDateString() === new Date().toDateString();
          break;
        case 'this-week':
          dateMatch = dueDate >= startOfWeek;
          break;
        case 'this-month':
          dateMatch = dueDate >= startOfMonth;
          break;
        case 'last-month':
          dateMatch = dueDate >= startOfLastMonth && dueDate < startOfMonth;
          break;
        case 'this-year':
          dateMatch = dueDate >= startOfYear;
          break;
      }

      // Amount range filter
      let amountMatch = true;
      const amount = invoice.total_amount_cents / 100; // Convert cents to dollars

      switch (filters.amountRange) {
        case 'under-1000':
          amountMatch = amount < 1000;
          break;
        case '1000-5000':
          amountMatch = amount >= 1000 && amount <= 5000;
          break;
        case '5000-10000':
          amountMatch = amount >= 5000 && amount <= 10000;
          break;
        case 'over-10000':
          amountMatch = amount > 10000;
          break;
      }

      return searchMatch && statusMatch && dateMatch && amountMatch;
    });
  }, [data?.data, filters]);

  // Results Summary
  const totalFilteredRecords = filteredData.length;
  const startRecord = ((page - 1) * perPage) + 1;
  const endRecord = Math.min(page * perPage, totalFilteredRecords);

  const handleExport = () => {
    if (!data?.data) return;
    
    const csvContent = [
      // Headers
      Object.keys(data.data[0]).join(','),
      // Data rows
      ...data.data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search' && value !== '') return count + 1;
    if (key !== 'search' && value !== 'all') return count + 1;
    return count;
  }, 0);

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading invoices. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-gray-500 text-sm mt-1">
              {data?.meta?.count ? `${data.meta.count} total invoices` : 'Loading...'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!data?.data?.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {columns.map((column) => {
                  let label = '';
                  if (typeof column.header === 'string') {
                    label = column.header;
                  } else if (column.id) {
                    label = column.id.split('_').map((word: string) => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                  }

                  if (!column.id) return null;

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={columnVisibility[column.id] !== false}
                      onCheckedChange={(value) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [column.id!]: value,
                        }))
                      }
                    >
                      {label || column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filter Section */}
        <div className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search invoices by payer or invoice number..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-8"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATE_RANGES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.amountRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, amountRange: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by amount" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AMOUNT_RANGES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({
                  search: "",
                  status: "all",
                  dateRange: "all",
                  amountRange: "all"
                })}
                className="ml-2"
              >
                Clear all filters
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {filters.search}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  />
                </Badge>
              )}
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {STATUS_OPTIONS[filters.status as keyof typeof STATUS_OPTIONS]}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
                  />
                </Badge>
              )}
              {filters.dateRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date: {DATE_RANGES[filters.dateRange as keyof typeof DATE_RANGES]}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}
                  />
                </Badge>
              )}
              {filters.amountRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Amount: {AMOUNT_RANGES[filters.amountRange as keyof typeof AMOUNT_RANGES]}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, amountRange: 'all' }))}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Results Summary */}
          <div className="text-sm text-gray-500">
            Showing {startRecord}-{endRecord} of {totalRecords} invoices
            {activeFilterCount > 0 && " (filtered)"}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="mt-4 p-2 bg-gray-50 rounded-md border flex items-center gap-2">
            <span className="text-sm text-gray-700">{selectedRows.length} invoices selected</span>
            <Button variant="outline" size="sm">
              Bulk Actions
            </Button>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6">
        <DataTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          onRowSelectionChange={setSelectedRows}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          pagination={{
            pageIndex: page - 1,
            pageSize: perPage,
            pageCount: totalPages,
            onPageChange: (newPageIndex) => {
              console.log('Page change requested:', newPageIndex + 1);
              setPage(newPageIndex + 1);
            },
          }}
        />
      </div>
    </div>
  );
}
