# 💍 Vraj & Pooja (Jiya) — Ring Ceremony 3D Digital Invitation

A luxury, mobile-first, 3D interactive digital invitation website for the Ring Ceremony (Engagement) of **Vraj & Pooja (Jiya)**. Built with React 18, Vite, React Three Fiber, Three.js, GSAP, Framer Motion, Tailwind CSS, Lenis, and i18next.

---

## 🌟 Key Features

1. **Top Blessing Lines (English, Hindi & Gujarati):**
   - Centered above the envelope with safe-area notch insets.
   - Exact lines:
     - `Shree Ganeshay Namah` (श्री गणेशाय नमः / શ્રી ગણેશાય નમઃ)
     - `Shree Khimaj Mata Namah` (श्री खिमज माता नमः / શ્રી ખીમજ માતા નમઃ)
     - `Shree Kheteshwaray Namah` (श्री खेतेश्वराय नमः / શ્રી ખેતેશ્વરાય નમઃ)
   - Champagne-gold foil sheen with soft glow and staggered 0.4s fade-in.
   - Repeated at the top of the Hero card in the scrollable invitation.
2. **Scene A: Sealed 3D Envelope:**
   - Custom geometry envelope with blush-mauve/champagne paper relief.
   - Procedural floral embossed normal map (`createEmbossedFloralNormalTexture`).
   - Lathe wax seal with embossed **"V & P"** monogram.
   - Parallax gyroscope tilt on mobile (with iOS permission request) and mouse tilt on desktop (max 8°).
   - Sweeping specular sheen and pulsing hint: *"Tap the seal to open"*.
3. **Scene B: 6-Second Opening Animation (GSAP):**
   - **0.0s:** Blessing lines fade out; wax seal pulses and fractures into 8 radial fragments that tumble away.
   - **1.0s:** Satin gold ribbon untwists and slides off.
   - **1.6s:** Bottom and side flaps unfold in sequence.
   - **2.6s:** Top flap swings open ~160° with spring overshoot.
   - **3.2s:** Card emerges upward as camera dollies in.
   - **4.5s:** Card expands to fill viewport, soft light flash.
   - **5.5s:** Scrollable invitation fades in; celebration shehnai audio begins playing.
   - Includes instant **"Skip intro"** button and **"Reopen Envelope"** action.
4. **Scene C: Scrollable Luxury Invitation (Embossed Paper Aesthetic):**
   - Lenis smooth momentum scrolling.
   - Mobile-first (390×844 responsive, centered phone-width column on desktop).
   - **Hero Card:** Personalized greeting, elder blessings, parents' names, couple names in script font.
   - **Live Countdown:** Real-time countdown to **6 December 2026, 4:00 PM IST** in an ornate gold frame.
   - **Photo Gallery:** Arched floral frame with multi-photo carousel and tap-to-enlarge lightbox modal.
   - **Venue & Map:** Palace illustration, full address, direct *"Open in Google Maps"* button, and interactive map preview.
   - **Royal Timeline:** Vertical schedule with decorative borders (Arrival, Ring Exchange, Royal Feast).
   - **Dress Code:** Royal Traditional & Pastel Elegance with interactive color swatches.
   - **Family Contacts & RSVP:** One-tap WhatsApp confirmation with dynamic prefilled message and direct call buttons.
   - **Footer:** Monogram, *"Add to Calendar"* (Google Calendar link + `.ics` download), Share button (WhatsApp/Web Share), and floating Audio Mute/Unmute control.
5. **Multi-Language Support (EN / हिन्दी / ગુજરાતી):**
   - Instant language toggle using Noto Serif Devanagari and Noto Serif Gujarati web fonts.
6. **No Backend / 100% Client-Side:**
   - Personalized guest URL query strings (`?guest=Rahul-and-family`).
   - Client-side WhatsApp message generation with phone number and guest name.
   - Client-side `.ics` iCalendar file generator and Google Calendar URL.
7. **Cross-Device & Fallback Tiers:**
   - **Tier 1:** Full 3D WebGL (R3F, normal maps, sheen, particles).
   - **Tier 2:** Lite 3D (optimized for mid-range devices).
   - **Tier 3:** High-end pure CSS 3D/2D animated envelope with the exact same timing.
   - **Plain 2D Version:** Accessible anytime via `?mode=plain` or footer link.
   - Auto-recovery: React ErrorBoundary catches any WebGL context loss and falls back to Tier 3.
   - In-app browser detection banner (WhatsApp / Instagram / Facebook in-app browser).
   - Accessible `<noscript>` markup with full event details for zero-JS browsers and search engines.

---

## 🚀 Quick Start & Development

### Prerequisites
- Node.js 18+ (tested on Node v24.18.0)
- npm or pnpm

