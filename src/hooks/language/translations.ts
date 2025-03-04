
import { SupportedLanguage } from './types';
import { frenchTranslations } from './translations/fr';
import { englishTranslations } from './translations/en';
import { getDictionary } from './dictionaries';

export type { SupportedLanguage };

export const i18n = {
  defaultLocale: "fr" as SupportedLanguage,
  locales: ["fr", "en"] as SupportedLanguage[],
  async getTranslation(locale: string) {
    return locale === 'en' ? translations.en : translations.fr;
  },
};

export const translations = {
  fr: frenchTranslations,
  en: englishTranslations
};
