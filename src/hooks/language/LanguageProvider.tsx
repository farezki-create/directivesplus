
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
    // Update html lang attribute for accessibility
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const setLanguage = useCallback((language: SupportedLanguage) => {
    console.log(`[LanguageProvider] Setting language to: ${language}`);
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, []);

  // Translation function with fallback
  const t = useCallback(
    (key: string) => {
      const translation = translations[currentLanguage]?.[key];
      
      if (translation) return translation;
      
      // Fallback to English if key not found in current language
      const fallback = translations['en']?.[key];
      
      if (fallback) {
        console.warn(`[Translation] Missing '${key}' for language '${currentLanguage}', using English fallback`);
        return fallback;
      }
      
      // Return the key itself as last resort
      console.warn(`[Translation] Missing '${key}' for both languages`);
      return key;
    },
    [currentLanguage]
  );

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
