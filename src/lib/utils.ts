import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}

export function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
