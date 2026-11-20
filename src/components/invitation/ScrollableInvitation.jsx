import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import HeroCard from './HeroCard';
import CountdownCard from './CountdownCard';
import PhotoGalleryCard from './PhotoGalleryCard';
import VenueCard from './VenueCard';
import ScheduleCard from './ScheduleCard';
import DressCodeCard from './DressCodeCard';
import ContactsAndRsvpCard from './ContactsAndRsvpCard';
import FooterCard from './FooterCard';

export default function ScrollableInvitation({ guestName, onReopen, onSwitchToSimple }) {
  const scrollContainerRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    let lenis;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis smooth scroll initialization skipped:', e);
    }

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <motion.div
      ref={scrollContainerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="relative min-h-[100dvh] w-full bg-royal-gradient flex flex-col items-center py-6 px-4 sm:px-6"
    >
      {/* Centered Phone-Width Container (390x844 responsive, max-w-md on desktop) */}
      <main className="w-full max-w-[420px] flex flex-col items-center mx-auto z-10 pt-4">
        {/* 1. Hero Card */}
        <HeroCard guestName={guestName} />

        {/* 2. Live Countdown */}
        <CountdownCard />

        {/* 3. Photo Gallery with Arched Frame */}
        <PhotoGalleryCard />

        {/* 4. Venue & Maps */}
        <VenueCard />

        {/* 5. Schedule Timeline */}
        <ScheduleCard />

        {/* 6. Dress Code */}
        <DressCodeCard />

        {/* 7. Family Contacts & WhatsApp RSVP */}
        <ContactsAndRsvpCard guestName={guestName} />

        {/* 8. Footer & Calendar */}
        <FooterCard onReopen={onReopen} onSwitchToSimple={onSwitchToSimple} />
      </main>
    </motion.div>
  );
}
