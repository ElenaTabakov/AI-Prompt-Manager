import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Prompt } from '../types';

// ============ Types ============
interface PromptState {
  prompts: Prompt[];
  isLoading: boolean;
  error: string | null;
  // For undo functionality
  history: Prompt[][];
  historyIndex: number;
}

type PromptAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROMPTS'; payload: Prompt[] }
  | { type: 'ADD_PROMPT'; payload: Prompt }
  | { type: 'UPDATE_PROMPT'; payload: Prompt }
  | { type: 'DELETE_PROMPT'; payload: string }
  | { type: 'REORDER_PROMPTS'; payload: Prompt[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'IMPORT_PROMPTS'; payload: Prompt[] };

interface PromptContextType {
  // State
  prompts: Prompt[];
  isLoading: boolean;
  error: string | null;
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePrompt: (prompt: Prompt) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  reorderPrompts: (prompts: Prompt[]) => void;
  getPromptById: (id: string) => Prompt | undefined;
  undo: () => void;
  redo: () => void;
  exportPrompts: () => string;
  importPrompts: (jsonData: string) => boolean;
  clearError: () => void;
}

// ============ Constants ============
const STORAGE_KEY = 'ai-prompt-manager-prompts';
const MAX_HISTORY = 50;
const SIMULATED_DELAY = 300; // Simulate network delay for UX patterns

// ============ Helpers ============
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const loadFromStorage = (): Prompt[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate data structure
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is Prompt =>
            typeof item === 'object' &&
            typeof item.id === 'string' &&
            typeof item.title === 'string' &&
            typeof item.category === 'string' &&
            typeof item.template === 'string'
        );
      }
    }
  } catch (error) {
    console.error('Failed to load prompts from storage:', error);
  }
  return [];
};

const saveToStorage = (prompts: Prompt[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  } catch (error) {
    console.error('Failed to save prompts to storage:', error);
  }
};

// ============ Reducer ============
const promptReducer = (state: PromptState, action: PromptAction): PromptState => {
  const addToHistory = (newPrompts: Prompt[]): Partial<PromptState> => {
    // Remove future history if we're not at the end
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(newPrompts);

    // Limit history size
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  };

  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_PROMPTS':
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
        ...addToHistory(newPrompts),
      };
    }

    case 'UPDATE_PROMPT': {
      const newPrompts = state.prompts.map((p) =>
        p.id === action.payload.id ? action.payload : p
      );
      return {
        ...state,
        prompts: newPrompts,
        ...addToHistory(newPrompts),
      };
    }

    case 'DELETE_PROMPT': {
      const newPrompts = state.prompts.filter((p) => p.id !== action.payload);
      return {
        ...state,
        prompts: newPrompts,
        ...addToHistory(newPrompts),
      };
    }

    case 'REORDER_PROMPTS': {
      return {
        ...state,
        prompts: action.payload,
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
        };
      }
      return state;
    }

    case 'IMPORT_PROMPTS': {
      const newPrompts = [...action.payload, ...state.prompts];
      return {
        ...state,
        prompts: newPrompts,
        ...addToHistory(newPrompts),
      };
    }

    default:
      return state;
  }
};

// ============ Context ============
const PromptContext = createContext<PromptContextType | undefined>(undefined);

// ============ Provider ============
interface PromptProviderProps {
  children: ReactNode;
}

export function PromptProvider({ children }: PromptProviderProps) {
  const [state, dispatch] = useReducer(promptReducer, {
    prompts: [],
    isLoading: true,
    error: null,
    history: [[]],
    historyIndex: 0,
  });

  // Load prompts from localStorage on mount
  useEffect(() => {
    const loadPrompts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulate network delay for UX patterns
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

      const stored = loadFromStorage();
      dispatch({ type: 'SET_PROMPTS', payload: stored });
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    loadPrompts();
  }, []);

  // Save to localStorage whenever prompts change
  useEffect(() => {
    if (!state.isLoading) {
      saveToStorage(state.prompts);
    }
  }, [state.prompts, state.isLoading]);

  // ============ Actions ============
  const addPrompt = useCallback(
    async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

        const newPrompt: Prompt = {
          ...promptData,
          id: generateId(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        dispatch({ type: 'ADD_PROMPT', payload: newPrompt });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add prompt' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    []
  );

  const updatePrompt = useCallback(async (prompt: Prompt) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

      const updatedPrompt: Prompt = {
        ...prompt,
        updatedAt: Date.now(),
      };

      dispatch({ type: 'UPDATE_PROMPT', payload: updatedPrompt });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update prompt' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const deletePrompt = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));
      dispatch({ type: 'DELETE_PROMPT', payload: id });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete prompt' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const reorderPrompts = useCallback((prompts: Prompt[]) => {
    dispatch({ type: 'REORDER_PROMPTS', payload: prompts });
  }, []);

  const getPromptById = useCallback(
    (id: string) => {
      return state.prompts.find((p) => p.id === id);
    },
    [state.prompts]
  );

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const exportPrompts = useCallback((): string => {
    return JSON.stringify(state.prompts, null, 2);
  }, [state.prompts]);

  const importPrompts = useCallback((jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);

      if (!Array.isArray(parsed)) {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid data format: expected an array' });
        return false;
      }

      // Validate and transform imported prompts
      const validPrompts: Prompt[] = parsed
        .filter(
          (item): item is Partial<Prompt> =>
            typeof item === 'object' &&
            typeof item.title === 'string' &&
            typeof item.template === 'string'
        )
        .map((item) => ({
          id: item.id || generateId(),
          title: item.title!,
          category: item.category || 'Other',
          template: item.template!,
          createdAt: item.createdAt || Date.now(),
          updatedAt: Date.now(),
        }));

      if (validPrompts.length === 0) {
        dispatch({ type: 'SET_ERROR', payload: 'No valid prompts found in import data' });
        return false;
      }

      dispatch({ type: 'IMPORT_PROMPTS', payload: validPrompts });
      return true;
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to parse import data' });
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // ============ Context Value ============
  const value = useMemo<PromptContextType>(
    () => ({
      prompts: state.prompts,
      isLoading: state.isLoading,
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
      state.isLoading,
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

// ============ Hook ============
export function usePrompts() {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
}

