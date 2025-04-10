import { useState, useMemo } from 'react';
interface UseFiltersOptions<T> {
  data: T[];
  filterConfig?: {
    field: keyof T;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  searchFields?: (keyof T)[];
}
export function useFilters<T>({
  data,
  filterConfig = [],
  searchFields = []
}: UseFiltersOptions<T>) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof T | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const filteredData = useMemo(() => {
    let result = [...data];
    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => String(item[field as keyof T]).toLowerCase() === value.toLowerCase());
      }
    });
    // Apply search
    if (searchTerm && searchFields.length) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => searchFields.some(field => String(item[field]).toLowerCase().includes(term)));
    }
    // Apply sort
    if (sortField) {
      result.sort((a, b) => {
        const aVal = String(a[sortField]);
        const bVal = String(b[sortField]);
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return result;
  }, [data, filters, searchTerm, sortField, sortDirection]);
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  return {
    filteredData,
    setFilter: (field: string, value: string) => setFilters(prev => ({
      ...prev,
      [field]: value
    })),
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort
  };
}