import { useContext } from 'react';
import { PromptContext } from '../context/PromptContextType';

/**
 * Hook to access prompt context
 * Must be used within a PromptProvider
 */
export const usePrompts = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
};

