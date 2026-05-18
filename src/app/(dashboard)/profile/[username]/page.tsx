'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Share2, Copy, ExternalLink, Sparkles, CircleCheck, Pencil,
  Award, Shield, Briefcase, CircleHelp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ─── Profile sub-components ───────────────────────────────────────────────────
import { ProfileHeader }           from '@/components/profile/ProfileHeader'
import { ActionBar }               from '@/components/profile/ActionBar'
import { CollaborationScore }      from '@/components/profile/CollaborationScore'
import { CreatorDNA }              from '@/components/profile/CreatorDNA'
import { CaseStudies }             from '@/components/profile/CaseStudies'
import { TrustedCollaborators }    from '@/components/profile/TrustedCollaborators'
import { CommunityReactions }      from '@/components/profile/CommunityReactions'
import { Reviews }                 from '@/components/profile/Reviews'
import type { AvailabilityStatus } from '@/components/profile/ProfileHeader'

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-40 sm:h-52 bg-surface" />
      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-4">
        <div className="h-28 bg-surface rounded-xl" />
        <div className="h-16 bg-surface rounded-xl" />
        <div className="h-24 bg-surface rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-surface rounded-xl" />
            <div className="h-48 bg-surface rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-surface rounded-xl" />
            <div className="h-40 bg-surface rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const params   = useParams()
  const username = params.username as string

  const [profile,         setProfile]         = useState<any>(null)
  const [currentUserId,   setCurrentUserId]   = useState<string | null>(null)
  const [isOwner,         setIsOwner]         = useState(false)
  const [loading,         setLoading]         = useState(true)
  const [availability,    setAvailability]    = useState<AvailabilityStatus>('open')
  const [copied,          setCopied]          = useState(false)
  const [showSharePanel,  setShowSharePanel]  = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      setCurrentUserId(currentUser?.id ?? null)

      if (username === 'me') {
        if (!currentUser) { setLoading(false); return }

        let { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        // No profile row yet — create one from auth metadata so the page works immediately
        if (!data) {
          const meta = currentUser.user_metadata ?? {}
          // Generate a safe username — prefer what they typed at signup,
          // fall back to a unique temp handle from their user ID
          const rawUsername = (meta.username ?? meta.name ?? '')
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '')
            .slice(0, 20)
          const safeUsername =
            rawUsername || `creator_${currentUser.id.replace(/-/g, '').slice(0, 10)}`

          const { data: created } = await supabase
            .from('profiles')
            .upsert({
              id:        currentUser.id,
              full_name: meta.full_name ?? meta.name ?? 'New Creator',
              username:  safeUsername,
              role:      meta.role     ?? 'photographer',
              location:  meta.location ?? null,
            })
            .select()
            .single()
          data = created
        }

        if (data) {
          setProfile(data)
          setIsOwner(true)
          setAvailability((data.availability_status ?? data.availability ?? 'open') as AvailabilityStatus)
        }
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (data) {
        setProfile(data)
        setIsOwner(currentUser?.id === data.id)
        setAvailability((data.availability_status ?? data.availability ?? 'open') as AvailabilityStatus)
      }
      setLoading(false)
    }
    load()
  }, [username])

  async function saveAvailability(v: AvailabilityStatus) {
    if (!profile?.id) return
    await supabase
      .from('profiles')
      .update({ availability_status: v })
      .eq('id', profile.id)
  }

  function getProfileUrl() {
    const base =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://dotshot.vercel.app'
    return `${base}/profile/${profile?.username ?? username}`
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(getProfileUrl()) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return <ProfileSkeleton />

  if (!profile) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold mb-2">
          {username === 'me' ? 'Finish setting up your profile' : 'Profile not found'}
        </h2>
        <p className="text-text-muted mb-6">
          {username === 'me'
            ? 'Go to Settings to add your name, bio, and a profile photo.'
            : `@${username} doesn't exist yet.`}
        </p>
        <div className="flex gap-3 justify-center">
          {username === 'me' && (
            <Link href="/settings">
              <Button>Go to Settings</Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const profileUrl   = getProfileUrl()
  const shareText    = encodeURIComponent(`Check out ${profile.full_name} on Dotshot`)
  const shareUrl     = encodeURIComponent(profileUrl)
  const isIncomplete = isOwner && (!profile.bio || !profile.avatar_url || !profile.location)

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-10">

      {/* ── 1. Cinematic header ───────────────────────────────────────── */}
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        availability={availability}
        setAvailability={setAvailability}
        onSaveAvailability={saveAvailability}
      />

      {/* ── 2. Bio + incomplete nudge ────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">

        {isIncomplete && (
          <div className="bg-gold/8 border border-gold/25 rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Sparkles size={15} className="text-gold flex-shrink-0" />
              <p className="text-sm text-text-muted">
                <span className="text-gold font-semibold">Complete your profile</span>
                {' '}— add a photo, bio, and location so collaborators can find and book you.
              </p>
            </div>
            <Link href="/settings">
              <Button size="sm" variant="outline" className="flex-shrink-0 gap-1.5">
                <Pencil size={13} /> Edit
              </Button>
            </Link>
          </div>
        )}

        {profile.bio && (
          <p className="text-sm text-text-muted leading-relaxed mb-4 max-w-2xl">
            {profile.bio}
          </p>
        )}
        {!profile.bio && isOwner && (
          <p className="text-sm text-text-faint italic mb-4">
            No bio yet —{' '}
            <Link href="/settings" className="text-gold hover:underline">
              add one in Settings
            </Link>
          </p>
        )}
      </div>

      {/* ── 3. Action bar ────────────────────────────────────────────── */}
      <ActionBar profile={profile} isOwner={isOwner} availability={availability} />

      {/* ── 4. Collaboration score ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 mb-5">
        <CollaborationScore profile={profile} />
      </div>

      {/* ── 5. Main layout grid ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left: Case studies + Trusted collabs + Reviews ───────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Case Studies (Campaigns / BTS / Credits) */}
            <CaseStudies profileId={profile.id} isOwner={isOwner} />

            {/* Trusted Collaborators — hidden when empty */}
            <TrustedCollaborators profileId={profile.id} />

            {/* Reviews */}
            <Reviews profileId={profile.id} reviewCount={profile.review_count} />
          </div>

          {/* ── Right sidebar ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Creator DNA */}
            <CreatorDNA profile={profile} isOwner={isOwner} />

            {/* Community Reactions */}
            <CommunityReactions
              profileId={profile.id}
              currentUserId={currentUserId}
              isOwner={isOwner}
            />

            {/* Credentials */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award size={15} className="text-gold" />
                <h2 className="font-semibold text-sm">Credentials</h2>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  {
                    label: 'Identity Verified',
                    active: !!(profile.badge_id_verified ?? profile.is_verified),
                    future: false,
                  },
                  {
                    label: 'Professional Verified',
                    active: false,
                    future: false,
                  },
                  {
                    label: 'Background Checked',
                    active: !!profile.badge_background_checked,
                    future: !profile.badge_background_checked,
                  },
                  {
                    label: 'Minor-Safe Certified',
                    active: !!profile.badge_minor_safe,
                    future: !profile.badge_minor_safe,
                  },
                ].map(({ label, active, future }) => (
                  <div
                    key={label}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs',
                      active
                        ? 'bg-gold/10 border border-gold/20 text-gold'
                        : 'bg-surface-2 border border-border text-text-faint'
                    )}
                  >
                    {active ? (
                      <CircleCheck size={13} className="text-gold flex-shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-border flex-shrink-0" />
                    )}
                    {label}
                    {future && (
                      <span className="ml-auto text-[10px] text-text-faint">Soon</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Services placeholder */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase size={15} className="text-gold" />
                <h2 className="font-semibold text-sm">Services</h2>
              </div>
              <p className="text-xs text-text-faint leading-relaxed">
                {isOwner
                  ? 'Add your rates and service offerings — coming soon in Settings.'
                  : 'No services listed yet.'}
              </p>
            </div>

            {/* Share Profile */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Share2 size={15} className="text-gold" />
                <h2 className="font-semibold text-sm">Share Profile</h2>
              </div>

              {/* Copy link */}
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:border-gold/40 hover:text-text transition-all mb-3"
              >
                {copied
                  ? <CircleCheck size={12} className="text-green-400 flex-shrink-0" />
                  : <Copy size={12} className="flex-shrink-0" />}
                <span className="truncate flex-1 text-left">{profileUrl}</span>
                <span className="text-gold font-medium">{copied ? '✓' : 'Copy'}</span>
              </button>

              {/* Social share links */}
              <div className="flex flex-col gap-1.5">
                {[
                  {
                    label: 'Share on X / Twitter',
                    href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
                  },
                  {
                    label: 'Share on Facebook',
                    href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                  },
                  {
                    label: 'Share on LinkedIn',
                    href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                  },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:text-text hover:border-gold/20 transition-all"
                  >
                    {label}
                    <ExternalLink size={11} className="flex-shrink-0" />
                  </a>
                ))}
                <button
                  onClick={copyLink}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:text-text hover:border-gold/20 transition-all"
                >
                  Copy for Instagram / TikTok
                  <Copy size={11} className="flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* CTA for visitors */}
            {!isOwner && (
              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                <p className="text-xs text-text-muted leading-relaxed mb-3">
                  <span className="text-gold font-semibold">Ready to work together?</span>{' '}
                  Post a free Collab Call or send a direct message.
                </p>
                <div className="flex gap-2">
                  <Link href={`/messages?to=${profile.username}`} className="flex-1">
                    <Button size="sm" className="w-full">Message</Button>
                  </Link>
                  <Link href="/forum" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">Forum</Button>
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
