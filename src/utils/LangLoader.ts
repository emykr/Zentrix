import ko from '../lang/ko.json';
import en from '../lang/en.json';

type LangKey = keyof typeof ko | keyof typeof en;


const langs = {
  ko,
  en,
} as const;

let currentLang: keyof typeof langs = 'ko';

export const setLang = (lang: keyof typeof langs) => {
  currentLang = lang;
};

export const t = (key: string): string => {
  const keys = key.split('.');
  let current: any = langs[currentLang];
  
  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    current = current[k];
  }
  
  return current;
};