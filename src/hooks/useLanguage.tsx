
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Langues supportées
export type SupportedLanguage = 'fr' | 'en' | 'es';

// Context pour la langue
type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traductions
const translations: Record<SupportedLanguage, Record<string, string>> = {
  fr: {
    // Header
    home: 'Accueil',
    reviews: 'Avis',
    buyCard: 'Achat carte',
    learnMore: 'En savoir plus',
    login: 'Connexion',
    logout: 'Déconnexion',
    // Auth
    createAccount: 'Créer un compte',
    signIn: 'Se connecter',
    signUpDesc: 'Inscrivez-vous pour accéder à vos directives anticipées',
    loginDesc: 'Connectez-vous pour accéder à vos directives anticipées',
    email: 'Email',
    password: 'Mot de passe',
    passwordHint: ' (8 caractères min., 1 majuscule, 1 chiffre)',
    choosePassword: 'Choisissez un mot de passe fort',
    yourPassword: 'Votre mot de passe',
    register: 'S\'inscrire',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    dontHaveAccount: 'Vous n\'avez pas de compte ?',
    // Dashboard
    generalOpinion: 'Mon avis général',
    lifeSupport: 'Maintien de la vie',
    advancedIllness: 'Maladie avancée',
    preferences: 'Mes goûts et mes peurs',
    trustedPerson: 'Désignation de la personne de confiance',
    summary: 'Synthèse du questionnaire',
    examples: 'Propositions de Directives Anticipées',
    // Language selector
    language: 'Langue',
    french: 'Français',
    english: 'Anglais',
    spanish: 'Espagnol',
  },
  en: {
    // Header
    home: 'Home',
    reviews: 'Reviews',
    buyCard: 'Buy card',
    learnMore: 'Learn more',
    login: 'Login',
    logout: 'Logout',
    // Auth
    createAccount: 'Create an account',
    signIn: 'Sign in',
    signUpDesc: 'Sign up to access your advance directives',
    loginDesc: 'Sign in to access your advance directives',
    email: 'Email',
    password: 'Password',
    passwordHint: ' (min. 8 characters, 1 uppercase, 1 number)',
    choosePassword: 'Choose a strong password',
    yourPassword: 'Your password',
    register: 'Register',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    // Dashboard
    generalOpinion: 'My general opinion',
    lifeSupport: 'Life support',
    advancedIllness: 'Advanced illness',
    preferences: 'My tastes and fears',
    trustedPerson: 'Designation of the trusted person',
    summary: 'Questionnaire summary',
    examples: 'Proposed advance directives',
    // Language selector
    language: 'Language',
    french: 'French',
    english: 'English',
    spanish: 'Spanish',
  },
  es: {
    // Header
    home: 'Inicio',
    reviews: 'Opiniones',
    buyCard: 'Comprar tarjeta',
    learnMore: 'Más información',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    // Auth
    createAccount: 'Crear una cuenta',
    signIn: 'Iniciar sesión',
    signUpDesc: 'Regístrese para acceder a sus directivas anticipadas',
    loginDesc: 'Inicie sesión para acceder a sus directivas anticipadas',
    email: 'Correo electrónico',
    password: 'Contraseña',
    passwordHint: ' (mín. 8 caracteres, 1 mayúscula, 1 número)',
    choosePassword: 'Elija una contraseña segura',
    yourPassword: 'Su contraseña',
    register: 'Registrarse',
    alreadyHaveAccount: '¿Ya tiene una cuenta?',
    dontHaveAccount: '¿No tiene una cuenta?',
    // Dashboard
    generalOpinion: 'Mi opinión general',
    lifeSupport: 'Soporte vital',
    advancedIllness: 'Enfermedad avanzada',
    preferences: 'Mis gustos y miedos',
    trustedPerson: 'Designación de la persona de confianza',
    summary: 'Resumen del cuestionario',
    examples: 'Propuestas de directivas anticipadas',
    // Language selector
    language: 'Idioma',
    french: 'Francés',
    english: 'Inglés',
    spanish: 'Español',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Récupérer la langue du localStorage ou utiliser le français par défaut
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const storedLang = localStorage.getItem('language') as SupportedLanguage;
    return storedLang && ['fr', 'en', 'es'].includes(storedLang) ? storedLang : 'fr';
  });

  // Mettre à jour le localStorage quand la langue change
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Fonction de traduction
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte de langue
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
