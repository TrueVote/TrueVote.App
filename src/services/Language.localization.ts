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
    console.info('~LanguageLocalization()');

    // Add dictionaries for different languages
    this.addDictionary('en', {
      HOMEPAGE: 'Home',
      WELCOME: 'Welcome',
    });

    this.addDictionary('es', {
      HOMEPAGE: 'Hogar',
      WELCOME: 'Bienvenido',
    });

    this.addDictionary('fr', {
      HOMEPAGE: 'Maison',
      WELCOME: 'Bienvenu',
    });

    this.addDictionary('ru', {
      HOMEPAGE: 'Дом',
      WELCOME: 'Добро пожаловать',
    });

    this.addDictionary('zh', {
      HOMEPAGE: '家',
      WELCOME: '欢迎',
    });

    this.addDictionary('ar', {
      HOMEPAGE: 'الصفحة الرئيسية',
      WELCOME: 'مرحباً',
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
