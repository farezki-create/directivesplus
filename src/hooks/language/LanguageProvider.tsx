
import { useState, useEffect, useCallback } from 'react';
import { LanguageContext, LanguageProviderProps } from './LanguageContext';
import { SupportedLanguage, translations } from './translations';

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Get browser language or fallback to French
  const getBrowserLanguage = (): SupportedLanguage => {
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'en' || browserLang === 'fr') ? browserLang as SupportedLanguage : 'fr';
  };

  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    // First try to get from localStorage
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      return savedLanguage;
    }
    // If not in localStorage, use browser language
    return getBrowserLanguage();
  });

  // Save language preference to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const setLanguage = useCallback((language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  }, []);

  // Translation function with fallback
  const t = useCallback(
    (key: string) => {
      return translations[currentLanguage]?.[key] || 
             translations['en']?.[key] || // Fallback to English if key not found in current language
             key; // Return the key itself as last resort
    },
    [currentLanguage]
  );

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
