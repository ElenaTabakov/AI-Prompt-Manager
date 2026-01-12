import {
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type { Prompt } from '../types';
import {
  PromptContext,
  type PromptState,
  type PromptAction,
  type PromptContextType,
} from './PromptContextType';

// ============ Constants ============
const STORAGE_KEY = 'ai-prompt-manager-prompts';
const MAX_HISTORY = 50;

// ============ Helpers ============
const generateId = (): string => {
  // Using crypto.randomUUID for better uniqueness
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Load prompts from localStorage with validation
 * Returns empty array if storage is empty or corrupted
 */
const loadFromStorage = (): Prompt[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    // Validate data structure
    if (!Array.isArray(parsed)) {
      console.warn('Invalid data structure in localStorage, expected array');
      return [];
    }

    return parsed.filter(
      (item): item is Prompt =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.category === 'string' &&
        typeof item.template === 'string' &&
        typeof item.createdAt === 'number' &&
        typeof item.updatedAt === 'number'
    );
  } catch (error) {
    console.error('Failed to load prompts from localStorage:', error);
    return [];
  }
};

/**
 * Save prompts to localStorage with error handling
 * Returns true if successful, false otherwise
 */
const saveToStorage = (
  prompts: Prompt[]
): { success: boolean; error?: string } => {
  try {
    const json = JSON.stringify(prompts);
    localStorage.setItem(STORAGE_KEY, json);
    return { success: true };
  } catch (error) {
    console.error('Failed to save prompts to localStorage:', error);

    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      return {
        success: false,
        error:
          'Storage is full! Please export your prompts and clear some data.',
      };
    }

    return {
      success: false,
      error: 'Failed to save prompts. Please try again.',
    };
  }
};

// ============ Reducer ============
const promptReducer = (
  state: PromptState,
  action: PromptAction
): PromptState => {
  /**
   * Helper to add new state to history
   * Removes future history if we're not at the end (redo history)
   * Limits history to MAX_HISTORY entries
   */
  const addToHistory = (newPrompts: Prompt[]): Partial<PromptState> => {
    // Remove future history if we're in the middle of undo/redo chain
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(newPrompts);

    // Limit history size to prevent memory issues
    // NOTE: In production with 1000+ prompts, consider storing diffs instead
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  };

  switch (action.type) {
    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_PROMPTS':
      // Initial load - don't add to history
      return {
        ...state,
        prompts: action.payload,
        history: [action.payload],
        historyIndex: 0,
      };

    case 'ADD_PROMPT': {
      const newPrompts = [action.payload, ...state.prompts];
      return {
        ...state,
        prompts: newPrompts,
        error: null, // Clear any previous errors
        ...addToHistory(newPrompts),
      };
    }

    case 'UPDATE_PROMPT': {
      const newPrompts = state.prompts.map(p =>
        p.id === action.payload.id ? action.payload : p
      );
      return {
        ...state,
        prompts: newPrompts,
        error: null,
        ...addToHistory(newPrompts),
      };
    }

    case 'DELETE_PROMPT': {
      const newPrompts = state.prompts.filter(p => p.id !== action.payload);
      return {
        ...state,
        prompts: newPrompts,
        error: null,
        ...addToHistory(newPrompts),
      };
    }

    case 'REORDER_PROMPTS': {
      return {
        ...state,
        prompts: action.payload,
        error: null,
        ...addToHistory(action.payload),
      };
    }

    case 'UNDO': {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          prompts: state.history[newIndex],
          historyIndex: newIndex,
          error: null,
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          prompts: state.history[newIndex],
          historyIndex: newIndex,
          error: null,
        };
      }
      return state;
    }

    case 'IMPORT_PROMPTS': {
      // Add imported prompts at the beginning so user sees them immediately
      const newPrompts = [...action.payload, ...state.prompts];
      return {
        ...state,
        prompts: newPrompts,
        error: null,
        ...addToHistory(newPrompts),
      };
    }

    default:
      return state;
  }
};

// ============ Provider ============
interface PromptProviderProps {
  children: ReactNode;
}

