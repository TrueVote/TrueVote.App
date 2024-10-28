import translationsData from '@/translations.json';

const languageKey: string = 'language';

export const storeLanguage: any = (language: string): void => {
  localStorage.setItem(languageKey, language);
};

export function getLanguage(): string {
  const languageCode: string = localStorage.getItem(languageKey) ?? 'en';
  return languageCode;
}

interface LanguageDictionary {
  [key: string]: {
    [language: string]: string;
  };
}

export class Localization {
  private dictionaries: LanguageDictionary = {};
  private selectedLanguage: string = getLanguage();
  private initialized: boolean = false;

  constructor() {
    try {
      console.info('~Localization()', translationsData);
      const translationDictionaries: any = Array.from(Object.entries(translationsData));
      translationDictionaries.map((item: any) => {
        this.addDictionary(item[0], item[1]);
      });
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Localization:', error);
      this.initialized = false;
    }
  }

  addDictionary = (language: string, dictionary: Record<string, string>): void => {
    try {
      this.dictionaries[language] = dictionary;
    } catch (error) {
      console.error(`Failed to add dictionary for language ${language}:`, error);
    }
  };

  getLocalizedString = <T extends keyof LanguageDictionary[string]>(
    key: T,
    fallback?: string,
  ): string => {
    try {
      if (!this.initialized) {
        return fallback ?? key.toString();
      }

      const dictionary: LanguageDictionary[string] | undefined =
        this.dictionaries[this.selectedLanguage];

      if (dictionary && key in dictionary) {
        return dictionary[key];
      }

      // Fallback to English if the key is not found in the specified language
      const fallbackDictionary: LanguageDictionary[string] | undefined = this.dictionaries['en'];

      if (fallbackDictionary?.[key]) {
        return fallbackDictionary[key];
      }

      // If no translation found, return fallback or key
      return fallback ?? key.toString();
    } catch (error) {
      console.error(`Localization error for key ${String(key)}:`, error);
      return fallback ?? key.toString();
    }
  };

  // Add a method to check if localization is ready
  isInitialized = (): boolean => {
    return this.initialized && Object.keys(this.dictionaries).length > 0;
  };
}
