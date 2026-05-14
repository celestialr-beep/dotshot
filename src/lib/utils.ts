import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { UserRole } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(dateString)
}

export const ROLE_LABELS: Record<UserRole, string> = {
  photographer: 'Photographer',
  videographer: 'Videographer',
  makeup_artist: 'Makeup Artist',
  hairstylist: 'Hairstylist',
  model: 'Model',
  art_director: 'Art Director',
  stylist: 'Stylist',
  retoucher: 'Retoucher',
  other: 'Creative',
}

export const ROLE_COLORS: Record<UserRole, string> = {
  photographer: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  videographer: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  makeup_artist: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  hairstylist: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  model: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  art_director: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  stylist: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  retoucher: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  other: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
}
