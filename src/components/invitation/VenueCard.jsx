import React from 'react';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';

export default function VenueCard() {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || 'hi';
  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

  return (
    <div className="relative w-full max-w-md mx-auto paper-card rounded-2xl p-6 shadow-xl border border-[#D8A85E]/30 mb-8 overflow-hidden">
      {/* Venue Header */}
      <div className="text-center mb-4">
        <span className="text-2xl">🏛️</span>
        <h3 className={`${fontClass} text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#8E5164] mt-1`}>
          {t('venue.title')}
        </h3>
        <h2 className="font-display text-lg sm:text-xl font-bold text-[#4A1224] mt-1">
          {eventConfig.venue.name}
        </h2>
        <p className="font-serif text-xs sm:text-sm text-[#8E5164] mt-0.5">
          {eventConfig.venue.landmark}, {eventConfig.venue.city}
        </p>
      </div>

      {/* Embedded Map / Visual Map Card */}
      <div className="w-full h-48 rounded-xl overflow-hidden border border-[#D8A85E]/40 my-4 shadow-inner relative bg-[#EFE7DE]">
        <iframe
          title="Venue Location Map"
          src={eventConfig.venue.embedMapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-4">
        <a
          href={eventConfig.venue.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#D8A85E] via-[#FFEDBA] to-[#B38136] text-[#170E14] font-serif font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>📍</span>
          <span>{t('venue.openMaps')}</span>
        </a>
      </div>
    </div>
  );
}
