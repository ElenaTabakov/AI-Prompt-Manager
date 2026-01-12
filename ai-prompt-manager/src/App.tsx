import { useTheme } from './context/ThemeContext';
import { ThemeToggle } from './components/ui';

function App() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            AI Prompt Manager
          </h1>
          
          <ThemeToggle />
        </header>

        <main>
          <div className="bg-card rounded-xl shadow-lg p-6 border border-theme transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4">
              Theme is working! 🎉
            </h2>
            <p className="text-secondary">
              Current theme: <span className="font-bold text-accent">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </p>
            <p className="text-muted mt-2 text-sm">
              Choose Light or Dark theme using the buttons above.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
