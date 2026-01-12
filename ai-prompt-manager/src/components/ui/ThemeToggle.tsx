import { useTheme } from '../../context/ThemeContext';

/**
 * Theme toggle with Light/Dark buttons
 */
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div 
      className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
      role="radiogroup"
      aria-label="Theme selection"
    >
      {/* Light */}
      <button
        onClick={() => setTheme('light')}
        className={`
          p-2 rounded-md transition-all duration-200
          ${theme === 'light'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }
        `}
        role="radio"
        aria-checked={theme === 'light'}
        aria-label="Light theme"
      >
        <SunIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Dark */}
      <button
        onClick={() => setTheme('dark')}
        className={`
          p-2 rounded-md transition-all duration-200
          ${theme === 'dark'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }
        `}
        role="radio"
        aria-checked={theme === 'dark'}
        aria-label="Dark theme"
      >
        <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
  );
}

/**
 * Simple icon toggle button
 */
export const SimpleThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-6 h-6 text-gray-700" />
      ) : (
        <SunIcon className="w-6 h-6 text-gray-300" />
      )}
    </button>
  );
}

// ============ Icons ============

const SunIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

const MoonIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}
