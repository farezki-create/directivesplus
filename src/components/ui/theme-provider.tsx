
"use client";

import * as React from "react";

// Simplified ThemeProvider that doesn't rely on next-themes
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "vite-ui-theme" }: ThemeProviderProps) {
  // Simple implementation without next-themes
  return <>{children}</>;
}
