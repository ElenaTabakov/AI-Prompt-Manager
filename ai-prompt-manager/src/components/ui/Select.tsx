import { forwardRef, useId, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  isRequired?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      hint,
      isRequired = false,
      placeholder,
      className = '',
      id: providedId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const hasError = Boolean(error);

    const describedBy = [
      hint ? hintId : null,
      hasError ? errorId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className="w-full">
        {/* Label */}
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
          {isRequired && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
          {isRequired && <span className="sr-only">(required)</span>}
        </label>

        {/* Select wrapper */}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            aria-required={isRequired}
            className={`
              w-full rounded-lg border transition-colors duration-200
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              px-4 py-2.5 pr-10
              appearance-none cursor-pointer
              ${
                hasError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-gray-100 disabled:dark:bg-gray-900 
              disabled:cursor-not-allowed disabled:opacity-60
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown arrow */}
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"
            aria-hidden="true"
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Hint text */}
        {hint && !hasError && (
          <p
            id={hintId}
            className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            {hint}
          </p>
        )}

        {/* Error message */}
        {hasError && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
            role="alert"
            aria-live="polite"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

