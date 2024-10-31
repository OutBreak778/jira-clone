import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function GenerateInviteCode (length: number) {
  const Characters = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm123456789"
  let res = ""
  for(let i = 0; i < length; i++) {
    res += Characters.charAt(Math.floor(Math.random() * Characters.length))
  }

  return res
}

export function SnakecaseToTitlecase(value: string) {
  return value.toLowerCase()
  .replace(/_/g, " ")
  .replace(/\b\w/g, (item) => item.toUpperCase())
}