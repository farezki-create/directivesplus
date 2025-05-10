
// Set this before other imports to ensure Rollup uses JavaScript implementation
(globalThis as any).__ROLLUP_NO_NATIVE__ = true;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"

// Additional console log to verify the environment variable is set
console.log('Rollup configuration:', { 
  usingNativeModules: !(globalThis as any).__ROLLUP_NO_NATIVE__,
  nodeVersion: process.version
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
      <SonnerToaster position="top-center" richColors />
    </BrowserRouter>
  </React.StrictMode>,
)
