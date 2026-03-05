import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { enUS } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateLocale(language: string) {
  switch (language) {
    case 'am':
      // date-fns doesn't support Amharic yet, fallback to English
      return enUS;
    case 'om':
      // date-fns doesn't support Afaan Oromoo yet, fallback to English
      return enUS; 
    default:
      return enUS;
  }
}
