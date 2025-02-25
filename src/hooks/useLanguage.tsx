
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
    // Questionnaires
    saveMyAnswers: 'Enregistrer mes réponses',
    noQuestionFound: 'Aucune question trouvée.',
    beforeStarting: 'Avant de commencer',
    generalOpinionDesc: 'Cette section vous permet d\'exprimer votre avis général sur différentes situations médicales.',
    explanatoryVideo: 'Vidéo explicative à venir',
    continueToQuestionnaire: 'Continuer vers le questionnaire',
    advancedIllnessTitle: 'Maladie avancée',
    advancedIllnessDesc: 'Cette section concerne vos souhaits concernant les traitements en cas de maladie avancée.',
    whatDoYouThink: 'Que pensez-vous de :',
    // Réponses
    yes: 'Oui',
    no: 'Non',
    dontKnow: 'Je ne sais pas',
    indecision: 'Indécision',
    yesModerateTime: 'Oui pour une durée modérée',
    yesMedicalTeam: 'Oui seulement si l\'équipe médicale le juge utile',
    noQuicklyAbandon: 'Non rapidement abandonner le thérapeutique',
    prioritizeNoSuffering: 'La non souffrance est à privilégier',
    yesTrustedPerson: 'Oui si ma personne de confiance le juge utile',
    // PDF
    advanceDirectives: 'Directives Anticipées',
    documentEstablished: 'Document établi le',
    myAdvanceDirectives: 'Mes directives anticipées',
    trustedPersonTitle: 'Personne de confiance',
    iUndersigned: 'Je soussigné(e)',
    doneOn: 'Fait le',
    at: 'à',
    signedBy: 'Signé par',
    on: 'le',
    page: 'Page',
    // Trusted Person
    generateDesignationDocument: 'Générer le document de désignation',
    fullName: 'Nom complet',
    phone: 'Téléphone',
    relationship: 'Lien avec la personne',
    address: 'Adresse',
    city: 'Ville',
    postalCode: 'Code postal',
    save: 'Enregistrer',
    // FreeText
    freeTextInstructions: 'Ajoutez ici des informations complémentaires ou personnalisez vos directives anticipées.',
    savedSuccessfully: 'Enregistré avec succès',
    errorSaving: 'Erreur lors de l\'enregistrement',
    // Generate PDF
    generateMyAdvanceDirectives: 'Génération de mes directives anticipées',
    backToInput: 'Retour à la saisie',
    // Reviews
    submitReview: 'Soumettre un avis',
    reviewTitle: 'Titre',
    yourReview: 'Votre avis',
    submitButton: 'Soumettre',
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
    // Questionnaires
    saveMyAnswers: 'Save my answers',
    noQuestionFound: 'No questions found.',
    beforeStarting: 'Before starting',
    generalOpinionDesc: 'This section allows you to express your general opinion on various medical situations.',
    explanatoryVideo: 'Explanatory video coming soon',
    continueToQuestionnaire: 'Continue to questionnaire',
    advancedIllnessTitle: 'Advanced illness',
    advancedIllnessDesc: 'This section concerns your wishes regarding treatments in case of advanced illness.',
    whatDoYouThink: 'What do you think of:',
    // Réponses
    yes: 'Yes',
    no: 'No',
    dontKnow: 'I don\'t know',
    indecision: 'Indecision',
    yesModerateTime: 'Yes for a moderate time',
    yesMedicalTeam: 'Yes only if the medical team deems it useful',
    noQuicklyAbandon: 'No quickly abandon therapeutic',
    prioritizeNoSuffering: 'Non-suffering is to be prioritized',
    yesTrustedPerson: 'Yes if my trusted person deems it useful',
    // PDF
    advanceDirectives: 'Advance Directives',
    documentEstablished: 'Document established on',
    myAdvanceDirectives: 'My advance directives',
    trustedPersonTitle: 'Trusted Person',
    iUndersigned: 'I, the undersigned',
    doneOn: 'Done on',
    at: 'in',
    signedBy: 'Signed by',
    on: 'on',
    page: 'Page',
    // Trusted Person
    generateDesignationDocument: 'Generate designation document',
    fullName: 'Full name',
    phone: 'Phone',
    relationship: 'Relationship',
    address: 'Address',
    city: 'City',
    postalCode: 'Postal code',
    save: 'Save',
    // FreeText
    freeTextInstructions: 'Add complementary information here or customize your advance directives.',
    savedSuccessfully: 'Saved successfully',
    errorSaving: 'Error saving',
    // Generate PDF
    generateMyAdvanceDirectives: 'Generate my advance directives',
    backToInput: 'Back to input',
    // Reviews
    submitReview: 'Submit a review',
    reviewTitle: 'Title',
    yourReview: 'Your review',
    submitButton: 'Submit',
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
    // Questionnaires
    saveMyAnswers: 'Guardar mis respuestas',
    noQuestionFound: 'No se encontraron preguntas.',
    beforeStarting: 'Antes de empezar',
    generalOpinionDesc: 'Esta sección le permite expresar su opinión general sobre diversas situaciones médicas.',
    explanatoryVideo: 'Video explicativo próximamente',
    continueToQuestionnaire: 'Continuar al cuestionario',
    advancedIllnessTitle: 'Enfermedad avanzada',
    advancedIllnessDesc: 'Esta sección se refiere a sus deseos con respecto a los tratamientos en caso de enfermedad avanzada.',
    whatDoYouThink: '¿Qué piensa de:',
    // Réponses
    yes: 'Sí',
    no: 'No',
    dontKnow: 'No lo sé',
    indecision: 'Indecisión',
    yesModerateTime: 'Sí por un tiempo moderado',
    yesMedicalTeam: 'Sí solo si el equipo médico lo considera útil',
    noQuicklyAbandon: 'No abandonar rápidamente el tratamiento',
    prioritizeNoSuffering: 'Se debe priorizar la ausencia de sufrimiento',
    yesTrustedPerson: 'Sí si mi persona de confianza lo considera útil',
    // PDF
    advanceDirectives: 'Directivas Anticipadas',
    documentEstablished: 'Documento establecido el',
    myAdvanceDirectives: 'Mis directivas anticipadas',
    trustedPersonTitle: 'Persona de confianza',
    iUndersigned: 'Yo, el/la abajo firmante',
    doneOn: 'Hecho el',
    at: 'en',
    signedBy: 'Firmado por',
    on: 'el',
    page: 'Página',
    // Trusted Person
    generateDesignationDocument: 'Generar documento de designación',
    fullName: 'Nombre completo',
    phone: 'Teléfono',
    relationship: 'Relación',
    address: 'Dirección',
    city: 'Ciudad',
    postalCode: 'Código postal',
    save: 'Guardar',
    // FreeText
    freeTextInstructions: 'Añada información complementaria aquí o personalice sus directivas anticipadas.',
    savedSuccessfully: 'Guardado con éxito',
    errorSaving: 'Error al guardar',
    // Generate PDF
    generateMyAdvanceDirectives: 'Generar mis directivas anticipadas',
    backToInput: 'Volver a la entrada',
    // Reviews
    submitReview: 'Enviar una opinión',
    reviewTitle: 'Título',
    yourReview: 'Su opinión',
    submitButton: 'Enviar',
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
