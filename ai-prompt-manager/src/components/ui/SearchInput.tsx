import { forwardRef, useId, useState, useEffect, type InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  onClear?: () => void;
  resultsCount?: number;
  isLoading?: boolean;
  srOnlyLabel?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      label,
      onClear,
      resultsCount,
      isLoading = false,
      srOnlyLabel = 'Search',
      className = '',
      id: providedId,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const resultsId = `${id}-results`;

    const [announcement, setAnnouncement] = useState('');

    // Announce results count to screen readers with debounce
    useEffect(() => {
      if (resultsCount === undefined) return;

      const timer = setTimeout(() => {
        if (resultsCount === 0) {
          setAnnouncement('No results found');
        } else if (resultsCount === 1) {
          setAnnouncement('1 result found');
        } else {
          setAnnouncement(`${resultsCount} results found`);
        }
      }, 500);

      return () => clearTimeout(timer);
    }, [resultsCount]);

    const hasValue = Boolean(value);

    return (
      <div className="w-full">
        {/* Visible label (optional) */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            {label}
          </label>
        )}

        {/* Screen reader only label (when no visible label) */}
        {!label && (
          <label htmlFor={id} className="sr-only">
            {srOnlyLabel}
          </label>
        )}

        {/* Search input wrapper */}
        <div className="relative">
          {/* Search icon */}
          <div
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            aria-hidden="true"
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 text-gray-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {/* Input */}
          <input
            ref={ref}
            id={id}
            type="search"
            role="searchbox"
            aria-describedby={resultsCount !== undefined ? resultsId : undefined}
            value={value}
            onChange={onChange}
            className={`
              w-full rounded-lg border transition-colors duration-200
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              pl-10 pr-10 py-2.5
              border-gray-300 dark:border-gray-600 
              focus:border-blue-500 focus:ring-blue-500
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${className}
            `}
            {...props}
          />

          {/* Clear button */}
          {hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="
                absolute inset-y-0 right-0 pr-3 flex items-center
                text-gray-400 hover:text-gray-600 
                dark:text-gray-500 dark:hover:text-gray-300
                focus:outline-none focus:text-blue-500
              "
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Keyboard shortcut hint */}
          {!hasValue && (
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                ⌘K
              </kbd>
            </div>
          )}
        </div>

        {/* Live region for screen reader announcements */}
        <div
          id={resultsId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

