import translationsData from './translations.json';

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

export class LanguageLocalization {
  private dictionaries: LanguageDictionary = {};
  private selectedLanguage: string = getLanguage();

  constructor() {
    console.info('~LanguageLocalization()', translationsData);

    const translationDictionaries: any = Array.from(Object.entries(translationsData));

    translationDictionaries.map((item: any) => {
      this.addDictionary(item[0], item[1]);
    });
  }

  addDictionary(language: string, dictionary: Record<string, string>): void {
    this.dictionaries[language] = dictionary;
  }

  getLocalizedString<T extends keyof LanguageDictionary[string]>(key: T): string {
    const dictionary: LanguageDictionary[string] = this.dictionaries[this.selectedLanguage];

    if (dictionary && dictionary[key]) {
      return dictionary[key];
    }

    // Fallback to English if the key is not found in the specified language
    const fallbackDictionary: LanguageDictionary[string] = this.dictionaries['en'];
    return fallbackDictionary[key] || key.toString();
  }
}
