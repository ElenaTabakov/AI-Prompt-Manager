import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContextType';

/**
 * Hook to access theme context
 * Must be used within a ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

