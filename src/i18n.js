import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';

const SESSION_KEY = 'vraj_pooja_lang_session';

// Delete any old localStorage language keys on load so a previously saved "en" can't override the default
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('vraj_pooja_lang');
    localStorage.removeItem('i18nextLng');
    localStorage.removeItem('i18next');
    localStorage.removeItem('language');
    localStorage.removeItem('lng');
  }
} catch (e) {
  // Ignore localStorage restrictions
}

// Retrieve user's manual choice for THIS VISIT ONLY from sessionStorage; default to 'hi'
let initialLng = 'hi';
try {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const sessionLng = sessionStorage.getItem(SESSION_KEY);
    if (sessionLng && ['en', 'hi', 'gu'].includes(sessionLng)) {
      initialLng = sessionLng;
    }
  }
} catch (e) {
  // Ignore sessionStorage restrictions
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

// Keep document.documentElement.lang synchronized and persist user choice in sessionStorage
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(SESSION_KEY, lng);
    }
  } catch (e) {
    // Ignore quota or access errors
  }
});

export default i18n;
