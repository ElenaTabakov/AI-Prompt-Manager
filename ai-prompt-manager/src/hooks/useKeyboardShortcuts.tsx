import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: (e: KeyboardEvent) => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrl, shift, alt, callback }) => {
        const ctrlMatch = ctrl
          ? e.ctrlKey || e.metaKey
          : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shift ? e.shiftKey : !e.shiftKey;
        const altMatch = alt ? e.altKey : !e.altKey;

        if (
          e.key.toLowerCase() === key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          // Don't prevent default if user is typing in an input
          const target = e.target as HTMLElement;
          if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
          ) {
            // Allow Ctrl+Z, Ctrl+Shift+Z even in inputs
            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
              callback(e);
            }
            return;
          }

          e.preventDefault();
          callback(e);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Hook for displaying shortcuts help
export const useShortcutsHelp = () => {
  const shortcuts = [
    { key: 'N', description: 'Create new prompt' },
    { key: 'K', ctrl: true, description: 'Search prompts' },
    { key: '/', description: 'Focus search' },
    { key: 'Escape', description: 'Close modal/Clear search' },
    { key: 'Z', ctrl: true, description: 'Undo' },
    { key: 'Z', ctrl: true, shift: true, description: 'Redo' },
    { key: 'D', ctrl: true, description: 'Toggle dark mode' },
  ];

  return shortcuts;
};
