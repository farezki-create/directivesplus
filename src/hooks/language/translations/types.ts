
export type SupportedLanguage = 'fr' | 'en';

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  [key: string]: Translation;
}
