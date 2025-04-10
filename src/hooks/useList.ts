import { useState, useMemo } from 'react';
interface UseListOptions<T> {
  data: T[];
  sortKey?: keyof T;
  filterKey?: keyof T;
}
export function useList<T>({
  data,
  sortKey,
  filterKey
}: UseListOptions<T>) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = useMemo(() => {
    let result = [...data];
    // Apply filter
    if (filterKey && filterValue !== 'all') {
      result = result.filter(item => String(item[filterKey]) === filterValue);
    }
    // Apply search
    if (searchTerm) {
      result = result.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())));
    }
    // Apply sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = String(a[sortKey]);
        const bVal = String(b[sortKey]);
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return result;
  }, [data, filterKey, filterValue, searchTerm, sortKey, sortDirection]);
  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  return {
    data: filteredData,
    filterValue,
    setFilterValue,
    searchTerm,
    setSearchTerm,
    toggleSort,
    sortDirection
  };
}