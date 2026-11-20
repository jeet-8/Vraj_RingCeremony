import eventConfig from '../../event.config.js';

/**
 * Generates and triggers download of a standardized .ics iCalendar file.
 */
export function downloadIcsCalendar() {
  // Start: 6 Dec 2026, 16:00 IST -> 10:30 UTC
  // End:   6 Dec 2026, 23:00 IST -> 17:30 UTC
  const startTimeUtc = "20261206T103000Z";
  const endTimeUtc = "20261206T173000Z";

  const title = eventConfig.dateTime.calendarSummary;
  const description = `${eventConfig.dateTime.calendarDescription}\\n\\nVenue: ${eventConfig.venue.fullAddress}\\nGoogle Maps: ${eventConfig.venue.googleMapsUrl}`;
  const location = eventConfig.venue.fullAddress;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vraj & Jiya//Ring Ceremony Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:ring-ceremony-vraj-jiya-20261206@vraj-jiya.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART:${startTimeUtc}`,
    `DTEND:${endTimeUtc}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Ring Ceremony of Vraj & Jiya tomorrow!",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", "Vraj-Jiya-Ring-Ceremony.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates direct Google Calendar web link.
 */
export function getGoogleCalendarUrl() {
  const startTimeUtc = "20261206T103000Z";
  const endTimeUtc = "20261206T173000Z";

  const title = encodeURIComponent(eventConfig.dateTime.calendarSummary);
  const details = encodeURIComponent(
    `${eventConfig.dateTime.calendarDescription}\n\nVenue: ${eventConfig.venue.fullAddress}\nMap: ${eventConfig.venue.googleMapsUrl}`
  );
  const location = encodeURIComponent(eventConfig.venue.fullAddress);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeUtc}/${endTimeUtc}&details=${details}&location=${location}`;
}
