import { useState, useCallback, useRef } from 'react';
import { usePrompts } from './hooks/usePrompts';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Modal, ConfirmDialog } from './components/ui/Modal';
import { Header } from './components/layout/Header';
import { PromptList } from './components/prompts/PromptList';
import { PromptForm } from './components/prompts/PromptForm';
import { TemplatePreview } from './components/prompts/TemplatePreview';
import type { Prompt } from './types';

const App = () => {
  const { 
    prompts, 
    addPrompt, 
    updatePrompt, 
    deletePrompt, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    exportPrompts,
    importPrompts,
    error,
    clearError,
  } = usePrompts();

  const { toggleTheme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState<Prompt | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Handlers
  const handleCreate = () => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPrompt) {
      updatePrompt({ ...editingPrompt, ...data });
    } else {
      addPrompt(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      deletePrompt(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleExport = () => {
    const json = exportPrompts();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          importPrompts(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Focus search input
  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  // Close any open modal
  const closeModals = useCallback(() => {
    if (isFormOpen) {
      setIsFormOpen(false);
    } else if (previewPrompt) {
      setPreviewPrompt(null);
    } else if (deleteConfirm) {
      setDeleteConfirm(null);
    } else {
      // Clear search focus
      searchInputRef.current?.blur();
    }
  }, [isFormOpen, previewPrompt, deleteConfirm]);

  // Keyboard shortcuts (all with modifiers for screen reader compatibility)
  useKeyboardShortcuts([
    {
      key: 'n',
      alt: true,
      description: 'Create new prompt',
      callback: () => handleCreate(),
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Focus search',
      callback: () => focusSearch(),
    },
    {
      key: 'Escape',
      description: 'Close modal',
      callback: () => closeModals(),
    },
    {
      key: 'z',
      ctrl: true,
      description: 'Undo',
      callback: () => {
        if (canUndo) undo();
      },
    },
    {
      key: 'y',
      ctrl: true,
      description: 'Redo',
      callback: () => {
        if (canRedo) redo();
      },
    },
    {
      key: 't',
      alt: true,
      description: 'Toggle dark mode',
      callback: () => toggleTheme(),
    },
  ]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <Header
        onUndo={undo}
        onRedo={redo}
        onImport={handleImport}
        onExport={handleExport}
        canUndo={canUndo}
        canRedo={canRedo}
        canExport={prompts.length > 0}
      />

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 dark:text-red-400 hover:text-red-800"
              aria-label="Dismiss error"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PromptList
          prompts={prompts}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirm(id)}
          onPreview={setPreviewPrompt}
          onCreateNew={handleCreate}
          searchInputRef={searchInputRef}
        />
      </main>

      {/* Modals */}
      <PromptForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        editingPrompt={editingPrompt}
      />

      {/* Preview modal */}
      <Modal
        isOpen={!!previewPrompt}
        onClose={() => setPreviewPrompt(null)}
        title={previewPrompt?.title || 'Preview'}
        size="lg"
      >
        {previewPrompt && (
          <TemplatePreview template={previewPrompt.template} />
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Prompt"
        message="Are you sure you want to delete this prompt? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default App;
