
// Import our Rollup config helper first to ensure native modules are disabled
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
console.log('Rollup configuration:', { 
  usingNativeModules: !globalThis.__ROLLUP_NO_NATIVE__,
  nodeVersion: process.version
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
