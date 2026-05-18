'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin, Globe, AtSign, ChevronDown, Pencil, CircleCheck,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, ROLE_LABELS } from '@/lib/utils'
import type { UserRole } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvailabilityStatus = 'open' | 'selective' | 'unavailable' | 'traveling' | 'virtual'

interface AvailabilityOption {
  value: AvailabilityStatus
  label: string
  dotColor: string
  pillBg: string
  pillText: string
}

export const AVAILABILITY_OPTIONS: AvailabilityOption[] = [
  { value: 'open',        label: 'Open for bookings',  dotColor: 'bg-green-400',  pillBg: 'bg-[#EAF3DE]',  pillText: 'text-[#3B6D11]' },
  { value: 'selective',   label: 'Selective bookings', dotColor: 'bg-amber-400',  pillBg: 'bg-[#FAEEDA]',  pillText: 'text-[#854F0B]' },
  { value: 'unavailable', label: 'Unavailable',        dotColor: 'bg-zinc-400',   pillBg: 'bg-[#F1EFE8]',  pillText: 'text-[#5F5E5A]' },
  { value: 'traveling',   label: 'Traveling',          dotColor: 'bg-blue-400',   pillBg: 'bg-[#E6F1FB]',  pillText: 'text-[#185FA5]' },
  { value: 'virtual',     label: 'Virtual only',       dotColor: 'bg-purple-400', pillBg: 'bg-[#EEEDFE]',  pillText: 'text-[#3C3489]' },
]

interface ProfileHeaderProps {
  profile: {
    full_name: string
    username: string
    role?: string
    location?: string | null
    city?: string | null
    website?: string | null
    instagram?: string | null
    avatar_url?: string | null
    is_verified?: boolean
    subscription_tier?: 'free' | 'pro' | 'elite'
    availability_status?: AvailabilityStatus
  }
  isOwner: boolean
  availability: AvailabilityStatus
  setAvailability: (v: AvailabilityStatus) => void
  onSaveAvailability?: (v: AvailabilityStatus) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileHeader({
  profile,
  isOwner,
  availability,
  setAvailability,
  onSaveAvailability,
}: ProfileHeaderProps) {
  const [showAvail, setShowAvail] = useState(false)

  const currentAvail =
    AVAILABILITY_OPTIONS.find((o) => o.value === availability) ?? AVAILABILITY_OPTIONS[0]

  const displayLocation = profile.city ?? profile.location ?? null

  return (
    <>
      {/* ── Cinematic hero banner (Option B) ────────────────────────── */}
      <div className="relative h-40 sm:h-52 overflow-hidden bg-[#0A0A0A]">
        {/* Gold grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,160,23,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,160,23,1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Radial gold glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 80% at 50% 120%, rgba(212,160,23,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Horizontal gold line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        {isOwner && (
          <Link
            href="/settings"
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 text-xs text-white/60 hover:text-white/90 transition-all"
          >
            <Pencil size={11} /> Edit Banner
          </Link>
        )}
      </div>

      {/* ── Identity block ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative -mt-16 sm:-mt-20 mb-5">

          {/* Avatar — centered on mobile, left-aligned on sm+ */}
          <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4 sm:gap-6">
            <div className="relative flex-shrink-0 z-10">
              {/* Ring */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-[3px] border-[#0A0A0A] overflow-hidden bg-surface shadow-2xl shadow-black/60">
                <Avatar
                  name={profile.full_name}
                  src={profile.avatar_url ?? null}
                  size="xl"
                  className="w-full h-full rounded-none"
                  objectPosition={(profile as any).avatar_position ?? 'top'}
                />
              </div>
              {/* Status dot */}
              <span
                className={cn(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A0A0A]',
                  currentAvail.dotColor
                )}
                title={currentAvail.label}
              />
            </div>

            {/* Name + role + meta */}
            <div className="flex-1 min-w-0 text-center sm:text-left pb-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-text leading-tight">
                  {profile.full_name}
                </h1>
                {profile.is_verified && (
                  <CircleCheck size={18} className="text-gold flex-shrink-0" fill="currentColor" />
                )}
                {profile.subscription_tier === 'pro' && (
                  <Badge variant="gold">Pro</Badge>
                )}
                {profile.subscription_tier === 'elite' && (
                  <Badge variant="gold">Elite ✦</Badge>
                )}
              </div>

              {profile.role && (
                <p className="text-sm text-text-muted mb-2 font-medium">
                  {ROLE_LABELS[profile.role as UserRole] ?? profile.role}
                </p>
              )}

              <div className="flex flex-wrap gap-3 text-xs text-text-faint justify-center sm:justify-start">
                {displayLocation && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {displayLocation}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={
                      profile.website.startsWith('http')
                        ? profile.website
                        : `https://${profile.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-gold transition-colors"
                  >
                    <Globe size={11} />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={`https://instagram.com/${profile.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-gold transition-colors"
                  >
                    <AtSign size={11} />@{profile.instagram}
                  </a>
                )}
              </div>
            </div>

            {/* Availability pill / toggle for owner */}
            {isOwner && (
              <div className="relative pb-1">
                <button
                  onClick={() => setShowAvail((v) => !v)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    currentAvail.pillBg,
                    currentAvail.pillText,
                    'border-transparent hover:opacity-90'
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', currentAvail.dotColor)} />
                  {currentAvail.label}
                  <ChevronDown size={11} />
                </button>

                {showAvail && (
                  <div className="absolute right-0 top-full mt-1 z-30 w-52 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setAvailability(opt.value)
                          onSaveAvailability?.(opt.value)
                          setShowAvail(false)
                        }}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left hover:bg-surface-2 transition-colors',
                          availability === opt.value ? 'text-gold' : 'text-text-muted'
                        )}
                      >
                        <span className={cn('w-2 h-2 rounded-full flex-shrink-0', opt.dotColor)} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Availability badge for visitors */}
            {!isOwner && (
              <div className="pb-1">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                    currentAvail.pillBg,
                    currentAvail.pillText
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full', currentAvail.dotColor)} />
                  {currentAvail.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
