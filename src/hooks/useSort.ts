import { useState } from 'react';
export function useSort<T>(initialField: keyof T) {
  const [sortField, setSortField] = useState<keyof T>(initialField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const sortData = (data: T[]) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction * aValue.localeCompare(bValue);
      }
      return direction * (aValue < bValue ? -1 : 1);
    });
  };
  const toggleSort = (field: keyof T) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  return {
    sortField,
    sortDirection,
    sortData,
    toggleSort
  };
}