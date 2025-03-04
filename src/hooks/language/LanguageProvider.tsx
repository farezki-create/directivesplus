import { useState, useEffect, useCallback } from 'react';
import { LanguageContext, LanguageProviderProps } from './LanguageContext';
import { SupportedLanguage, translations } from './translations';

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('fr');

  // Use local storage to keep language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setCurrentLanguage(savedLanguage);
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
