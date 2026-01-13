import { type RefObject } from 'react';
import type { Prompt } from '../../types';
import { CATEGORIES } from '../../types';
import { usePromptFilters } from '../../hooks/usePromptFilters';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SearchInput } from '../ui/SearchInput';
import { Button } from '../ui/Button';
import { ViewToggle } from '../ui/ViewToggle';
import { PromptCard } from './PromptCard';
import { PromptListItem } from './PromptListItem';
import { CategoryTag } from './CategoryTag';
import { NoResults } from './NoResults';
import { EmptyState } from './EmptyState';

interface PromptListProps {
  prompts: Prompt[];
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onPreview: (prompt: Prompt) => void;
  onCreateNew: () => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
}

export const PromptList = ({
  prompts,
  onEdit,
  onDelete,
  onPreview,
  onCreateNew,
  searchInputRef,
}: PromptListProps) => {
  const [view, setView] = useLocalStorage<'grid' | 'list'>('prompt-view', 'grid');
  
  const {
    search,
    categoryFilter,
    isLoading,
    filteredPrompts,
    visiblePrompts,
    categoryCounts,
    hasMore,
    remainingCount,
    hasActiveFilters,
    handleSearchChange,
    handleCategoryChange,
    handleLoadMore,
    clearFilters,
  } = usePromptFilters(prompts);

  // Show empty state if no prompts at all
  if (prompts.length === 0) {
    return <EmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <SearchInput
            ref={searchInputRef}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClear={() => handleSearchChange('')}
            placeholder="Search prompts..."
            resultsCount={filteredPrompts.length}
          />
        </div>
        <Button onClick={onCreateNew} variant="primary">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Prompt
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <CategoryTag
          category="all"
          label="All"
          count={categoryCounts.all}
          isActive={categoryFilter === 'all'}
          onClick={() => handleCategoryChange('all')}
        />
        {CATEGORIES.map((category) => (
          <CategoryTag
            key={category}
            category={category}
            label={category}
            count={categoryCounts[category]}
            isActive={categoryFilter === category}
            onClick={() => handleCategoryChange(category)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          {/* ViewToggle - hidden on mobile */}
          <div className="hidden sm:block">
            <ViewToggle view={view} onViewChange={setView} />
          </div>
          <span className="text-muted">
            {filteredPrompts.length === prompts.length
              ? `Showing ${visiblePrompts.length} of ${prompts.length} prompt${prompts.length !== 1 ? 's' : ''}`
              : `Showing ${visiblePrompts.length} of ${filteredPrompts.length} filtered (${prompts.length} total)`
            }
          </span>
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-[#5faeb6] dark:text-[#6fc4cc] hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {visiblePrompts.length > 0 ? (
        <>
          {view === 'grid' ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePrompts.map((prompt) => (
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
            <div className="space-y-3">
              {visiblePrompts.map((prompt) => (
                <PromptListItem
                  key={prompt.id}
                  prompt={prompt}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPreview={onPreview}
                />
              ))}
            </div>
          )}

          {/* Load More button */}
          {hasMore && (
            <LoadMoreButton
              isLoading={isLoading}
              remainingCount={remainingCount}
              onClick={handleLoadMore}
            />
          )}
        </>
      ) : (
        <NoResults onClearFilters={clearFilters} />
      )}
    </div>
  );
};

// ============ Load More Button ============

interface LoadMoreButtonProps {
  isLoading: boolean;
  remainingCount: number;
  onClick: () => void;
}

const LoadMoreButton = ({ isLoading, remainingCount, onClick }: LoadMoreButtonProps) => (
  <div className="flex justify-center pt-4">
    <button
      onClick={onClick}
      disabled={isLoading}
      className="
        inline-flex items-center gap-2 px-6 py-3
        bg-gray-100 dark:bg-gray-800 
        hover:bg-gray-200 dark:hover:bg-gray-700
        text-primary font-medium rounded-xl
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-[#5faeb6] focus:ring-offset-2
      "
      aria-label={`Load more prompts`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Load More ({remainingCount} remaining)
        </>
      )}
    </button>
  </div>
);
