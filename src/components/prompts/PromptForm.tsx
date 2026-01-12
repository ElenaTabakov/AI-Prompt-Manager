import { useState } from 'react';
import type { Prompt } from '../../types';
import { CATEGORIES } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { TemplatePreview } from './TemplatePreview';

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingPrompt?: Prompt | null;
}

export const PromptForm = ({ isOpen, onClose, onSubmit, editingPrompt }: PromptFormProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
      size="lg"
    >
      <PromptFormContent
        key={editingPrompt?.id ?? 'new'}
        onSubmit={onSubmit}
        onClose={onClose}
        editingPrompt={editingPrompt}
      />
    </Modal>
  );
};
interface PromptFormContentProps {
  onSubmit: (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  editingPrompt?: Prompt | null;
}

const PromptFormContent = ({ onSubmit, onClose, editingPrompt }: PromptFormContentProps) => {
  // Initialize state from editingPrompt (runs once when component mounts)
  const [title, setTitle] = useState(editingPrompt?.title ?? '');
  const [category, setCategory] = useState<string>(editingPrompt?.category ?? 'Other');
  const [template, setTemplate] = useState(editingPrompt?.template ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  
  // Custom categories
  const [customCategories, setCustomCategories] = useLocalStorage<string[]>('customCategories', []);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!template.trim()) {
      newErrors.template = 'Template is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      category,
      template: template.trim(),
    });

    onClose();
  };

  const handleCategoryChange = (value: string) => {
    if (value === '__add_new__') {
      setShowNewCategoryInput(true);
    } else {
      setCategory(value);
      setShowNewCategoryInput(false);
    }
  };

  const handleAddNewCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    
    // Check if category already exists
    const allCategories = [...CATEGORIES, ...customCategories];
    if (allCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setErrors(prev => ({ ...prev, newCategory: 'Category already exists' }));
      return;
    }
    
    // Add to custom categories
    setCustomCategories(prev => [...prev, trimmed]);
    setCategory(trimmed);
    setNewCategoryInput('');
    setShowNewCategoryInput(false);
    setErrors(prev => Object.fromEntries(
      Object.entries(prev).filter(([key]) => key !== 'newCategory')
    ));
  };

  // Build category options: default + custom + "Add new..."
  const categoryOptions = [
    ...CATEGORIES.filter(c => c !== 'Other').map((cat) => ({
      value: cat,
      label: cat,
    })),
    ...customCategories.map((cat) => ({
      value: cat,
      label: cat,
    })),
    { value: 'Other', label: 'Other' },
    { value: '__add_new__', label: '+ Add new category...' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Blog Post Generator"
        error={errors.title}
        isRequired
      />

      <Select
        label="Category"
        value={showNewCategoryInput ? '__add_new__' : category}
        onChange={handleCategoryChange}
        options={categoryOptions}
        isRequired
      />

      {/* New category input */}
      {showNewCategoryInput && (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label="New Category Name"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="e.g., Business, Education..."
              error={errors.newCategory}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddNewCategory();
                }
                if (e.key === 'Escape') {
                  setShowNewCategoryInput(false);
                  setNewCategoryInput('');
                }
              }}
              autoFocus
            />
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAddNewCategory}
            disabled={!newCategoryInput.trim()}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowNewCategoryInput(false);
              setNewCategoryInput('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      <Textarea
        label="Template"
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        placeholder="Write your prompt template. Use {variable} for dynamic parts.

Example: Write a blog post about {topic} in a {tone} style."
        error={errors.template}
        hint="Use {variable_name} for parts you want to fill in later"
        isRequired
        showCharCount
        maxLength={2000}
      />

      {/* Preview toggle */}
      {template && (
        <div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>

          {showPreview && (
            <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <TemplatePreview template={template} />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-theme">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {editingPrompt ? 'Save Changes' : 'Create Prompt'}
        </Button>
      </div>
    </form>
  );
};

