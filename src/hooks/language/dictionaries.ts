
import { TranslationDictionary } from './types';
import { translations } from './translations';

export async function getDictionary(locale: string): Promise<TranslationDictionary> {
  // This is a simplified implementation that returns the translations from our translations object
  // based on the locale requested
  if (locale === 'en') {
    return translations.en;
  }
  
  // Default to French
  return translations.fr;
}