### Installation
```bash
# Clone the repository and navigate to the project directory
cd "d:\Vraj ring ceremony"

# Install dependencies
npm install
```

### Run Locally (Dev Server)
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build & Preview
```bash
# Build production bundle (optimized & code-split)
npm run build

# Preview production build locally
npm run preview
```

---

## ⚙️ How to Customize Event Details (`event.config.js`)

All event details are centralized in `event.config.js` in the project root:

```javascript
export const eventConfig = {
  // Couple & Parents Information
  groom: {
    name: "Vraj",
    parents: "Rekha Kuwar & Prakash singhji",
  },
  bride: {
    name: "Pooja (Jiya)",
    parents: "Seema Kuwar & Parvat singhji",
  },
  monogram: "V & P",
  ceremony: "Ring Ceremony",

  // Date and Time (6 December 2026, 4:00 PM IST)
  dateTime: {
    iso: "2026-12-06T16:00:00+05:30",
    dateFormatted: "Sunday, 6 December 2026",
    timeFormatted: "4:00 PM Onwards",
  },

  // Venue & Google Maps
  venue: {
    name: "R.K. Royal Banquet & Party Lawn",
    landmark: "Science City",
    city: "Ahmedabad, Gujarat",
    fullAddress: "R.K. Royal Banquet & Party Lawn, Science City, Ahmedabad, Gujarat",
    googleMapsUrl: "https://share.google/SWki02Fxf0gKUxKCN",
  },

  // Primary WhatsApp Contact for RSVP
  rsvpWhatsappNumber: "919876543210",
  ...
};
```

---

## 📸 How to Replace Photos

The project contains photo placeholders in `/src/assets/photos/` (and `/client/src/assets/photos/`):
- `couple-1.svg` (or `.jpg` / `.png` / `.webp`)
- `couple-2.svg`
- `couple-3.svg`
- `og-preview.jpg` (Used for WhatsApp link preview thumbnail)

### Steps:
1. Copy your photographs into `/src/assets/photos/`.
2. Update the filenames in `event.config.js` under `photos`:
   ```javascript
   photos: [
     { id: 1, src: "/src/assets/photos/your-photo-1.jpg", caption: "Two souls, one journey" },
     { id: 2, src: "/src/assets/photos/your-photo-2.jpg", caption: "Together forever" },
     ...
   ]
   ```
3. Recommended photo format: WebP or JPEG, aspect ratio 4:5 or 3:4, width 800–1200px.

---

## 🎵 How to Replace Music

- Default behavior: The app includes a built-in procedural Web Audio classical Indian Shehnai & Tanpura synthesizer that plays an authentic Raag melody out of the box with zero external dependencies!
- To use your own shehnai / instrumental MP3:
  1. Place your MP3 file at `/src/assets/music/music.mp3` (or `/client/src/assets/music.mp3`).
  2. The sound engine will automatically detect and play your MP3 upon user interaction.

---

## 💌 How to Generate Personalised Guest Links

You can generate custom invitation links for individual guests or families by adding the `?guest=` query parameter:

| Guest Name | URL Link |
|---|---|
| Rahul & family | `https://your-domain.com/?guest=Rahul-and-family` |
| Sharma Family | `https://your-domain.com/?guest=Sharma-Family` |
| Dr. & Mrs. Patel | `https://your-domain.com/?guest=Dr.+and+Mrs.+Patel` |
| Uncle & Aunty | `https://your-domain.com/?guest=Uncle-and-Aunty` |

### What this personalizes:
1. **Hero Card Greeting:** Displays *"Dear [Guest Name] and family,"*.
2. **WhatsApp RSVP:** When the guest clicks *"Confirm on WhatsApp"*, it auto-fills:  
   *"Hi, this is [Guest Name]. We will be attending the Ring Ceremony of Vraj & Pooja (Jiya) on 6 December 2026."*

---

## 📱 Plain 2D Backup Version

For any guests using very old devices or slow connections, send them the plain 2D link:
```
https://your-domain.com/?mode=plain
```
This loads an ultra-fast, zero-WebGL static page with full event details, countdown, photos, maps, and WhatsApp RSVP.

---

## 🌐 Deployment Guide (Vercel & Netlify)

This is a static, frontend-only project with zero backend or database requirements.

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel` or link your GitHub repository on [vercel.com](https://vercel.com).
2. Configure settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Click **Deploy**.

### Deploy to Netlify
1. Drag and drop the `dist` folder onto [Netlify Drop](https://app.netlify.com/drop), or connect your Git repository.
2. Build settings:
   - **Build Command:** `npm run build`
   - **Publish directory:** `dist`
3. Click **Deploy site**.
