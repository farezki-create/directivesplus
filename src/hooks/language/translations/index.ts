
import { SupportedLanguage, Translations } from "./types";
import { dateFnsLocales } from "./locales";
import { generalTranslations } from "./general";
import { medicalTranslations } from "./medical";
import { dataTranslations } from "./data";
import { uiTranslations } from "./ui";
import { commonTranslations } from "./common";
import { assertionTranslations } from "./assertions";
import { authTranslations } from "./auth";
import { examplesTranslations } from "./examples";

// Helper function to merge translation objects
const mergeTranslations = (...translationObjects: Translations[]): Translations => {
  const result: Translations = { fr: {}, en: {} };
  
  translationObjects.forEach(translationObj => {
    // Merge French translations
    if (translationObj.fr) {
      result.fr = { ...result.fr, ...translationObj.fr };
    }
    
    // Merge English translations
    if (translationObj.en) {
      result.en = { ...result.en, ...translationObj.en };
    }
  });
  
  return result;
};

// Combine all translation categories
export const translations: Translations = mergeTranslations(
  generalTranslations,
  medicalTranslations,
  dataTranslations,
  uiTranslations,
  commonTranslations, 
  assertionTranslations,
  authTranslations,
  examplesTranslations
);

// Re-export types and date-fns locales
export { dateFnsLocales };
export type { SupportedLanguage };
