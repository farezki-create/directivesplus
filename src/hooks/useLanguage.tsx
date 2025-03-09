import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    allQuestionnaires: "All Questionnaires",
    refresh: "Refresh",
    questionsLoaded: "questions loaded",
    generalOpinion: "General Opinion",
    lifeSupport: "Life Support",
    advancedIllnessTitle: "Advanced Illness",
    preferences: "Preferences",
    beforeStarting: "Before Starting",
    generalOpinionDesc: "Please answer the following questions regarding your general opinion.",
    advancedIllnessDesc: "Please answer the following questions regarding advanced illness.",
    explanatoryVideo: "This is an explanatory video.",
  },
  fr: {
    allQuestionnaires: "Tous les Questionnaires",
    refresh: "Actualiser",
    questionsLoaded: "questions chargées",
    generalOpinion: "Opinion Générale",
    lifeSupport: "Soutien Vital",
    advancedIllnessTitle: "Maladie Avancée",
    preferences: "Préférences",
    beforeStarting: "Avant de Commencer",
    generalOpinionDesc: "Veuillez répondre aux questions suivantes concernant votre opinion générale.",
    advancedIllnessDesc: "Veuillez répondre aux questions suivantes concernant la maladie avancée.",
    explanatoryVideo: "Ceci est une vidéo explicative.",
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  const t = (key: string) => {
    return translations[currentLanguage][key] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage: setCurrentLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
