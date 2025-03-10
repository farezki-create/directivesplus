
import { enTranslations } from './en';
import { frTranslations } from './fr';

export type SupportedLanguage = 'fr' | 'en';

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: enTranslations,
  fr: frTranslations
};
