import React from 'react';
import { SearchIcon } from 'lucide-react';
import { useSearch } from '../search/SearchContext';
export const GlobalSearchBar: React.FC = () => {
  const {
    openSearch
  } = useSearch();
  return <button onClick={openSearch} className="w-full max-w-2xl h-10 px-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center text-gray-400 hover:border-gray-300 transition-colors">
      <SearchIcon size={18} className="mr-2" />
      <span className="flex-grow text-left text-sm">
        Search across everything... (Press ⌘K)
      </span>
      <kbd className="hidden md:inline-block px-2 py-1 text-xs bg-gray-100 rounded">
        ⌘K
      </kbd>
    </button>;
};