export const PromptProvider = ({ children }: PromptProviderProps) => {
  const [state, dispatch] = useReducer(promptReducer, {
    prompts: [],
    error: null,
    history: [[]],
    historyIndex: 0,
  });

  // Load prompts from localStorage on mount (synchronous)
  useEffect(() => {
    const stored = loadFromStorage();
    dispatch({ type: 'SET_PROMPTS', payload: stored });
  }, []);

  // Track if initial load is done (to avoid saving empty state)
  const isInitialMount = useRef(true);

  // Save to localStorage whenever prompts change (synchronous, optimistic)
  // NOTE: localStorage operations are fast enough to be synchronous
  // If this were a real API, we'd use optimistic updates with rollback on error
  useEffect(() => {
    // Skip saving on initial mount (before data is loaded)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const result = saveToStorage(state.prompts);
    if (!result.success && result.error) {
      dispatch({ type: 'SET_ERROR', payload: result.error });
    }
  }, [state.prompts]);

  // ============ Actions (all synchronous with optimistic updates) ============

  /**
   * Add a new prompt (optimistic update)
   * In production with API: dispatch immediately, rollback on error
   */
  const addPrompt = useCallback(
    (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newPrompt: Prompt = {
        ...promptData,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      dispatch({ type: 'ADD_PROMPT', payload: newPrompt });
    },
    []
  );

  /**
   * Update an existing prompt (optimistic update)
   */
  const updatePrompt = useCallback((prompt: Prompt) => {
    const updatedPrompt: Prompt = {
      ...prompt,
      updatedAt: Date.now(),
    };

    dispatch({ type: 'UPDATE_PROMPT', payload: updatedPrompt });
  }, []);

  /**
   * Delete a prompt (optimistic update)
   */
  const deletePrompt = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PROMPT', payload: id });
  }, []);

  /**
   * Reorder prompts (e.g., after drag and drop)
   */
  const reorderPrompts = useCallback((prompts: Prompt[]) => {
    dispatch({ type: 'REORDER_PROMPTS', payload: prompts });
  }, []);

  /**
   * Get a prompt by ID (memoized for performance)
   */
  const getPromptById = useCallback(
    (id: string) => {
      return state.prompts.find(p => p.id === id);
    },
    [state.prompts]
  );

  /**
   * Undo last action
   */
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  /**
   * Redo last undone action
   */
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  /**
   * Export all prompts as JSON string
   */
  const exportPrompts = useCallback((): string => {
    return JSON.stringify(state.prompts, null, 2);
  }, [state.prompts]);

  /**
   * Import prompts from JSON string
   * Returns true if successful, false otherwise
   * Validates data before importing
   */
  const importPrompts = useCallback((jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);

      if (!Array.isArray(parsed)) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Invalid data format: expected an array of prompts',
        });
        return false;
      }

      // Validate and transform imported prompts
      const validPrompts: Prompt[] = parsed
        .filter(
          (item): item is Partial<Prompt> =>
            typeof item === 'object' &&
            item !== null &&
            typeof item.title === 'string' &&
            typeof item.template === 'string' &&
            item.title.trim() !== '' &&
            item.template.trim() !== ''
        )
        .map(item => ({
          id: typeof item.id === 'string' ? item.id : generateId(),
          title: item.title!,
          category: typeof item.category === 'string' ? item.category : 'Other',
          template: item.template!,
          createdAt:
            typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
          updatedAt: Date.now(),
        }));

      if (validPrompts.length === 0) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'No valid prompts found in import data',
        });
        return false;
      }

      dispatch({ type: 'IMPORT_PROMPTS', payload: validPrompts });
      return true;
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to parse JSON. Please check the file format.',
      });
      return false;
    }
  }, []);

  /**
   * Clear current error message
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // ============ Context Value (memoized for performance) ============
  const value = useMemo<PromptContextType>(
    () => ({
      prompts: state.prompts,
      error: state.error,
      canUndo: state.historyIndex > 0,
      canRedo: state.historyIndex < state.history.length - 1,
      addPrompt,
      updatePrompt,
      deletePrompt,
      reorderPrompts,
      getPromptById,
      undo,
      redo,
      exportPrompts,
      importPrompts,
      clearError,
    }),
    [
      state.prompts,
      state.error,
      state.historyIndex,
      state.history.length,
      addPrompt,
      updatePrompt,
      deletePrompt,
      reorderPrompts,
      getPromptById,
      undo,
      redo,
      exportPrompts,
      importPrompts,
      clearError,
    ]
  );

  return (
    <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
  );
}
