import React from 'react';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';

export default function ContactsAndRsvpCard({ guestName }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

  // Build WhatsApp RSVP prefilled message
  const rsvpName = guestName || (currentLang === 'hi' ? 'हम' : currentLang === 'gu' ? 'અમે' : 'We');
  const rawRsvpMsg = t('rsvp.whatsappMessage', { guestName: rsvpName });
  const encodedRsvpMsg = encodeURIComponent(rawRsvpMsg);
  const whatsappRsvpUrl = `https://wa.me/${eventConfig.rsvpWhatsappNumber}?text=${encodedRsvpMsg}`;

  return (
    <div className="relative w-full max-w-md mx-auto paper-card rounded-2xl p-6 shadow-xl border border-[#D8A85E]/30 mb-8 overflow-hidden text-center">
      {/* Blessings Note */}
      <div className="py-4 border-b border-[#D8A85E]/20 mb-6">
        <span className="text-2xl">🙏</span>
        <blockquote className={`${fontClass} italic text-sm sm:text-base text-[#4A1224] mt-2 px-2 font-medium leading-relaxed`}>
          "{t('blessingsNote.quote')}"
        </blockquote>
      </div>

      {/* RSVP Section */}
      <div className="mb-6">
        <h3 className={`${fontClass} text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#8E5164]`}>
          {t('rsvp.title')}
        </h3>
        <p className="font-serif text-xs text-[#8E5164] mt-0.5 mb-4">
          {t('contacts.subtitle')}
        </p>

        {/* WhatsApp Confirm RSVP Button */}
        <div className="flex flex-col gap-3">
          <a
            href={whatsappRsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-serif font-bold text-sm tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="text-lg">💬</span>
            <span>{t('rsvp.confirmWhatsapp')}</span>
          </a>

          <a
            href={`tel:${eventConfig.contacts[0].phone}`}
            className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-[#FAF0E1] border border-[#D8A85E]/60 text-[#4A1224] font-serif font-semibold text-sm hover:bg-[#F3E3CE] transition-all"
          >
            <span>📞</span>
            <span>{t('rsvp.callHost')} ({eventConfig.contacts[0].name.split('&')[1]?.trim() || eventConfig.contacts[0].name})</span>
          </a>
        </div>
      </div>

      {/* Family Contacts Grid */}
      <div className="pt-4 border-t border-[#D8A85E]/20 text-left">
        <h4 className={`${fontClass} text-xs font-semibold tracking-wider uppercase text-[#8E5164] text-center mb-3`}>
          {t('contacts.title')}
        </h4>

        <div className="space-y-3">
          {eventConfig.contacts.map((contact, idx) => {
            const role = currentLang === 'hi' 
              ? contact.roleHi 
              : currentLang === 'gu' 
              ? contact.roleGu 
              : contact.roleEn;

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAF0E1]/60 border border-[#D8A85E]/20"
              >
                <div>
                  <p className="font-serif text-xs font-bold text-[#4A1224]">
                    {contact.name}
                  </p>
                  <p className="text-[11px] text-[#8E5164] font-serif">
                    {role} • {contact.displayPhone}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Namaste!')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/30 text-[#128C7E] text-sm"
                    title="WhatsApp"
                  >
                    💬
                  </a>
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2 rounded-full bg-[#D8A85E]/20 hover:bg-[#D8A85E]/40 text-[#4A1224] text-sm"
                    title="Call"
                  >
                    📞
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
