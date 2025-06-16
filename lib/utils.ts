import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTxHash = (hash: string | null) => {
  if (!hash || hash === "-" || hash === "error") return hash;
  const shortHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  return shortHash;
};

