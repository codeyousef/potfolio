import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type FieldError, type FieldErrors } from "react-hook-form"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFieldError(errors: FieldErrors, name: string): string | undefined {
  const error = name.split('.').reduce((obj, key) => {
    if (!obj) return undefined;
    return obj[key];
  }, errors as any) as FieldError | undefined;
  
  return error?.message;
}

export function isUrlValid(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}