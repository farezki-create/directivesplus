
import { Translation } from './types';

export const fr_questionnaire: Translation = {
  "generalOpinion": "Mon avis général",
  "lifeSupport": "Maintien en vie",
  "advancedIllness": "Maladie grave",
  "advancedIllnessTitle": "Maladie grave",
  "preferences": "Préférences",
  "generalOpinionTitle": "Mon avis général",
  "generalOpinionDesc": "Exprimez votre opinion générale concernant vos soins et traitements médicaux.",
  "lifeSupportTitle": "Maintien en vie",
  "lifeSupportDesc": "Indiquez vos préférences concernant les traitements de maintien en vie.",
  "advancedIllnessDesc": "Précisez vos volontés en cas de maladie grave ou terminale.",
  "preferencesTitle": "Préférences",
  "preferencesDesc": "Définissez vos préférences personnelles pour vos soins.",
  "questionnaireTitle": "Questionnaire",
  "questionnaireDesc": "Répondez aux questions suivantes pour définir vos directives anticipées.",
  "questionnaireSubmit": "Soumettre",
  "questionnaireCancel": "Annuler",
  "questionnaireRequired": "Veuillez répondre à toutes les questions obligatoires.",
  "questionnaireSaved": "Vos réponses ont été enregistrées.",
  "questionnaireSaving": "Enregistrement en cours...",
  "questionnaireError": "Une erreur est survenue lors de l'enregistrement de vos réponses.",
  "advancedIllnessDetails": "Si je suis atteint(e) d'une maladie grave ou incurable, je souhaite que les décisions suivantes soient prises :",
  "freeText": "Notes complémentaires et directives spécifiques",
};

export const en_questionnaire: Translation = {
  "generalOpinion": "My General Opinion",
  "lifeSupport": "Life Support",
  "advancedIllness": "Advanced Illness",
  "advancedIllnessTitle": "Advanced Illness",
  "preferences": "Preferences",
  "generalOpinionTitle": "My General Opinion",
  "generalOpinionDesc": "Express your general opinion regarding your medical care and treatments.",
  "lifeSupportTitle": "Life Support",
  "lifeSupportDesc": "Indicate your preferences regarding life support treatments.",
  "advancedIllnessDesc": "Specify your wishes in case of serious or terminal illness.",
  "preferencesTitle": "Preferences",
  "preferencesDesc": "Define your personal preferences for your care.",
  "questionnaireTitle": "Questionnaire",
  "questionnaireDesc": "Answer the following questions to define your advance directives.",
  "questionnaireSubmit": "Submit",
  "questionnaireCancel": "Cancel",
  "questionnaireRequired": "Please answer all required questions.",
  "questionnaireSaved": "Your answers have been saved.",
  "questionnaireSaving": "Saving...",
  "questionnaireError": "An error occurred while saving your answers.",
  "advancedIllnessDetails": "If I have a serious or incurable illness, I want the following decisions to be made:",
  "freeText": "Additional notes and specific directives",
};

// Create an object that contains all translations
export const questionnaireTranslations = {
  fr: fr_questionnaire,
  en: en_questionnaire
};
