/**
 * EVENT CONFIGURATION
 * All event details for Vraj & Jiya's Ring Ceremony.
 * Edit this file to update names, date, venue, contacts, or translations.
 */

export const eventConfig = {
  // Couple Information
  couple: {
    groom: "Vraj",
    bride: "Jiya (Pooja)",
    groomFullName: "Vraj",
    brideFullName: "Jiya (Pooja)",
    monogram: "V & J",
    monogramTitle: "Vraj & Jiya",
    ceremony: "Ring Ceremony",
    subtitle: "Engagement Celebration",
  },

  // Family Information
  families: {
    groomParents: "Rekha Kanwer & Prakashsinghji",
    brideParents: "Seema Kanwer & Parvatsinghji",
    blessingQuote: "With the divine blessings of our beloved elders and ancestors, we cordially invite you to celebrate the joyous Ring Ceremony of our children.",
  },

  // Top Blessing Lines (shown above the envelope and in Hero card)
  blessings: {
    en: [
      "Shree Khimaj Mata Namah",
      "Shree Ganeshay Namah",
      "Shree Kheteshwar Namah",
    ],
    hi: [
      "श्री खिमज माता नमः",
      "श्री गणेशाय नमः",
      "श्री खेतेश्वर नमः",
    ],
    gu: [
      "શ્રી ખીમજ માતા નમઃ",
      "શ્રી ગણેશાય નમઃ",
      "શ્રી ખેતેશ્વર નમઃ",
    ],
  },

  // Date and Time
  dateTime: {
    // 6 December 2026, 4:00 PM IST (UTC+05:30)
    iso: "2026-12-06T16:00:00+05:30",
    dateFormatted: "Sunday, 6 December 2026",
    timeFormatted: "4:00 PM Onwards",
    calendarSummary: "Ring Ceremony of Vraj & Jiya (Pooja)",
    calendarDescription: "You are warmly invited to the Ring Ceremony of Vraj & Jiya (Pooja) at R.K. Royal Banquet & Party Lawn, Science City.",
    targetYear: 2026,
    targetMonth: 12, // 1-indexed
    targetDay: 6,
    targetHour: 16,
    targetMinute: 0,
  },

  // Venue Information
  venue: {
    name: "R.K. Royal Banquet & Party Lawn",
    landmark: "Science City",
    city: "Ahmedabad, Gujarat",
    fullAddress: "R.K. Royal Banquet & Party Lawn, Science City, Ahmedabad, Gujarat",
    googleMapsUrl: "https://share.google/SWki02Fxf0gKUxKCN",
    embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14682.478985116792!2d72.5028!3d23.078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9cc22b6a71ab%3A0xc391b1a7ea39be7a!2sScience%20City%2C%20Ahmedabad!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },

  // Schedule Timeline
  schedule: [
    {
      time: "4:00 PM",
      titleEn: "Arrival & Welcome",
      titleHi: "आगमन एवं स्वागत",
      titleGu: "આગમન અને સ્વાગત",
      descEn: "Traditional welcome with dhol, shehnai, and royal refreshments.",
      descHi: "ढोल, शहनाई और शाही स्वागत अल्पाहार के साथ।",
      descGu: "ઢોલ, શરણાઈ અને શાહી સ્વાગત અલ્પાહાર સાથે.",
      icon: "sparkles",
    },
    {
      time: "5:30 PM",
      titleEn: "Ring Ceremony & Blessings",
      titleHi: "अंगूठी दस्तूर एवं आशीर्वाद",
      titleGu: "વીંટી સમારોહ અને આશીર્વાદ",
      descEn: "Exchange of rings accompanied by heartfelt rituals and blessings.",
      descHi: "पारंपरिक रीति-रिवाजों और आशीर्वाद के साथ अंगूठी विनिमय।",
      descGu: "પરંપરાગત રીતિ-રિવાજો અને આશીર્વાદ સાથે વીંટી બદલાવ.",
      icon: "heart",
    },
    {
      time: "7:00 PM",
      titleEn: "Celebrations & Royal Feast",
      titleHi: "उत्सव एवं शाही प्रीतिभोज",
      titleGu: "ઉત્સવ અને શાહી પ્રીતિભોજન",
      descEn: "Musical celebration, photographs, and lavish banquet dinner.",
      descHi: "मधुर संगीत, छायाचित्र और भव्य प्रीतिभोज।",
      descGu: "સંગીતમય ઉત્સવ, સ્મૃતિચિત્રો અને ભવ્ય શાહી ભોજન.",
      icon: "utensils",
    },
  ],

  // Dress Code
  dressCode: {
    titleEn: "Royal Traditional & Pastel Elegance",
    titleHi: "शाही पारंपरिक एवं पेस्टल परिधान",
    titleGu: "શાહી પરંપરાગત અને પેસ્ટલ પોશાક",
    descEn: "Indian Traditional or Indo-Western attire in delicate pastel shades and champagne tones.",
    descHi: "मनमोहक पेस्टल और शैम्पेन रंगों में भारतीय पारंपरिक या इंडो-वेस्टर्न परिधान।",
    descGu: "સુંદર પેસ્ટલ અને શેમ્પેઈન રંગોમાં ભારતીય પરંપરાગત અથવા ઇન્ડો-વેસ્ટર્ન પોશાક.",
    palette: [
      { name: "Champagne Gold", hex: "#E5C392", textColor: "#442b15" },
      { name: "Blush Rose", hex: "#E8B4B8", textColor: "#4a1e27" },
      { name: "Dusty Mauve", hex: "#A87C8A", textColor: "#ffffff" },
      { name: "Royal Ivory", hex: "#FDFBF7", textColor: "#503827" },
      { name: "Soft Mint", hex: "#D4E2D4", textColor: "#203a27" },
    ],
  },

  // Family Contacts & RSVP
  contacts: [
    {
      name: "Rekha Kanwer & Prakashsinghji",
      roleEn: "Groom's Family",
      roleHi: "वर पक्ष",
      roleGu: "વર પક્ષ",
      phone: "+919876543210",
      displayPhone: "+91 98765 43210",
      whatsapp: "919876543210",
    },
    {
      name: "Seema Kanwer & Parvatsinghji",
      roleEn: "Bride's Family",
      roleHi: "वधू पक्ष",
      roleGu: "કન્યા પક્ષ",
      phone: "+919876543211",
      displayPhone: "+91 98765 43211",
      whatsapp: "919876543211",
    },
  ],

  // WhatsApp RSVP default number (primary contact)
  rsvpWhatsappNumber: "919876543210",

  // Audio configuration
  audio: {
    src: "/src/assets/music/music.mp3",
    fallbackSynthName: "Soft Shehnai Raag Melody",
    defaultMuted: true,
  },

  // Photo Gallery placeholders
  photos: [
    {
      id: 1,
      src: "/src/assets/photos/couple-1.svg",
      alt: "Vraj & Jiya (Pooja) - Engagement Portrait",
      caption: "Two souls, one beautiful journey begins",
    },
    {
      id: 2,
      src: "/src/assets/photos/couple-2.svg",
      alt: "Vraj & Jiya (Pooja) - Romantic Moment",
      caption: "Together is a wonderful place to be",
    },
    {
      id: 3,
      src: "/src/assets/photos/couple-3.svg",
      alt: "Vraj & Jiya (Pooja) - Ring Exchange Preview",
      caption: "A promise of forever sealed with love",
    },
  ],

  // SEO & Social Sharing
  seo: {
    title: "Ring Ceremony Invitation | Vraj & Jiya (Pooja) - 6 Dec 2026",
    description: "Cordially inviting you to celebrate the Ring Ceremony of Vraj & Jiya (Pooja) on 6 December 2026 at R.K. Royal Banquet & Party Lawn, Science City.",
    url: "https://vraj-jiya-ring-ceremony.com",
    ogImage: "/src/assets/photos/og-preview.jpg",
  },
};

export default eventConfig;
