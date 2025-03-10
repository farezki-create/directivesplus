
import { en } from './en';
import { fr } from './fr';

export type SupportedLanguage = 'fr' | 'en';

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en,
  fr
};
