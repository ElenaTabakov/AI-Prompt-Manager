interface NoResultsProps {
  onClearFilters: () => void;
}

export const NoResults = ({ onClearFilters }: NoResultsProps) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <p className="text-secondary font-medium">No prompts found</p>
    <p className="text-muted text-sm mt-1">Try adjusting your search or filters</p>
    <button
      onClick={onClearFilters}
      className="mt-4 text-sm text-violet-600 dark:text-violet-400 hover:underline"
    >
      Clear all filters
    </button>
  </div>
);

