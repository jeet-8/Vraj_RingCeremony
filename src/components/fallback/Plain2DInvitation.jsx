import React from 'react';
import HeroCard from '../invitation/HeroCard';
import CountdownCard from '../invitation/CountdownCard';
import PhotoGalleryCard from '../invitation/PhotoGalleryCard';
import VenueCard from '../invitation/VenueCard';
import ScheduleCard from '../invitation/ScheduleCard';
import DressCodeCard from '../invitation/DressCodeCard';
import ContactsAndRsvpCard from '../invitation/ContactsAndRsvpCard';
import FooterCard from '../invitation/FooterCard';

export default function Plain2DInvitation({ guestName, onSwitchTo3D }) {
  return (
    <div className="min-h-screen bg-royal-gradient text-[#FDF8F5] py-8 px-4 flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 pt-2">
        <span className="font-display text-sm tracking-widest text-[#D8A85E]">
          ✦ VRAJ &amp; JIYA ✦
        </span>
        {onSwitchTo3D && (
          <button
            onClick={onSwitchTo3D}
            className="px-3 py-1 rounded-full bg-[#24141E] border border-[#D8A85E]/50 text-xs font-serif text-[#FFEDBA] hover:bg-[#321B2B] transition-all"
          >
            ✨ Switch to 3D View
          </button>
        )}
      </div>

      {/* Main Column */}
      <main className="w-full max-w-md flex flex-col items-center">
        <HeroCard guestName={guestName} />
        <CountdownCard />
        <PhotoGalleryCard />
        <VenueCard />
        <ScheduleCard />
        <DressCodeCard />
        <ContactsAndRsvpCard guestName={guestName} />
        <FooterCard onSwitchToSimple={null} onReopen={onSwitchTo3D} />
      </main>
    </div>
  );
}
