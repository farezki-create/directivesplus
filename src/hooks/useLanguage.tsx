
import { useCallback, useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { translations, SupportedLanguage } from '@/i18n/translations';

// Re-export the SupportedLanguage type so it can be used by importers
export type { SupportedLanguage };

// Create the context
interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'fr',
  setLanguage: () => {},
  t: () => '',
});

// Context provider
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Set default language to French
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('fr');

  // Use local storage to store language preference, but default to French
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setCurrentLanguage(savedLanguage);
    } else {
      // If no language is stored or it's invalid, default to French
      setCurrentLanguage('fr');
      localStorage.setItem('language', 'fr');
    }
  }, []);

  const setLanguage = useCallback((language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  }, []);

  // Translation function
  const t = useCallback(
    (key: string) => {
      return translations[currentLanguage]?.[key] || key;
    },
    [currentLanguage]
  );

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the translation
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
