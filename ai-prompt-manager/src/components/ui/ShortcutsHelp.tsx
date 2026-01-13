import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { useShortcutsHelp } from '../../hooks/useKeyboardShortcuts';

export const ShortcutsHelp = () => {
  const shortcuts = useShortcutsHelp();

  const formatKey = (shortcut: { key: string; ctrl?: boolean; shift?: boolean; alt?: boolean }) => {
    const parts: string[] = [];
    
    // Use ⌘ for Mac, Ctrl for others
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    if (shortcut.ctrl) {
      parts.push(isMac ? '⌘' : 'Ctrl');
    }
    if (shortcut.alt) {
      parts.push(isMac ? '⌥' : 'Alt');
    }
    if (shortcut.shift) {
      parts.push('⇧');
    }
    
    // Format special keys
    const keyDisplay = shortcut.key === 'Escape' ? 'Esc' : shortcut.key.toUpperCase();
    parts.push(keyDisplay);
    
    return parts;
  };

  return (
    <Popover className="relative">
      <PopoverButton
        className="
          p-2 rounded-lg 
          text-muted hover:text-primary 
          hover:bg-gray-100 dark:hover:bg-gray-800 
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-[#5faeb6] focus:ring-offset-2
        "
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </PopoverButton>

      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel 
          className="
            absolute right-0 z-50 mt-2 w-72
            bg-white dark:bg-gray-800 
            rounded-xl shadow-lg 
            border border-gray-200 dark:border-gray-700
            overflow-hidden
          "
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-primary">Keyboard Shortcuts</h3>
          </div>
          
          <div className="p-2">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="
                  flex items-center justify-between 
                  px-3 py-2 rounded-lg
                  hover:bg-gray-50 dark:hover:bg-gray-700/50
                "
              >
                <span className="text-sm text-secondary">
                  {shortcut.description}
                </span>
                <div className="flex items-center gap-1">
                  {formatKey(shortcut).map((key, i) => (
                    <kbd
                      key={i}
                      className="
                        inline-flex items-center justify-center
                        min-w-[24px] h-6 px-1.5
                        text-xs font-medium
                        text-gray-600 dark:text-gray-300
                        bg-gray-100 dark:bg-gray-700
                        border border-gray-300 dark:border-gray-600
                        rounded
                      "
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-muted">
              All shortcuts use modifiers for screen reader compatibility
            </p>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

