import { useState } from 'react';
import { usePrompts } from './context/PromptContext';
import { ThemeToggle, Button, Modal, ConfirmDialog } from './components/ui';
import { PromptList, PromptForm, TemplatePreview } from './components/prompts';
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

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-theme">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <h1 className="text-xl font-bold text-primary">
              AI Prompt Manager
            </h1>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Undo/Redo */}
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 rounded-lg text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Undo"
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 rounded-lg text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Redo"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
              </div>

              {/* Import/Export */}
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <button
                  onClick={handleImport}
                  className="p-2 rounded-lg text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Import"
                  title="Import prompts"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
                <button
                  onClick={handleExport}
                  disabled={prompts.length === 0}
                  className="p-2 rounded-lg text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Export"
                  title="Export prompts"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Create button */}
              <Button onClick={handleCreate} variant="primary" size="sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </Button>
            </div>
          </div>
        </div>
      </header>

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
