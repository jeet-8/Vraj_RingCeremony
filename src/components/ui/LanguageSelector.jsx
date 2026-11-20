import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector({ isFixed = false }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const languages = [
    { code: 'en', label: 'EN', font: 'font-serif' },
    { code: 'hi', label: 'हिन्दी', font: 'font-hindi' },
    { code: 'gu', label: 'ગુજરાતી', font: 'font-gujarati' },
  ];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
  };

  const containerClasses = isFixed
    ? "fixed top-3 left-3 z-40 flex items-center bg-[#24141E]/90 backdrop-blur-md border border-[#D8A85E]/40 rounded-full p-0.5 shadow-lg"
    : "flex items-center bg-[#24141E]/90 backdrop-blur-md border border-[#D8A85E]/40 rounded-full p-0.5 shadow-md pointer-events-auto";

  return (
    <div className={containerClasses}>
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs transition-all ${lang.font} ${
              isActive
                ? 'bg-gradient-to-r from-[#D8A85E] to-[#B38136] text-[#170E14] font-bold shadow-sm'
                : 'text-[#DFBE95] hover:text-[#FFEDBA]'
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
