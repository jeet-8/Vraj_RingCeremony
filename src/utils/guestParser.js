/**
 * Parses guest name from URL query parameter e.g.:
 * ?guest=Rahul-and-family
 * ?guest=Uncle+Sharma
 * ?guest=Dr.+Patel
 */

export function parseGuestName() {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('guest');

    if (!guestParam || !guestParam.trim()) {
      return null;
    }

    // Replace hyphens, underscores and pluses with spaces
    let clean = decodeURIComponent(guestParam)
      .replace(/[-_+]/g, ' ')
      .trim();

    // Capitalize words
    clean = clean
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return clean;
  } catch (err) {
    console.warn('Error parsing guest name:', err);
    return null;
  }
}
