import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';

const STORAGE_KEY = 'vraj_pooja_lang';

// Retrieve user's explicitly saved choice if any; default to 'hi' for first-time visitors
let initialLng = 'hi';
try {
  const savedLng = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem(STORAGE_KEY) : null;
  if (savedLng && ['en', 'hi', 'gu'].includes(savedLng)) {
    initialLng = savedLng;
  }
} catch (e) {
  // localStorage may be blocked or restricted (e.g. private browsing)
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
    },
    lng: initialLng,
    fallbackLng: 'hi',
    interpolation: {
      escapeValue: false,
    },
  });

// Keep document.documentElement.lang synchronized on load
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLng;
}

// Keep document.documentElement.lang synchronized and persist user choice
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, lng);
    }
  } catch (e) {
    // Ignore quota or access errors
  }
});

export default i18n;
