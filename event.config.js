import bgMusic from "./src/assets/music/background-music.mp3";

/**
 * EVENT CONFIGURATION
 * All event details for Vraj & Pooja's Ring Ceremony.
 * Edit this file to update names, date, venue, contacts, or translations.
 */

export const eventConfig = {
  // Background Music
  music: bgMusic,

  // Monogram & Title
  monogram: "V & P",
  monogramImage: "/vp-monogram.png",
  monogramTitle: "Vraj & Pooja",

  // Couple & Parents Information
  groom: {
    name: "Vraj",
    fullName: "Vraj",
    parents: "Rekha Kuwar & Prakash singhji",
    grandparentsLine: "Shrimati MoriBai, Wife of Shri Dhansinghji Rajpurohit (Native: Chunda)",
    grandparents: {
      relation: "Grandson of",
      grandmother: "Shrimati MoriBai",
      grandfather: "Shri Dhansinghji Rajpurohit",
      nativePlace: "Chunda",
      fullText: "Grandson of Shrimati MoriBai, Wife of Shri Dhansinghji Rajpurohit (Native: Chunda)",
    },
  },
  bride: {
    name: "Pooja (Jiya)",
    fullName: "Pooja (Jiya)",
    parents: "Seema Kuwar & Parvat singhji",
    grandLabel: "Granddaughter of",
    grandparentsLine: "Shrimati  SukhiBai, Wife of Shri Deep Singhji Rajpurohit (Native: Bhachunda)",
    grandparents: {
      relation: "Granddaughter of",
      grandmother: "Shrimati  SukhiBai",
      grandfather: "Shri Deep Singhji Rajpurohit",
      nativePlace: "Bhachunda",
      fullText: "Granddaughter of Shrimati  SukhiBai, Wife of Shri Deep Singhji Rajpurohit (Native: Bhachunda)",
    },
  },
  ceremony: "Ring Ceremony",
  heroPillText: "Sagai - Dastur",
  hero: {
    blessingLine: "With the Immense Grace of Shri Kuldevi Khimaj Mataji, We Have",
  },
  heroBlessingLine: "With the Immense Grace of Shri Kuldevi Khimaj Mataji, We Have",
  subtitle: "Engagement Celebration",

  // Couple alias for backward compatibility
  couple: {
    groom: "Vraj",
    bride: "Pooja (Jiya)",
    groomFullName: "Vraj",
    brideFullName: "Pooja (Jiya)",
    monogram: "V & P",
    monogramTitle: "Vraj & Pooja",
    ceremony: "Ring Ceremony",
    heroPillText: "Sagai - Dastur",
    heroBlessingLine: "With the Immense Grace of Shri Kuldevi Khimaj Mataji, We Have",
    subtitle: "Engagement Celebration",
  },

  // Top Blessing Lines (shown above the envelope and in Hero card)
  blessings: {
    en: [
      "Shree Ganeshay Namah",
      "Shree Khimaj Matay Namah",
      "Shree Kheteshwaray Namah",
    ],
    hi: [
      "श्री गणेशाय नमः",
      "श्री खिमज माताय नमः",
      "श्री खेतेश्वराय नमः",
    ],
    gu: [
      "શ્રી ગણેશાય નમઃ",
      "શ્રી ખીમજ માતાય નમઃ",
      "શ્રી ખેતેશ્વરાય નમઃ",
    ],
  },

  // Date and Time
  dateTime: {
    // 6 December 2026, 4:00 PM IST (UTC+05:30)
    iso: "2026-12-06T16:00:00+05:30",
    dateFormatted: "Sunday, 6 December 2026",
    timeFormatted: "4:00 PM Onwards",
    calendarSummary: "Ring Ceremony of Vraj & Pooja (Jiya)",
    calendarDescription: "You are warmly invited to the Ring Ceremony of Vraj & Pooja (Jiya) at R.K. Royal Banquet & Party Lawn, Science City.",
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
      descEn: "Kindly arrive on time to join the celebrations.",
      descHi: "कृपया समय पर पधारकर उत्सव में सम्मिलित हों।",
      descGu: "કૃપા કરીને સમયસર પધારી ઉત્સવમાં સામેલ થાઓ.",
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

 

  // Family Contacts & RSVP
  contacts: [
    {
      name: "Rekha Kuwar & Prakash singhji",
      nameHi: "रेखा कुंवर & प्रकाश सिंहजी",
      nameGu: "રેખા કુંવર & પ્રકાશ સિંહજી",
      roleEn: "Groom's Family",
      roleHi: "वर पक्ष",
      roleGu: "વર પક્ષ"
    },
    {
      name: "Seema Kuwar & Parvat singhji",
      nameHi: "सीमा कुंवर & पर्वत सिंहजी",
      nameGu: "સીમા કુંવર & પર્વત સિંહજી",
      roleEn: "Bride's Family",
      roleHi: "वधू पक्ष",
      roleGu: "કન્યા પક્ષ",
    },
  ],

  
  // Audio configuration
  audio: {
    src: bgMusic,
    fallbackSynthName: "Soft Shehnai Raag Melody",
    defaultMuted: true,
  },

  // Photo Gallery
  photos: [
    {
      id: 1,
      src: "/photos/photo-1.jpg",
      alt: "Vraj & Pooja (Jiya)",
      caption: "Two souls, one beautiful journey begins",
    },
  ],

  // SEO & Social Sharing
  seo: {
    title: "Ring Ceremony Invitation | Vraj & Pooja (Jiya) - 6 Dec 2026",
    description: "Cordially inviting you to celebrate the Ring Ceremony of Vraj & Pooja (Jiya) on 6 December 2026 at R.K. Royal Banquet & Party Lawn, Science City.",
    url: "https://vraj-pooja-ring-ceremony.com",
    ogImage: "/src/assets/photos/og-preview.jpg",
  },
};

export default eventConfig;
