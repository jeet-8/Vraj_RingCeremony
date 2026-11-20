import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';

// Eagerly resolve any photos located in src/assets/photos via Vite
const bundledPhotos = import.meta.glob('/src/assets/photos/*', { eager: true, import: 'default' });

function resolvePhotoSrc(src) {
  if (!src) return '/photos/couple.jpg';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  if (bundledPhotos[src]) {
    return bundledPhotos[src];
  }
  const cleanName = src.split('/').pop();
  for (const [path, url] of Object.entries(bundledPhotos)) {
    if (path.endsWith(cleanName)) {
      return url;
    }
  }
  return src;
}

export default function PhotoGalleryCard() {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const photos = eventConfig.photos;

  const nextPhoto = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const currentPhoto = photos[currentIndex];
  const currentPhotoSrc = resolvePhotoSrc(currentPhoto.src);

  const currentLang = i18n.language || 'en';
  const fontClass = currentLang === 'hi' 
    ? 'font-hindi' 
    : currentLang === 'gu' 
    ? 'font-gujarati' 
    : 'font-serif';

  return (
    <div className="relative w-full max-w-md mx-auto paper-card rounded-2xl p-6 shadow-xl border border-[#D8A85E]/30 mb-8 overflow-hidden">
      {/* Title */}
      <div className="text-center mb-4">
        <h3 className={`${fontClass} text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#8E5164]`}>
          {t('photo.title')}
        </h3>
        <p className="font-script text-2xl text-[#4A1224] mt-0.5">
          {t('photo.subtitle')}
        </p>
      </div>

      {/* Arched Photo Frame */}
      <div className="relative mx-auto w-full max-w-[320px] aspect-[4/5] rounded-t-[140px] rounded-b-xl overflow-hidden border-4 border-[#D8A85E]/60 shadow-2xl bg-[#1A0E17] group cursor-pointer"
        onClick={() => setSelectedPhoto({ ...currentPhoto, resolvedSrc: currentPhotoSrc })}
      >
        <img
          src={currentPhotoSrc}
          alt={currentPhoto.alt}
          onError={(e) => {
            if (!e.currentTarget.dataset.retried) {
              e.currentTarget.dataset.retried = 'true';
              e.currentTarget.src = '/photos/couple.jpg';
            }
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Subtle Gold Vignette & Tap to Enlarge Indicator */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B0A15]/80 via-transparent to-transparent flex items-end justify-center p-4">
          <div className="text-center">
            <p className="font-serif italic text-xs text-[#FFEDBA]">
              {currentPhoto.caption}
            </p>
           
          </div>
        </div>

        {/* Carousel Navigation Arrows (only if multiple photos) */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#24141E]/70 hover:bg-[#24141E] text-[#FFEDBA] flex items-center justify-center border border-[#D8A85E]/40 text-xs backdrop-blur-sm transition-all"
              aria-label="Previous photo"
            >
              ‹
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#24141E]/70 hover:bg-[#24141E] text-[#FFEDBA] flex items-center justify-center border border-[#D8A85E]/40 text-xs backdrop-blur-sm transition-all"
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {photos.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-[#B38136] scale-125'
                  : 'bg-[#D8A85E]/40 hover:bg-[#D8A85E]/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full rounded-2xl overflow-hidden border-2 border-[#D8A85E] shadow-2xl bg-[#1A0E17]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.resolvedSrc || resolvePhotoSrc(selectedPhoto.src)}
                alt={selectedPhoto.alt}
                onError={(e) => {
                  if (!e.currentTarget.dataset.retried) {
                    e.currentTarget.dataset.retried = 'true';
                    e.currentTarget.src = '/photos/couple.jpg';
                  }
                }}
                className="w-full max-h-[75vh] object-contain bg-[#170E14]"
              />
              <div className="p-4 text-center bg-[#24141E] border-t border-[#D8A85E]/30">
                <p className="font-serif italic text-sm text-[#FFEDBA]">
                  {selectedPhoto.caption}
                </p>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="mt-3 px-4 py-1.5 rounded-full bg-[#D8A85E] text-[#170E14] font-serif font-semibold text-xs tracking-wider"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
