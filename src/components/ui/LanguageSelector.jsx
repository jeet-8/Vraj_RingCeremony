import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
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

  return (
    <div className="fixed top-4 left-4 z-40 flex items-center bg-[#24141E]/80 backdrop-blur-md border border-[#D8A85E]/40 rounded-full p-1 shadow-lg">
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-2.5 py-1 rounded-full text-xs transition-all ${lang.font} ${
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
