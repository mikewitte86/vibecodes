"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filter?: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  search,
  filter,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow overflow-hidden">
      {(search || filter) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 px-4 pt-4">
          {search && (
            <div className="flex-1 flex items-center gap-2">
              <span className="text-gray-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.167 15.833A6.667 6.667 0 1 0 9.167 2.5a6.667 6.667 0 0 0 0 13.333Zm6.666 2.5-3.625-3.625"
                  />
                </svg>
              </span>
              <Input
                className="w-full max-w-xs"
                placeholder={search.placeholder || "Search..."}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
              />
            </div>
          )}
          {filter && (
            <Select value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="select-none cursor-pointer bg-gray-50 font-semibold text-xs text-gray-700 px-1 sm:px-2 first:px-5 py-3 border-b border-t border-gray-200 truncate"
                    style={{
                      userSelect: "none",
                      width: header.column.columnDef.size,
                      minWidth: header.column.columnDef.size,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="truncate">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>
                      {header.column.getIsSorted() && (
                        <span className="inline-block w-4 text-gray-600 align-middle">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : null}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-400 text-sm"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-1 sm:px-2 first:px-5 py-3 border-b border-gray-100 truncate"
                      style={{
                        width: cell.column.columnDef.size,
                        minWidth: cell.column.columnDef.size,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
