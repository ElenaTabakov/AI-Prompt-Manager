import type { Prompt } from '../../types';
import { categoryStyles } from './categoryStyles';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onPreview: (prompt: Prompt) => void;
}

export const PromptCard = ({ prompt, onEdit, onDelete, onPreview }: PromptCardProps) => {

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Extract variables count from template
  const variablesCount = (prompt.template.match(/\{[^}]+\}/g) || []).length;

  return (
    <article
      className="
        bg-card border border-theme rounded-xl p-4
        hover:shadow-md transition-all duration-200
        group
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary truncate" title={prompt.title}>
            {prompt.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`
                text-xs font-medium px-2 py-0.5 rounded-full
                ${(categoryStyles[prompt.category] || categoryStyles.Other).bg}
                ${(categoryStyles[prompt.category] || categoryStyles.Other).text}
              `}
            >
              {prompt.category}
            </span>
            {variablesCount > 0 && (
              <span className="text-xs text-muted">
                {variablesCount} variable{variablesCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Actions - always visible on mobile, hover on desktop */}
        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onPreview(prompt)}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Preview prompt"
            title="Preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(prompt)}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Edit prompt"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(prompt.id)}
            className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Delete prompt"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Template preview */}
      <p className="text-sm text-secondary line-clamp-2 mb-3">
        {prompt.template}
      </p>

      {/* Footer */}
      <div className="text-xs text-muted">
        Updated {formatDate(prompt.updatedAt)}
      </div>
    </article>
  );
};

