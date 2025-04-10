import React from 'react';
import { SearchIcon } from 'lucide-react';
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
}
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  fullWidth = false
}) => {
  return <div className={`relative ${fullWidth ? 'w-full' : 'w-80'} ${className}`}>
      <input type="text" placeholder={placeholder} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]" value={value} onChange={e => onChange(e.target.value)} />
      <div className="absolute left-3 top-2.5 text-gray-400">
        <SearchIcon size={18} />
      </div>
    </div>;
};