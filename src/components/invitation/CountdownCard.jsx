import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';

export default function CountdownCard() {
  const { t, i18n } = useTranslation();
  const targetDate = new Date(eventConfig.dateTime.iso).getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isComplete: false });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const currentLang = i18n.language || 'en';
  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

  return (
    <div className="relative w-full max-w-md mx-auto paper-card rounded-2xl p-6 shadow-xl border border-[#D8A85E]/30 text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-[#B38136] text-xs">✦</span>
        <h3 className={`${fontClass} text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#8E5164]`}>
          {t('countdown.title')}
        </h3>
        <span className="text-[#B38136] text-xs">✦</span>
      </div>

      {timeLeft.isComplete ? (
        <div className="py-4">
          <p className="font-display text-xl text-[#B38136] font-bold">
            {t('countdown.arrived')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-3 my-2">
          {/* Days */}
          <div className="bg-[#FAF0E1] border border-[#D8A85E]/40 rounded-xl p-2.5 sm:p-3 shadow-inner">
            <span className="block font-display text-2xl sm:text-3xl font-bold text-[#4A1224]">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className={`${fontClass} block text-[10px] sm:text-xs text-[#8E5164] uppercase tracking-wider mt-1`}>
              {t('countdown.days')}
            </span>
          </div>

          {/* Hours */}
          <div className="bg-[#FAF0E1] border border-[#D8A85E]/40 rounded-xl p-2.5 sm:p-3 shadow-inner">
            <span className="block font-display text-2xl sm:text-3xl font-bold text-[#4A1224]">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className={`${fontClass} block text-[10px] sm:text-xs text-[#8E5164] uppercase tracking-wider mt-1`}>
              {t('countdown.hours')}
            </span>
          </div>

          {/* Minutes */}
          <div className="bg-[#FAF0E1] border border-[#D8A85E]/40 rounded-xl p-2.5 sm:p-3 shadow-inner">
            <span className="block font-display text-2xl sm:text-3xl font-bold text-[#4A1224]">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className={`${fontClass} block text-[10px] sm:text-xs text-[#8E5164] uppercase tracking-wider mt-1`}>
              {t('countdown.minutes')}
            </span>
          </div>

          {/* Seconds */}
          <div className="bg-[#FAF0E1] border border-[#D8A85E]/40 rounded-xl p-2.5 sm:p-3 shadow-inner">
            <span className="block font-display text-2xl sm:text-3xl font-bold text-[#B38136]">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className={`${fontClass} block text-[10px] sm:text-xs text-[#8E5164] uppercase tracking-wider mt-1`}>
              {t('countdown.seconds')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
