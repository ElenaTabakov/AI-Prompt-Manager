import { useTheme } from './context/ThemeContext';
import { Button } from './components/ui';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            AI Prompt Manager
          </h1>
          
          <Button
            variant="ghost"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </Button>
        </header>

        <main>
          {/* Card now uses CSS variable - changes automatically! */}
          <div className="bg-card rounded-xl shadow-lg p-6 border border-theme transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4">
              Theme is working! 🎉
            </h2>
            <p className="text-secondary">
              Current theme: <span className="font-bold text-accent">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </p>
            <p className="text-muted mt-2 text-sm">
              Click the sun/moon icon in the top right corner to toggle the theme.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
