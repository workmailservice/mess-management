import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number | string) {
  return currencyFormatter.format(typeof amount === "string" ? Number(amount) : amount);
}

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnpqrstuvwxyz";
const DIGITS = "23456789";
const ALL = `${UPPER}${LOWER}${DIGITS}!@#$%`;

function randomChar(charset: string) {
  return charset[crypto.getRandomValues(new Uint32Array(1))[0] % charset.length];
}

/** Cryptographically random password guaranteed to satisfy the app's complexity rules. */
export function generateSecurePassword(length = 14) {
  const required = [randomChar(UPPER), randomChar(LOWER), randomChar(DIGITS)];
  const rest = Array.from({ length: length - required.length }, () => randomChar(ALL));
  const chars = [...required, ...rest];

  // Fisher-Yates shuffle so the guaranteed characters aren't always in the first 3 positions.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}
