import React from 'react';
import { Badge } from './Badge';
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}
export function Table<T>({
  data,
  columns,
  onRowClick,
  sortField,
  sortDirection,
  onSort
}: TableProps<T>) {
  return <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {columns.map(column => <th key={String(column.key)} onClick={() => column.sortable && onSort?.(String(column.key))} className={`
                  px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200
                  ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                `}>
                {column.header}
                {column.sortable && sortField === column.key && <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>}
              </th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => <tr key={index} onClick={() => onRowClick?.(item)} className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}>
              {columns.map(column => <td key={String(column.key)} className="px-4 py-3 border-b border-gray-200">
                  {column.render ? column.render(item[column.key], item) : <div className="text-sm">{String(item[column.key])}</div>}
                </td>)}
            </tr>)}
        </tbody>
      </table>
    </div>;
}