import { useState, useMemo } from 'react';
import type { Prompt } from '../../types';
import { CATEGORIES } from '../../types';
import { useDebounce } from '../../hooks';
import { SearchInput } from '../ui';
import { PromptCard } from './PromptCard';
import { EmptyState } from './EmptyState';

interface PromptListProps {
  prompts: Prompt[];
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onPreview: (prompt: Prompt) => void;
  onCreateNew: () => void;
}

// Category colors for tags
const categoryStyles: Record<string, { bg: string; bgActive: string; text: string; textActive: string }> = {
  all: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    bgActive: 'bg-gray-900 dark:bg-white',
    text: 'text-gray-600 dark:text-gray-400',
    textActive: 'text-white dark:text-gray-900',
  },
  Coding: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    bgActive: 'bg-blue-600 dark:bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    textActive: 'text-white',
  },
  Writing: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    bgActive: 'bg-emerald-600 dark:bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    textActive: 'text-white',
  },
  Marketing: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    bgActive: 'bg-purple-600 dark:bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    textActive: 'text-white',
  },
  Other: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    bgActive: 'bg-orange-600 dark:bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    textActive: 'text-white',
  },
};

export const PromptList = ({
  prompts,
  onEdit,
  onDelete,
  onPreview,
  onCreateNew,
}: PromptListProps) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const debouncedSearch = useDebounce(search, 300);

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
      // Category filter
      if (categoryFilter !== 'all' && prompt.category !== categoryFilter) {
        return false;
      }

      // Search filter
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

  // Show empty state if no prompts at all
  if (prompts.length === 0) {
    return <EmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        placeholder="Search prompts..."
        resultsCount={filteredPrompts.length}
      />

      {/* Category tags */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {/* All tag */}
        <CategoryTag
          category="all"
          label="All"
          count={categoryCounts.all}
          isActive={categoryFilter === 'all'}
          onClick={() => setCategoryFilter('all')}
        />
        
        {/* Category tags */}
        {CATEGORIES.map((category) => (
          <CategoryTag
            key={category}
            category={category}
            label={category}
            count={categoryCounts[category]}
            isActive={categoryFilter === category}
            onClick={() => setCategoryFilter(category)}
          />
        ))}
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          {filteredPrompts.length === prompts.length
            ? `${prompts.length} prompt${prompts.length !== 1 ? 's' : ''}`
            : `${filteredPrompts.length} of ${prompts.length} prompts`
          }
        </span>
        {(search || categoryFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('all');
            }}
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Prompts grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={onEdit}
              onDelete={onDelete}
              onPreview={onPreview}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-secondary font-medium">No prompts found</p>
          <p className="text-muted text-sm mt-1">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('all');
            }}
            className="mt-4 text-sm text-violet-600 dark:text-violet-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

// ============ Category Tag Component ============

interface CategoryTagProps {
  category: string;
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const CategoryTag = ({ category, label, count, isActive, onClick }: CategoryTagProps) => {
  const styles = categoryStyles[category] || categoryStyles.Other;

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        text-sm font-medium rounded-full
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
        ${isActive
          ? `${styles.bgActive} ${styles.textActive} shadow-sm`
          : `${styles.bg} ${styles.text} hover:opacity-80`
        }
      `}
      aria-pressed={isActive}
    >
      {label}
      <span
        className={`
          text-xs px-1.5 py-0.5 rounded-full
          ${isActive
            ? 'bg-white/20'
            : 'bg-black/5 dark:bg-white/10'
          }
        `}
      >
        {count}
      </span>
    </button>
  );
};
