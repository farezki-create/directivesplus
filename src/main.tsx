
// Apply the rollup patch first
import './utils/rollup-patch.js';

import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Set global variables to force pure JS implementation
if (typeof window !== 'undefined') {
  // @ts-ignore - We're adding this property
  window.__ROLLUP_NO_NATIVE__ = true;
  // @ts-ignore - We're adding this property
  window.__FORCE_JS_IMPLEMENTATION__ = true;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
