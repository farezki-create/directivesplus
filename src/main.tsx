
// Force disable Rollup native modules BEFORE anything else loads
(globalThis as any).__ROLLUP_NO_NATIVE__ = true;
if (typeof process !== 'undefined' && process.env) {
  process.env.ROLLUP_NATIVE_DISABLE = 'true';
}

// Import our Rollup config helper to ensure native modules are disabled
import './rollup-config';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"

// Additional console log to verify the environment variable is set
console.log('Runtime Rollup configuration:', { 
  usingNativeModules: !(globalThis as any).__ROLLUP_NO_NATIVE__,
  nodeVersion: process.version,
  rollupNoNativeSet: (globalThis as any).__ROLLUP_NO_NATIVE__ === true,
  envDisable: typeof process !== 'undefined' ? process.env.ROLLUP_NATIVE_DISABLE : 'unavailable'
});

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
