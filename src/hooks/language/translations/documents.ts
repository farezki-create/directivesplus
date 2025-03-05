
import { Translation } from './types';

export const fr_documents: Translation = {
  "generatePDF": "Générer le PDF",
  "generateAdvanceDirectives": "Générer mes directives anticipées",
  "backToInput": "Revenir à la saisie",
  "saveYourDirectives": "Enregistrer vos directives",
  "saveDirectives": "Enregistrer",
  "saving": "Enregistrement...",
  "directivesSavedSecurely": "Vos directives sont enregistrées de manière sécurisée et peuvent être modifiées à tout moment.",
  "summaryTitle": "Synthèse de vos directives anticipées",
  "summaryDescription": "Voici un résumé de vos directives anticipées basé sur vos réponses.",
  "summary": "Synthèse",
  "information": "Information",
  "beforeStarting": "Avant de commencer",
  "freeTextInstructions": "Dans cette section, vous pouvez ajouter des notes complémentaires et des directives spécifiques qui n'ont pas été couvertes par les questions précédentes.",
  "explanatoryVideo": "Vidéo explicative",
  "continueToQuestionnaire": "Continuer vers le questionnaire",
};

export const en_documents: Translation = {
  "generatePDF": "Generate PDF",
  "generateAdvanceDirectives": "Generate my advance directives",
  "backToInput": "Back to input",
  "saveYourDirectives": "Save your directives",
  "saveDirectives": "Save directives",
  "saving": "Saving...",
  "directivesSavedSecurely": "Your directives are securely saved and can be modified at any time.",
  "summaryTitle": "Summary of your advance directives",
  "summaryDescription": "Here is a summary of your advance directives based on your answers.",
  "summary": "Summary",
  "information": "Information",
  "beforeStarting": "Before starting",
  "freeTextInstructions": "In this section, you can add additional notes and specific directives that were not covered by the previous questions.",
  "explanatoryVideo": "Explanatory video",
  "continueToQuestionnaire": "Continue to questionnaire",
};

// Create an object that contains all translations
export const documentsTranslations = {
  fr: fr_documents,
  en: en_documents
};
