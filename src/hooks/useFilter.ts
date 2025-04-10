import { useState, useMemo } from 'react';
export function useFilter<T>(data: T[], filterField: keyof T) {
  const [filterValue, setFilterValue] = useState<string>('all');
  const filteredData = useMemo(() => {
    if (filterValue === 'all') return data;
    return data.filter(item => String(item[filterField]) === filterValue);
  }, [data, filterField, filterValue]);
  return {
    filterValue,
    setFilterValue,
    filteredData
  };
}