import { Switch as HeadlessSwitch } from '@headlessui/react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  srOnlyLabel?: string;
}

export function Switch({ checked, onChange, label, srOnlyLabel }: SwitchProps) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm font-medium text-secondary">{label}</span>
      )}

      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-300 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
        `}
      >
        <span className="sr-only">{srOnlyLabel || label || 'Toggle'}</span>

        {/* Thumb */}
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow-md
            transition-transform duration-300 ease-in-out
            flex items-center justify-center
            ${checked ? 'translate-x-5' : 'translate-x-0.5'}
          `}
        >
          {/* Sun icon */}
          <svg
            className={`h-3 w-3 text-yellow-500 transition-opacity absolute top-1/2 -translate-y-1/2  left-1/2 -translate-x-1/2 ${
              checked ? 'opacity-0' : 'opacity-100'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>

          {/* Moon icon */}
          <svg
            className={`h-3 w-3 text-blue-600 absolute transition-opacity   absolute top-1/2 -translate-y-1/2  left-1/2 -translate-x-1/2 ${
              checked ? 'opacity-100' : 'opacity-0'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </span>
      </HeadlessSwitch>
    </div>
  );
}
