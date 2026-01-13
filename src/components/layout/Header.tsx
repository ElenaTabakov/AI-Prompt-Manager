import { ThemeToggle } from '../ui/ThemeToggle';
import { ShortcutsHelp } from '../ui/ShortcutsHelp';

interface HeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  onImport: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canExport: boolean;
}

export const Header = ({
  onUndo,
  onRedo,
  onImport,
  onExport,
  canUndo,
  canRedo,
  canExport,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-theme">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-xl font-bold text-primary">AI Prompt Manager</h1>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Undo/Redo - visible on all screens */}
            <div className="flex items-center gap-1 mr-2">
              <IconButton
                onClick={onUndo}
                disabled={!canUndo}
                label="Undo"
                title="Undo (Ctrl+Z)"
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
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
              </IconButton>
              <IconButton
                onClick={onRedo}
                disabled={!canRedo}
                label="Redo"
                title="Redo (Ctrl+Y)"
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
                    d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
                  />
                </svg>
              </IconButton>
            </div>

            {/* Import/Export */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <IconButton
                onClick={onImport}
                label="Import"
                title="Import prompts"
              >
                {' '}
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </IconButton>
              <IconButton
                onClick={onExport}
                disabled={!canExport}
                label="Export"
                title="Export prompts"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </IconButton>
            </div>

            {/* Shortcuts help - hidden on mobile */}
            <div className="hidden sm:block">
              <ShortcutsHelp />
            </div>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

// ============ Icon Button Component ============

interface IconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  title: string;
  children: React.ReactNode;
}

const IconButton = ({ onClick, disabled = false, label, title, children }: IconButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="
      p-2 rounded-lg 
      text-muted hover:text-primary 
      hover:bg-gray-100 dark:hover:bg-gray-800 
      disabled:opacity-30 disabled:cursor-not-allowed 
      transition-colors
    "
    aria-label={label}
    title={title}
  >
    {children}
  </button>
);

