
// Apply the rollup patch first
import './utils/rollup-patch.js';

import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Set a global indicator that we're using pure JS implementation
// @ts-ignore - TypeScript may not know about this property, but we've added it to the Window interface
window.__FORCE_JS_IMPLEMENTATION__ = true;

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
