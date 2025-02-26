
import { useCallback, useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Définir les langues supportées
export type SupportedLanguage = 'fr' | 'en';

// Définir les traductions
const translations: Record<string, Record<string, string>> = {
  en: {
    welcomeMessage: 'Welcome to our application',
    next: 'Next',
    previous: 'Previous',
    generalOpinion: 'General Opinion',
    generalOpinionDesc: 'Share your general opinion on medical care',
    lifeSupport: 'Life Support',
    advancedIllnessTitle: 'Advanced Illness',
    advancedIllnessDesc: 'Share your preferences for treatment in case of advanced illness',
    trustedPerson: 'Trusted Person',
    trustConfirmation: 'I confirm this is my trusted person',
    downloadForm: 'Download Trusted Person Form',
    submit: 'Submit',
    yes: 'Yes',
    no: 'No',
    dontKnow: 'I don\'t know',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    generate: 'Generate',
    download: 'Download',
    email: 'Email',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
    relation: 'Relationship',
    city: 'City',
    postalCode: 'Postal Code',
    beforeStarting: 'Before Starting',
    freeTextInstructions: 'Here you can express your preferences in your own words',
    explanatoryVideo: 'Explanatory video',
    continueToQuestionnaire: 'Continue to questionnaire',
    yesModerateTime: 'Yes, for a moderate period',
    yesMedicalTeam: 'Yes, only if the medical team deems it useful',
    yesTrustedPerson: 'Yes, if my trusted person deems it useful',
    noQuicklyAbandon: 'No, quickly abandon therapeutic',
    prioritizeNoSuffering: 'Non-suffering is to be prioritized',
    indecision: 'Undecided',
    preferences: 'Preferences',
    loginSignup: 'Login / Sign up',
    whatDoYouThink: 'What do you think?',
    trustedPersons: 'Trusted Persons',
    language: 'Language',
    french: 'French',
    english: 'English',
    examples: 'Examples',
    examplesDesc: 'View example phrases and pre-filled templates to help you write your advance directives',
    templatesTitle: 'Template Proposals',
    phrasesTitle: 'Example Phrases to Use',
    moreTherapeuticCare: 'More therapeutic care',
    moreTherapeuticCareDesc: 'Example of advance directives favoring active therapeutic care',
    morePainRelief: 'More pain relief',
    morePainReliefDesc: 'Example of advance directives favoring comfort and pain relief',
    intermediate: 'Intermediate',
    intermediateDesc: 'Balanced example between therapeutic care and pain relief',
    addToSynthesis: 'Add to my synthesis',
    removeFromSynthesis: 'Remove from my synthesis',
    confirmAdd: 'Add to synthesis',
    confirmAddDesc: 'Do you really want to add this phrase to your synthesis?',
    confirmRemove: 'Remove from synthesis',
    confirmRemoveDesc: 'Do you really want to remove this phrase from your synthesis?',
    confirm: 'Confirm',
    back: 'Back',
    error: 'Error',
    success: 'Success',
    mustBeLoggedIn: 'You must be logged in to modify your synthesis',
    phraseAdded: 'The phrase has been added to your synthesis',
    phraseRemoved: 'The phrase has been removed from your synthesis',
    phraseAlreadyExists: 'This phrase is already present in your synthesis',
    phraseNotFound: 'This phrase is not present in your synthesis',
    errorAddingPhrase: 'Unable to add the phrase to your synthesis',
    errorRemovingPhrase: 'Unable to remove the phrase from your synthesis',
    home: 'Home',
    reviews: 'Reviews',
    buyCard: 'Buy Card',
    login: 'Login',
    logout: 'Logout',
    faq: 'FAQ',
    information: 'Information',
  },
  fr: {
    welcomeMessage: 'Bienvenue sur notre application',
    next: 'Suivant',
    previous: 'Précédent',
    generalOpinion: 'Avis général',
    generalOpinionDesc: 'Partagez votre opinion générale sur les soins médicaux',
    lifeSupport: 'Maintien de la vie',
    advancedIllnessTitle: 'Maladie avancée',
    advancedIllnessDesc: 'Partagez vos préférences de traitement en cas de maladie avancée',
    trustedPerson: 'Personne de confiance',
    trustConfirmation: 'Je confirme qu\'il s\'agit de ma personne de confiance',
    downloadForm: 'Télécharger le formulaire de personne de confiance',
    submit: 'Soumettre',
    yes: 'Oui',
    no: 'Non',
    dontKnow: 'Je ne sais pas',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    generate: 'Générer',
    download: 'Télécharger',
    email: 'E-mail',
    name: 'Nom',
    phone: 'Téléphone',
    address: 'Adresse',
    relation: 'Relation',
    city: 'Ville',
    postalCode: 'Code postal',
    beforeStarting: 'Avant de commencer',
    freeTextInstructions: 'Ici vous pouvez exprimer vos préférences dans vos propres mots',
    explanatoryVideo: 'Vidéo explicative',
    continueToQuestionnaire: 'Continuer vers le questionnaire',
    yesModerateTime: 'Oui, pour une durée modérée',
    yesMedicalTeam: 'Oui, seulement si l\'équipe médicale le juge utile',
    yesTrustedPerson: 'Oui, si ma personne de confiance le juge utile',
    noQuicklyAbandon: 'Non, rapidement abandonner le thérapeutique',
    prioritizeNoSuffering: 'La non souffrance est à privilégier',
    indecision: 'Indécision',
    preferences: 'Préférences',
    loginSignup: 'Connexion / Inscription',
    whatDoYouThink: 'Qu\'en pensez-vous ?',
    trustedPersons: 'Personnes de confiance',
    language: 'Langue',
    french: 'Français',
    english: 'Anglais',
    examples: 'Exemples',
    examplesDesc: 'Consultez des exemples de phrases et des modèles pré-remplis pour vous aider à rédiger vos directives anticipées',
    templatesTitle: 'Propositions de modèles',
    phrasesTitle: 'Exemples de phrases à utiliser',
    moreTherapeuticCare: 'Plus de soins thérapeutiques',
    moreTherapeuticCareDesc: 'Exemple de directives anticipées privilégiant les soins thérapeutiques actifs',
    morePainRelief: 'Plus de soulagement des souffrances',
    morePainReliefDesc: 'Exemple de directives anticipées privilégiant le confort et le soulagement de la douleur',
    intermediate: 'Intermédiaire',
    intermediateDesc: 'Exemple équilibré entre les soins thérapeutiques et le soulagement des souffrances',
    addToSynthesis: 'Ajouter à ma synthèse',
    removeFromSynthesis: 'Supprimer de ma synthèse',
    confirmAdd: 'Ajouter à la synthèse',
    confirmAddDesc: 'Voulez-vous vraiment ajouter cette phrase à votre synthèse ?',
    confirmRemove: 'Supprimer de la synthèse',
    confirmRemoveDesc: 'Voulez-vous vraiment supprimer cette phrase de votre synthèse ?',
    confirm: 'Confirmer',
    back: 'Retour',
    error: 'Erreur',
    success: 'Succès',
    mustBeLoggedIn: 'Vous devez être connecté pour modifier votre synthèse',
    phraseAdded: 'La phrase a été ajoutée à votre synthèse',
    phraseRemoved: 'La phrase a été retirée de votre synthèse',
    phraseAlreadyExists: 'Cette phrase est déjà présente dans votre synthèse',
    phraseNotFound: 'Cette phrase n\'est pas présente dans votre synthèse',
    errorAddingPhrase: 'Impossible d\'ajouter la phrase à votre synthèse',
    errorRemovingPhrase: 'Impossible de retirer la phrase de votre synthèse',
    home: 'Accueil',
    reviews: 'Avis',
    buyCard: 'Acheter la carte',
    login: 'Connexion',
    logout: 'Déconnexion',
    faq: 'Questions/Réponses',
    information: 'Information',
  }
};

// Créer le contexte
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

// Fournisseur de contexte
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('fr');

  // Utiliser le stockage local pour garder la préférence de langue
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

  // Fonction de traduction
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

// Hook personnalisé pour utiliser la traduction
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
