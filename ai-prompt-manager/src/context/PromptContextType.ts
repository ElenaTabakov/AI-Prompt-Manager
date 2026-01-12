import { createContext } from 'react';
import type { Prompt } from '../types';

// ============ Types ============
export interface PromptState {
  prompts: Prompt[];
  error: string | null;
  // For undo/redo functionality
  history: Prompt[][];
  historyIndex: number;
}

export type PromptAction =
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROMPTS'; payload: Prompt[] }
  | { type: 'ADD_PROMPT'; payload: Prompt }
  | { type: 'UPDATE_PROMPT'; payload: Prompt }
  | { type: 'DELETE_PROMPT'; payload: string }
  | { type: 'REORDER_PROMPTS'; payload: Prompt[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'IMPORT_PROMPTS'; payload: Prompt[] };

export interface PromptContextType {
  // State
  prompts: Prompt[];
  error: string | null;
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrompt: (prompt: Prompt) => void;
  deletePrompt: (id: string) => void;
  reorderPrompts: (prompts: Prompt[]) => void;
  getPromptById: (id: string) => Prompt | undefined;
  undo: () => void;
  redo: () => void;
  exportPrompts: () => string;
  importPrompts: (jsonData: string) => boolean;
  clearError: () => void;
}

// ============ Context ============
export const PromptContext = createContext<PromptContextType | undefined>(undefined);

