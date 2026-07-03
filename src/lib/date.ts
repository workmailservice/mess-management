/**
 * Date-only helpers (no time-of-day). Everything operates on "YYYY-MM-DD"
 * strings and UTC methods so a date never silently shifts a day due to the
 * server's or browser's local timezone offset.
 */

export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function parseDateOnly(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateString: string, days: number): string {
  const date = parseDateOnly(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateOnly(date);
}

export function formatDisplayDate(dateString: string): string {
  return parseDateOnly(dateString).toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
