import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Label,
  Transition,
} from '@headlessui/react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  hint?: string;
  isRequired?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const Select = ({
  label,
  value,
  onChange,
  options,
  error,
  hint,
  isRequired = false,
  placeholder = 'Select an option',
  disabled = false,
}: SelectProps) => {
  const selectedOption = options.find(opt => opt.value === value);
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      {/* Label */}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <Label className="block text-sm font-medium text-primary mb-1">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>

        <div className="relative">
          {/* Button */}
          <ListboxButton
            className={`
              relative w-full rounded-lg border py-2.5 pl-4 pr-10 text-left
              bg-card transition-colors cursor-pointer
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${hasError 
                ? 'border-red-500' 
                : 'border-theme hover:border-gray-400 dark:hover:border-gray-500'
              }
            `}
          >
            <span className={selectedOption ? 'text-primary' : 'text-muted'}>
              {selectedOption?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </ListboxButton>

          {/* Options dropdown */}
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute z-10 mt-1 w-full rounded-lg bg-card border border-theme shadow-lg max-h-60 overflow-auto focus:outline-none"
            >
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={({ focus, selected }) => `
                    relative cursor-pointer select-none py-2.5 pl-10 pr-4
                    ${focus ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-primary'}
                    ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {({ selected }) => (
                    <>
                      <span className={selected ? 'font-medium' : 'font-normal'}>
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>

      {/* Hint */}
      {hint && !hasError && (
        <p className="mt-1.5 text-sm text-muted">{hint}</p>
      )}

      {/* Error */}
      {hasError && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1" role="alert">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
