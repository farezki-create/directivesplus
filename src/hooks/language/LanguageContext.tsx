
import { createContext, ReactNode } from 'react';
import { SupportedLanguage } from './translations';

// Create the context
export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'fr',
  setLanguage: () => {},
  t: () => '',
});

// Provider Props Interface
export interface LanguageProviderProps {
  children: ReactNode;
}
