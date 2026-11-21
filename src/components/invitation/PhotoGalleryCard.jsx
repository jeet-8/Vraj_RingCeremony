import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import eventConfig from '../../../event.config.js';
import ScratchArchCanvas from './ScratchArchCanvas';

// Fallback resolver for any bundled photos or static root paths
const bundledPhotos = import.meta.glob('/src/assets/photos/*', { eager: true, import: 'default' });

function resolvePhotoSrc(src) {
  if (!src) return '/photos/photo-1.jpg';
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
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [revealedPhotos, setRevealedPhotos] = useState({});
  const [imageLoadedMap, setImageLoadedMap] = useState({});
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const photos = eventConfig.photos || [];
  const currentPhoto = photos[0] || {
    id: 1,
    src: '/photos/photo-1.jpg',
    alt: 'Vraj & Pooja (Jiya)',
    caption: 'Two souls, one beautiful journey begins',
  };

  const currentPhotoSrc = resolvePhotoSrc(currentPhoto.src);
  const isCurrentRevealed = !!revealedPhotos[currentPhoto.id];

  const handlePhotoRevealed = useCallback((photoId) => {
    setRevealedPhotos((prev) => ({
      ...prev,
      [photoId]: true,
    }));
  }, []);

  const handleRevealAll = useCallback(() => {
    const allRevealed = {};
    photos.forEach((p) => {
      allRevealed[p.id] = true;
    });
    setRevealedPhotos(allRevealed);
  }, [photos]);

  
  const currentLang = i18n.language || 'en';
  const fontClass =
    currentLang === 'hi'
      ? 'font-hindi'
      : currentLang === 'gu'
      ? 'font-gujarati'
      : 'font-serif';

  return (
    <div className="relative w-full max-w-md mx-auto paper-card rounded-2xl p-5 sm:p-6 shadow-xl border border-[#D8A85E]/30 mb-8 overflow-hidden select-none">
      {/* Title */}
      <div className="text-center mb-4">
        <h3 className={`${fontClass} text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#8E5164]`}>
          {t('photo.title')}
        </h3>
        <p className="font-script text-2xl text-[#4A1224] mt-0.5">
          {t('photo.subtitle')}
        </p>
      </div>

      {/* Arched Photo Frame (Clips photo & scratch canvas with same arch radius) */}
      <div
        className={`relative mx-auto w-full max-w-[310px] aspect-[4/5] rounded-t-[140px] rounded-b-xl overflow-hidden border-4 border-[#D8A85E]/60 shadow-2xl bg-[#1A0E17] group ${
          isCurrentRevealed ? 'cursor-pointer' : 'cursor-crosshair'
        }`}
        onClick={() => {
          if (isCurrentRevealed) {
            setSelectedPhoto({ ...currentPhoto, resolvedSrc: currentPhotoSrc });
            setLightboxZoom(1);
          }
        }}
      >
        {/* Soft Skeleton Shimmer until image loads */}
        {!imageLoadedMap[currentPhoto.id] && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#24141E] via-[#3D1E2D] to-[#24141E] animate-pulse z-0 flex items-center justify-center">
            <span className="text-[#D8A85E]/40 text-2xl animate-spin">✦</span>
          </div>
        )}

        {/* Normal HTML <img> under the scratch layer */}
        <img
          key={currentPhotoSrc}
          src={currentPhotoSrc}
          alt={currentPhoto.alt}
          loading="eager"
          onLoad={() => {
            setImageLoadedMap((prev) => ({ ...prev, [currentPhoto.id]: true }));
          }}
          onError={(e) => {
            if (!e.currentTarget.dataset.retried) {
              e.currentTarget.dataset.retried = 'true';
              e.currentTarget.src = '/photos/couple.jpg';
            }
          }}
          className={`w-full h-full object-cover object-[center_30%] transition-transform duration-500 z-10 ${
            isCurrentRevealed ? 'group-hover:scale-105' : ''
          }`}
        />

        {/* Interactive Scratch-to-Reveal Foil Layer */}
        <ScratchArchCanvas
          key={`scratch-${currentPhoto.id}`}
          isRevealed={isCurrentRevealed}
          onReveal={() => handlePhotoRevealed(currentPhoto.id)}
          hintText={t('photo.scratchHint')}
        />

        {/* Subtle Bottom Gold Vignette & Indicator */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-25 bg-gradient-to-t from-[#2B0A15]/90 via-[#2B0A15]/40 to-transparent flex items-end justify-center p-3.5">
          <div className="text-center">
            <p className="font-serif italic text-xs text-[#FFEDBA] drop-shadow">
              {currentPhoto.caption}
            </p>
            <span className="text-[10px] text-[#DFBE95] tracking-widest uppercase font-serif mt-1 inline-block opacity-90 drop-shadow">
              {isCurrentRevealed ? t('photo.tapToEnlarge') : `✨ ${t('photo.scratchHint')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Accessible Reveal Button */}
      {!isCurrentRevealed && (
        <div className="flex justify-center mt-3">
          <button
            type="button"
            onClick={handleRevealAll}
            className="px-4 py-1.5 rounded-full bg-[#24141E]/80 hover:bg-[#341C2C] border border-[#D8A85E]/50 text-[#FFEDBA] text-xs font-serif font-medium tracking-wide flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            aria-label={t('photo.revealPhoto', t('photo.revealAll', 'Reveal photo'))}
          >
            <span>✨</span>
            <span>{t('photo.revealPhoto', t('photo.revealAll', 'Reveal photo'))}</span>
          </button>
        </div>
      )}

      {/* Lightbox Modal with Zoom & Close Button */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full rounded-2xl overflow-hidden border-2 border-[#D8A85E] shadow-2xl bg-[#1A0E17]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo View with Zoom Toggle */}
              <div
                className="overflow-hidden flex items-center justify-center max-h-[72vh] bg-[#170E14] cursor-zoom-in"
                onClick={() => setLightboxZoom((z) => (z === 1 ? 1.75 : 1))}
              >
                <img
                  src={selectedPhoto.resolvedSrc || resolvePhotoSrc(selectedPhoto.src)}
                  alt={selectedPhoto.alt}
                  style={{
                    transform: `scale(${lightboxZoom})`,
                    transition: 'transform 300ms ease-out',
                  }}
                  onError={(e) => {
                    if (!e.currentTarget.dataset.retried) {
                      e.currentTarget.dataset.retried = 'true';
                      e.currentTarget.src = '/photos/couple.jpg';
                    }
                  }}
                  className="w-full max-h-[72vh] object-contain"
                />
              </div>

              {/* Lightbox Footer Bar */}
              <div className="p-4 flex items-center justify-between bg-[#24141E] border-t border-[#D8A85E]/30">
                <div>
                  <p className="font-serif italic text-xs sm:text-sm text-[#FFEDBA]">
                    {selectedPhoto.caption}
                  </p>
                  <p className="font-serif text-[10px] text-[#DFBE95] opacity-75 mt-0.5">
                    {lightboxZoom > 1 ? 'Tap photo to zoom out' : 'Tap photo to zoom in'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="min-w-[44px] min-h-[44px] px-4 py-2 rounded-full bg-[#D8A85E] hover:bg-[#E8CD96] text-[#170E14] font-serif font-semibold text-xs tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
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
