import { useState, useMemo } from 'react';
import type { Prompt } from '../types';
import { CATEGORIES } from '../types';
import { useDebounce } from './useDebounce';

const ITEMS_PER_PAGE = 12;

export const usePromptFilters = (prompts: Prompt[]) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Wrapper to reset pagination when search changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Wrapper to reset pagination when category changes
  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Clear all filters
  const clearFilters = () => {
    handleSearchChange('');
    handleCategoryChange('all');
  };

  // Count prompts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: prompts.length };
    CATEGORIES.forEach(cat => {
      counts[cat] = prompts.filter(p => p.category === cat).length;
    });
    return counts;
  }, [prompts]);

  // Filter prompts based on search and category
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      if (categoryFilter !== 'all' && prompt.category !== categoryFilter) {
        return false;
      }

      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        return (
          prompt.title.toLowerCase().includes(searchLower) ||
          prompt.template.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [prompts, debouncedSearch, categoryFilter]);

  // Get visible prompts (paginated)
  const visiblePrompts = useMemo(() => {
    return filteredPrompts.slice(0, visibleCount);
  }, [filteredPrompts, visibleCount]);

  const hasMore = visibleCount < filteredPrompts.length;
  const remainingCount = filteredPrompts.length - visibleCount;

  // Load more handler
  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 300);
  };

  const hasActiveFilters = search !== '' || categoryFilter !== 'all';

  return {
    // State
    search,
    categoryFilter,
    isLoading,
    
    // Computed
    filteredPrompts,
    visiblePrompts,
    categoryCounts,
    hasMore,
    remainingCount,
    hasActiveFilters,
    
    // Actions
    handleSearchChange,
    handleCategoryChange,
    handleLoadMore,
    clearFilters,
  };
};

