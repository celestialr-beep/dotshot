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
  // Photo & Video
  photographer:        'Photographer',
  videographer:        'Videographer',
  retoucher:           'Retoucher / Editor',
  editor:              'Video Editor',
  // Beauty
  makeup_artist:       'Makeup Artist',
  hairstylist:         'Hairstylist',
  nail_artist:         'Nail Artist',
  esthetician:         'Esthetician',
  // Fashion & Styling
  stylist:             'Fashion Stylist',
  costume_designer:    'Costume Designer',
  wardrobe_assistant:  'Wardrobe Assistant',
  // Performance
  model:               'Model',
  actor:               'Actor / Actress',
  dancer:              'Dancer',
  choreographer:       'Choreographer',
  comedian:            'Comedian',
  host_emcee:          'Host / Emcee',
  stunt_performer:     'Stunt Performer',
  // Music
  musician:            'Musician',
  singer:              'Singer / Vocalist',
  dj:                  'DJ',
  music_producer:      'Music Producer',
  sound_engineer:      'Sound Engineer',
  // Writing & Direction
  writer:              'Writer',
  scriptwriter:        'Scriptwriter',
  creative_director:   'Creative Director',
  art_director:        'Art Director',
  director:            'Director',
  // Production & Design
  set_designer:        'Set Designer',
  prop_stylist:        'Prop Stylist',
  florist:             'Florist',
  lighting_designer:   'Lighting Designer',
  production_assistant:'Production Assistant',
  // Events & Strategy
  event_planner:       'Event Planner',
  brand_strategist:    'Brand Strategist',
  social_media_manager:'Social Media Manager',
  // Other
  other:               'Creative',
}

export const ROLE_COLORS: Record<UserRole, string> = {
  // Photo & Video — blues
  photographer:        'bg-blue-500/20 text-blue-300 border-blue-500/30',
  videographer:        'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  retoucher:           'bg-sky-500/20 text-sky-300 border-sky-500/30',
  editor:              'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  // Beauty — pinks
  makeup_artist:       'bg-pink-500/20 text-pink-300 border-pink-500/30',
  hairstylist:         'bg-rose-500/20 text-rose-300 border-rose-500/30',
  nail_artist:         'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  esthetician:         'bg-pink-400/20 text-pink-200 border-pink-400/30',
  // Fashion — oranges & reds
  stylist:             'bg-orange-500/20 text-orange-300 border-orange-500/30',
  costume_designer:    'bg-red-500/20 text-red-300 border-red-500/30',
  wardrobe_assistant:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  // Performance — greens & teals
  model:               'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  actor:               'bg-teal-500/20 text-teal-300 border-teal-500/30',
  dancer:              'bg-green-500/20 text-green-300 border-green-500/30',
  choreographer:       'bg-lime-500/20 text-lime-300 border-lime-500/30',
  comedian:            'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  host_emcee:          'bg-amber-400/20 text-amber-200 border-amber-400/30',
  stunt_performer:     'bg-red-600/20 text-red-300 border-red-600/30',
  // Music — purples
  musician:            'bg-purple-500/20 text-purple-300 border-purple-500/30',
  singer:              'bg-violet-500/20 text-violet-300 border-violet-500/30',
  dj:                  'bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-600/30',
  music_producer:      'bg-purple-700/20 text-purple-300 border-purple-700/30',
  sound_engineer:      'bg-indigo-400/20 text-indigo-200 border-indigo-400/30',
  // Writing & Direction — golds
  writer:              'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  scriptwriter:        'bg-yellow-600/20 text-yellow-200 border-yellow-600/30',
  creative_director:   'bg-gold/20 text-gold border-gold/30',
  art_director:        'bg-amber-600/20 text-amber-300 border-amber-600/30',
  director:            'bg-orange-700/20 text-orange-300 border-orange-700/30',
  // Production & Design — slates
  set_designer:        'bg-slate-500/20 text-slate-300 border-slate-500/30',
  prop_stylist:        'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  florist:             'bg-green-400/20 text-green-200 border-green-400/30',
  lighting_designer:   'bg-yellow-300/20 text-yellow-200 border-yellow-300/30',
  production_assistant:'bg-slate-400/20 text-slate-200 border-slate-400/30',
  // Events & Strategy — teals
  event_planner:       'bg-teal-600/20 text-teal-300 border-teal-600/30',
  brand_strategist:    'bg-cyan-600/20 text-cyan-300 border-cyan-600/30',
  social_media_manager:'bg-blue-400/20 text-blue-200 border-blue-400/30',
  // Other
  other:               'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
}

// Group roles by industry for display in dropdowns and filters
export const ROLE_GROUPS: { label: string; roles: UserRole[] }[] = [
  {
    label: 'Photo & Video',
    roles: ['photographer', 'videographer', 'retoucher', 'editor'],
  },
  {
    label: 'Beauty',
    roles: ['makeup_artist', 'hairstylist', 'nail_artist', 'esthetician'],
  },
  {
    label: 'Fashion & Styling',
    roles: ['stylist', 'costume_designer', 'wardrobe_assistant'],
  },
  {
    label: 'Performance',
    roles: ['model', 'actor', 'dancer', 'choreographer', 'comedian', 'host_emcee', 'stunt_performer'],
  },
  {
    label: 'Music',
    roles: ['musician', 'singer', 'dj', 'music_producer', 'sound_engineer'],
  },
  {
    label: 'Writing & Direction',
    roles: ['writer', 'scriptwriter', 'creative_director', 'art_director', 'director'],
  },
  {
    label: 'Production & Design',
    roles: ['set_designer', 'prop_stylist', 'florist', 'lighting_designer', 'production_assistant'],
  },
  {
    label: 'Events & Strategy',
    roles: ['event_planner', 'brand_strategist', 'social_media_manager'],
  },
  {
    label: 'Other',
    roles: ['other'],
  },
]
