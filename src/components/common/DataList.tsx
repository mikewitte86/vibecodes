import React from 'react';
import { Table } from './Table';
import { Card } from './Card';
import { SearchInput } from './SearchInput';
import { useFilters } from '../../hooks/useFilters';
interface DataListProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: Array<{
    key: keyof T;
    header: string;
    render?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
  }>;
  filters?: Array<{
    field: keyof T;
    options: Array<{
      label: string;
      value: string;
    }>;
  }>;
  searchFields?: Array<keyof T>;
  onRowClick?: (item: T) => void;
  actions?: React.ReactNode;
}
export function DataList<T>({
  title,
  subtitle,
  data,
  columns,
  filters = [],
  searchFields = [],
  onRowClick,
  actions
}: DataListProps<T>) {
  const {
    filteredData,
    setFilter,
    setSearchTerm
  } = useFilters({
    data,
    filterConfig: filters,
    searchFields
  });
  return <div className="space-y-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          {actions}
        </div>
      </div>
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          {searchFields.length > 0 && <SearchInput onChange={setSearchTerm} placeholder={`Search ${title.toLowerCase()}...`} />}
          {filters.map(filter => <select key={String(filter.field)} className="border border-gray-300 rounded-md px-3 py-2" onChange={e => setFilter(String(filter.field), e.target.value)} defaultValue="all">
              {filter.options.map(option => <option key={option.value} value={option.value}>
                  {option.label}
                </option>)}
            </select>)}
        </div>
        <Table data={filteredData} columns={columns} onRowClick={onRowClick} />
      </Card>
    </div>;
}