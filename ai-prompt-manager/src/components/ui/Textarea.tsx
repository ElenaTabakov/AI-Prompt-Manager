import { forwardRef, useId, useState, useEffect, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      isRequired = false,
      showCharCount = false,
      maxLength,
      autoResize = false,
      className = '',
      id: providedId,
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const countId = `${id}-count`;

    const hasError = Boolean(error);
    const [charCount, setCharCount] = useState(0);

    // Update character count
    useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [value]);

    // Build aria-describedby
    const describedBy = [
      hint ? hintId : null,
      hasError ? errorId : null,
      showCharCount ? countId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    // Handle auto-resize
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const isNearLimit = maxLength && charCount > maxLength * 0.9;
    const isOverLimit = maxLength && charCount > maxLength;

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

        {/* Textarea */}
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError || !!isOverLimit}
          aria-describedby={describedBy}
          aria-required={isRequired}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={`
            w-full rounded-lg border transition-colors duration-200
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            px-4 py-3 min-h-[120px] resize-y
            ${
              hasError || isOverLimit
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-[#5faeb6] focus:ring-[#5faeb6]'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-gray-100 disabled:dark:bg-gray-900 
            disabled:cursor-not-allowed disabled:opacity-60
            ${autoResize ? 'resize-none overflow-hidden' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Bottom row: hint/error + character count */}
        <div className="flex justify-between items-start mt-1.5 gap-4">
          <div className="flex-1">
            {/* Hint text */}
            {hint && !hasError && (
              <p
                id={hintId}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {hint}
              </p>
            )}

            {/* Error message */}
            {hasError && (
              <p
                id={errorId}
                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
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

          {/* Character count */}
          {showCharCount && (
            <p
              id={countId}
              className={`text-sm flex-shrink-0 ${
                isOverLimit
                  ? 'text-red-600 dark:text-red-400 font-medium'
                  : isNearLimit
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              aria-live="polite"
            >
              <span className="sr-only">
                {charCount} of {maxLength || 'unlimited'} characters used
              </span>
              <span aria-hidden="true">
                {charCount}
                {maxLength && `/${maxLength}`}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

