'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MessageSquare, Briefcase, Bookmark, Share2, Users, Pencil,
  CircleCheck, Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { AvailabilityStatus } from './ProfileHeader'

interface ActionBarProps {
  profile: {
    full_name: string
    username: string
  }
  isOwner: boolean
  availability: AvailabilityStatus
}

export function ActionBar({ profile, isOwner, availability }: ActionBarProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  function getProfileUrl() {
    const base =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://dotshot.vercel.app'
    return `${base}/profile/${profile.username}`
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getProfileUrl())
    } catch {
      /* ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleSave() {
    setSaved((v) => !v)
    // TODO: wire to Supabase bookmarks table
  }

  // Visitor view
  if (!isOwner) {
    const bookingLabel =
      availability === 'open' ? 'Book Now' : 'Request Booking'
    const isPrimary = availability === 'open'

    return (
      <div className="max-w-5xl mx-auto px-4 mb-5">
        {/* Primary row */}
        <div className="flex gap-2 mb-2">
          <Button size="sm" variant={isPrimary ? 'primary' : 'outline'} className="flex-1 gap-1.5">
            <Briefcase size={13} />
            {bookingLabel}
          </Button>
          <Link href={`/messages?to=${profile.username}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full gap-1.5">
              <MessageSquare size={13} />
              Message
            </Button>
          </Link>
        </div>

        {/* Secondary row */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all flex-1 justify-center',
              saved
                ? 'bg-gold/10 border-gold/30 text-gold'
                : 'bg-surface-2 border-border text-text-muted hover:text-text'
            )}
          >
            {saved
              ? <CircleCheck size={13} className="text-gold" />
              : <Bookmark size={13} />}
            {saved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface-2 text-xs font-medium text-text-muted hover:text-text transition-all flex-1 justify-center"
          >
            {copied
              ? <CircleCheck size={13} className="text-green-400" />
              : <Share2 size={13} />}
            {copied ? 'Copied!' : 'Share'}
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface-2 text-xs font-medium text-text-muted hover:text-text transition-all flex-1 justify-center"
            title="Introduce this creator to someone in your network"
          >
            <Users size={13} />
            Introduce
          </button>
        </div>
      </div>
    )
  }

  // Owner view
  return (
    <div className="max-w-5xl mx-auto px-4 mb-5">
      <div className="flex gap-2 flex-wrap">
        <Link href="/settings">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Pencil size={13} />
            Edit Profile
          </Button>
        </Link>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface-2 text-xs font-medium text-text-muted hover:text-text transition-all"
        >
          {copied ? <CircleCheck size={13} className="text-green-400" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
