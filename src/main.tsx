import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config/queryClient';
import './index.css';
import { Toaster } from 'sonner';

// Inicializar tema desde localStorage antes de renderizar
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme-storage');
  if (savedTheme) {
    try {
      const { state } = JSON.parse(savedTheme);
      if (state?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }
};

initializeTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
    />
      <App />
      <ReactQueryDevtools
        initialIsOpen={false} // Cerrado por defecto
        position="bottom"
      />
    </QueryClientProvider>
  </StrictMode>
);
