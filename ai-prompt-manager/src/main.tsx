import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { PromptProvider } from './context/PromptContext';
import { ToastProvider } from './components/ui/Toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <PromptProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </PromptProvider>
    </ThemeProvider>
  </StrictMode>
);
