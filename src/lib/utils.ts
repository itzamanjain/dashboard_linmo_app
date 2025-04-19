import { clsx, type ClassValue } from "clsx"
// import moment from 'moment-timezone';
import { twMerge } from "tailwind-merge"
// import tzLookup from 'tz-lookup';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export function formatEventLocalTime(utcDatetime: string, lat: number, lng: number): string {
//   const timezone = tzLookup(lat, lng);
//   return moment.utc(utcDatetime).tz(timezone).format('HH:mm');
// }