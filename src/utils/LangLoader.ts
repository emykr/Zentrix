import ko from '../lang/ko.json';
import en from '../lang/en.json';

type LangKey = keyof typeof ko | keyof typeof en;

const langs = {
  ko,
  en,
} as const;

type Lang = keyof typeof langs;

let currentLang: Lang = (localStorage.getItem('zentrix-lang') as Lang) || 'ko' || 'en';

export const setLang = (lang: Lang) => {
  currentLang = lang;
  localStorage.setItem('zentrix-lang', lang);
  window.dispatchEvent(new Event('languagechange'));
};

export const getCurrentLang = (): Lang => currentLang;

export const getSupportedLangs = (): Lang[] => Object.keys(langs) as Lang[];

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