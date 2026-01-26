import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("es-CL").replaceAll("-", "/");
}

export function formatTitle(title: string) {
  // remove underscores if exits
  const withoutUnserscore = title.replaceAll("_", " ");
  return (
    withoutUnserscore[0].toLocaleUpperCase() +
    withoutUnserscore.slice(1).toLocaleLowerCase()
  );
}
