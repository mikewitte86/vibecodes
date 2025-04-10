import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';
export interface SearchResult {
  id: string | number;
  type: 'policy' | 'company' | 'contact' | 'invoice' | 'task' | 'user';
  title: string;
  subtitle?: string;
  status?: string;
  metadata?: {
    [key: string]: string | number;
  };
  route?: string;
}
interface ParsedSearch {
  query: string;
  filters: {
    [key: string]: string;
  };
}
interface SearchContextType {
  isSearchOpen: boolean;
  searchTerm: string;
  searchResults: SearchResult[];
  recentSearches: string[];
  isLoading: boolean;
  activeFilters: {
    [key: string]: string;
  };
  groupedResults: {
    [key: string]: SearchResult[];
  };
  setSearchTerm: (term: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  performSearch: (term: string) => void;
  clearRecentSearches: () => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
}
const SearchContext = createContext<SearchContextType | undefined>(undefined);
const parseSearchQuery = (query: string): ParsedSearch => {
  const filters: {
    [key: string]: string;
  } = {};
  const parts = query.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  const queryParts: string[] = [];
  parts.forEach(part => {
    const filterMatch = part.match(/^([a-zA-Z]+):(.+)$/);
    if (filterMatch) {
      const [, key, value] = filterMatch;
      filters[key.toLowerCase()] = value.replace(/^"(.*)"$/, '$1');
    } else {
      queryParts.push(part);
    }
  });
  return {
    query: queryParts.join(' '),
    filters
  };
};
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
export const SearchProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    [key: string]: string;
  }>({});
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);
  const performSearch = useCallback(async (term: string) => {
    const {
      query,
      filters
    } = parseSearchQuery(term);
    setActiveFilters(filters);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    if (term.length > 2) {
      setRecentSearches(prev => {
        const searches = [term, ...prev.filter(s => s !== term)].slice(0, 5);
        return searches;
      });
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    const results: SearchResult[] = [{
      id: 1,
      type: 'policy',
      title: 'General Liability - Acme Corp',
      subtitle: 'GL-123456',
      status: 'Active',
      metadata: {
        premium: '$12,500',
        expiration: '2024-01-01'
      },
      route: '/policies/1'
    }, {
      id: 2,
      type: 'company',
      title: 'Acme Corporation',
      subtitle: '3 Active Policies',
      metadata: {
        revenue: '$1.2M',
        location: 'San Francisco, CA'
      },
      route: '/companies/2'
    }, {
      id: 3,
      type: 'task',
      title: 'Policy Renewal Review',
      subtitle: 'Due in 3 days',
      status: 'Pending',
      metadata: {
        assignee: 'John Doe',
        priority: 'High'
      },
      route: '/tasks/3'
    }].filter(item => {
      for (const [key, value] of Object.entries(filters)) {
        if (key === 'type' && item.type !== value.toLowerCase()) return false;
        if (key === 'status' && item.status?.toLowerCase() !== value.toLowerCase()) return false;
      }
      return item.title.toLowerCase().includes(query.toLowerCase()) || item.subtitle?.toLowerCase().includes(query.toLowerCase());
    });
    setSearchResults(results);
    setIsLoading(false);
  }, []);
  const removeFilter = useCallback((key: string) => {
    setActiveFilters(prev => {
      const newFilters = {
        ...prev
      };
      delete newFilters[key];
      return newFilters;
    });
  }, []);
  const clearFilters = useCallback(() => {
    setActiveFilters({});
  }, []);
  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as {
    [key: string]: SearchResult[];
  });
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
    setActiveFilters({});
  }, []);
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);
  return <SearchContext.Provider value={{
    isSearchOpen,
    searchTerm,
    searchResults,
    recentSearches,
    isLoading,
    activeFilters,
    groupedResults,
    setSearchTerm,
    openSearch,
    closeSearch,
    performSearch,
    clearRecentSearches,
    removeFilter,
    clearFilters
  }}>
      {children}
    </SearchContext.Provider>;
};