import React, { useEffect, useState, useRef } from 'react';
import { SearchIcon, XIcon, ClockIcon, ChevronRightIcon, FileTextIcon, BuildingIcon, UserIcon, FileIcon, CheckSquareIcon, LoaderIcon, TagIcon } from 'lucide-react';
import { useSearch, SearchResult } from './SearchContext';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
export const GlobalSearch: React.FC = () => {
  const {
    isSearchOpen,
    searchTerm,
    searchResults,
    recentSearches,
    isLoading,
    activeFilters,
    groupedResults,
    setSearchTerm,
    closeSearch,
    performSearch,
    clearRecentSearches,
    removeFilter,
    clearFilters
  } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  useOnClickOutside(searchRef, closeSearch);
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);
  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm, performSearch]);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const totalResults = Object.values(groupedResults).reduce((sum, group) => sum + group.length, 0);
      if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => prev < totalResults - 1 ? prev + 1 : prev);
      } else {
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
      }
    }
  };
  const filterTags = Object.entries(activeFilters).map(([key, value]) => <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {key}: {value}
      <button onClick={() => removeFilter(key)} className="ml-1 hover:text-blue-600">
        <XIcon size={12} />
      </button>
    </span>);
  const getSuggestions = () => {
    return [{
      label: 'Type: Policy',
      filter: 'type:policy'
    }, {
      label: 'Status: Active',
      filter: 'status:active'
    }, {
      label: 'Type: Company',
      filter: 'type:company'
    }, {
      label: 'Status: Pending',
      filter: 'status:pending'
    }];
  };
  if (!isSearchOpen) return null;
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="min-h-screen px-4 text-center">
        <div ref={searchRef} className="fixed top-[10%] left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="relative">
              <input ref={inputRef} type="text" className="w-full px-12 py-4 text-lg focus:outline-none" placeholder="Search across everything... (e.g., type:policy status:active)" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <kbd className="px-2 py-1 text-xs bg-gray-100 rounded-md">
                  ⌘K
                </kbd>
                <button onClick={closeSearch} className="text-gray-400 hover:text-gray-600">
                  <XIcon size={20} />
                </button>
              </div>
            </div>
            {filterTags.length > 0 && <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                <TagIcon size={14} className="text-gray-400" />
                <div className="flex items-center gap-2 flex-wrap">
                  {filterTags}
                  {filterTags.length > 0 && <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700">
                      Clear all
                    </button>}
                </div>
              </div>}
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? <div className="p-4 flex items-center justify-center text-gray-500">
                  <LoaderIcon className="animate-spin mr-2" size={20} />
                  <span>Searching...</span>
                </div> : searchTerm ? Object.keys(groupedResults).length > 0 ? <div className="py-2">
                    {Object.entries(groupedResults).map(([type, results]) => <div key={type}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                          {type}s ({results.length})
                        </div>
                        {results.map(result => <div key={`${result.type}-${result.id}`} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${selectedIndex === results.indexOf(result) ? 'bg-gray-50' : ''}`}>
                            <div className="flex items-center space-x-4">
                              {renderResultIcon(result.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {result.title}
                                  </h4>
                                  {result.status && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                      {result.status}
                                    </span>}
                                </div>
                                {result.subtitle && <p className="text-sm text-gray-500 truncate">
                                    {result.subtitle}
                                  </p>}
                                {result.metadata && <div className="mt-1 flex items-center space-x-4">
                                    {Object.entries(result.metadata).map(([key, value]) => <span key={key} className="text-xs text-gray-500">
                                          {key}: {value}
                                        </span>)}
                                  </div>}
                              </div>
                              <ChevronRightIcon size={16} className="text-gray-400 flex-shrink-0" />
                            </div>
                          </div>)}
                      </div>)}
                  </div> : <div className="p-4 text-center text-gray-500">
                    <p className="mb-2">No results found for "{searchTerm}"</p>
                    <div className="text-sm">
                      <p className="font-medium mb-2">
                        Try searching with filters:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {getSuggestions().map(suggestion => <button key={suggestion.filter} onClick={() => setSearchTerm(suggestion.filter)} className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs">
                            {suggestion.label}
                          </button>)}
                      </div>
                    </div>
                  </div> : recentSearches.length > 0 ? <div className="py-2">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">
                      Recent Searches
                    </h3>
                    <button onClick={clearRecentSearches} className="text-xs text-gray-500 hover:text-gray-700">
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map(term => <div key={term} onClick={() => setSearchTerm(term)} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <ClockIcon size={16} />
                        <span>{term}</span>
                      </div>
                    </div>)}
                </div> : null}
            </div>
            <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500">
              <div className="flex justify-between items-center">
                <div className="space-x-4">
                  <span>
                    Type{' '}
                    <kbd className="px-2 py-1 bg-white rounded shadow">
                      type:policy
                    </kbd>{' '}
                    for policies
                  </span>
                  <span>
                    Status{' '}
                    <kbd className="px-2 py-1 bg-white rounded shadow">
                      status:active
                    </kbd>{' '}
                    for active items
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-white rounded shadow">ESC</kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
const renderResultIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'policy':
      return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <FileTextIcon className="w-4 h-4 text-blue-600" />
        </div>;
    case 'company':
      return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <BuildingIcon className="w-4 h-4 text-green-600" />
        </div>;
    case 'task':
      return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <CheckSquareIcon className="w-4 h-4 text-purple-600" />
        </div>;
    default:
      return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <SearchIcon className="w-4 h-4 text-gray-600" />
        </div>;
  }
};