import { useState, useEffect } from 'react';
import type { Prompt } from '../../types';
import { CATEGORIES } from '../../types';
import { Modal, Input, Textarea, Select, Button } from '../ui';
import { TemplatePreview } from './TemplatePreview';

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingPrompt?: Prompt | null;
}

export const PromptForm = ({ isOpen, onClose, onSubmit, editingPrompt }: PromptFormProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Other');
  const [template, setTemplate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  // Reset form when modal opens/closes or editing prompt changes
  useEffect(() => {
    if (isOpen) {
      if (editingPrompt) {
        setTitle(editingPrompt.title);
        setCategory(editingPrompt.category);
        setTemplate(editingPrompt.template);
      } else {
        setTitle('');
        setCategory('Other');
        setTemplate('');
      }
      setErrors({});
      setShowPreview(false);
    }
  }, [isOpen, editingPrompt]);

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

  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
      size="lg"
    >
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
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          isRequired
        />

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
    </Modal>
  );
};

