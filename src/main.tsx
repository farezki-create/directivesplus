
// Import the rollup patch at runtime to ensure Rollup uses JavaScript implementation
try {
  // Use dynamic import to get our CommonJS patch
  const rollupPatch = require('./rollup-patch');
  console.log('[main.tsx] Rollup patch verification:', { 
    isPatched: rollupPatch.isPatched(),
    nativeModulesDisabled: process.env.ROLLUP_NATIVE_DISABLE === 'true'
  });
} catch (error) {
  console.error('[main.tsx] Failed to load Rollup patch:', error);
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <App />
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
