'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  MapPin, Star, CheckCircle, AtSign, Globe, Camera,
  Pencil, Share2, Copy, Users, Sparkles, Twitter,
  Facebook, Linkedin, Instagram,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/utils'
import type { UserRole } from '@/types'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null

      // 'me' is a special alias — always loads the current user's own profile
      if (username === 'me') {
        if (!currentUser) { setLoading(false); return }
        const { data } = await supabase
          .from('profiles').select('*').eq('id', currentUser.id).single()
        if (data) { setProfile(data); setIsOwner(true) }
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles').select('*').eq('username', username).single()
      if (data) {
        setProfile(data)
        setIsOwner(currentUser?.id === data.id)
      }
      setLoading(false)
    }
    load()
  }, [username])

  function getProfileUrl() {
    const base = typeof window !== 'undefined'
      ? window.location.origin
      : 'https://dotshot.vercel.app'
    return `${base}/profile/${profile?.username ?? username}`
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(getProfileUrl()) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-surface rounded-2xl" />
          <div className="h-80 bg-surface rounded-xl" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold mb-2">Profile not found</h2>
        <p className="text-text-muted mb-6">@{username} doesn&apos;t exist yet.</p>
        <Link href="/dashboard"><Button variant="outline">Go to Dashboard</Button></Link>
      </div>
    )
  }

  const profileUrl = getProfileUrl()
  const shareText = `Check out ${profile.full_name} on Dotshot — ${profile.role ? (ROLE_LABELS[profile.role as UserRole] ?? profile.role) : 'Creative Professional'}`
  const isIncomplete = isOwner && (!profile.bio || !profile.avatar_url || !profile.location)

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">

      {/* Complete-your-profile nudge */}
      {isIncomplete && (
        <div className="bg-gold/8 border border-gold/25 rounded-xl px-4 py-3 mb-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-gold flex-shrink-0" />
            <p className="text-sm text-text-muted">
              <span className="text-gold font-semibold">Complete your profile</span>{' '}
              — add a photo, bio, and location so collaborators can find and book you.
            </p>
          </div>
          <Link href="/settings">
            <Button size="sm" variant="outline" className="flex-shrink-0">
              <Pencil size={13} /> Edit Profile
            </Button>
          </Link>
        </div>
      )}

      {/* Header card */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <Avatar name={profile.full_name} src={profile.avatar_url} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold">{profile.full_name}</h1>
                  {profile.is_verified && (
                    <CheckCircle size={17} className="text-gold flex-shrink-0" fill="currentColor" />
                  )}
                </div>
                <p className="text-text-muted text-sm">@{profile.username}</p>
              </div>
              {profile.role && (
                <Badge className={ROLE_COLORS[profile.role as UserRole] ?? 'bg-surface-2 text-text-muted'}>
                  {ROLE_LABELS[profile.role as UserRole] ?? profile.role}
                </Badge>
              )}
              {profile.subscription_tier === 'pro' && <Badge variant="gold">Pro</Badge>}
              {profile.subscription_tier === 'elite' && <Badge variant="gold">Elite ✦</Badge>}
            </div>

            {profile.bio ? (
              <p className="text-sm text-text-muted leading-relaxed mb-3 max-w-xl">{profile.bio}</p>
            ) : isOwner ? (
              <p className="text-sm text-text-faint italic mb-3">
                No bio yet —{' '}
                <Link href="/settings" className="text-gold hover:underline">add one in Settings</Link>
              </p>
            ) : null}

            <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-4">
              {profile.location && (
                <span className="flex items-center gap-1.5"><MapPin size={13} /> {profile.location}</span>
              )}
              {profile.website && (
                <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  className="flex items-center gap-1.5 hover:text-gold transition-colors"
                  target="_blank" rel="noopener noreferrer">
                  <Globe size={13} /> {profile.website}
                </a>
              )}
              {profile.instagram && (
                <a href={`https://instagram.com/${profile.instagram}`}
                  className="flex items-center gap-1.5 hover:text-gold transition-colors"
                  target="_blank" rel="noopener noreferrer">
                  <AtSign size={13} /> {profile.instagram}
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              {[
                { label: 'Projects', value: profile.completed_projects ?? 0 },
                { label: 'Collabs', value: profile.collab_count ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="font-bold text-text">{value}</div>
                  <div className="text-xs text-text-muted">{label}</div>
                </div>
              ))}
              <div className="text-center">
                <div className="font-bold text-text flex items-center gap-1">
                  <Star size={13} className="text-gold" fill="currentColor" />
                  {profile.rating ? Number(profile.rating).toFixed(1) : '—'}
                </div>
                <div className="text-xs text-text-muted">{profile.review_count ?? 0} reviews</div>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex sm:flex-col gap-2 flex-wrap sm:items-end">
            {isOwner ? (
              <Link href="/settings">
                <Button size="sm" variant="outline"><Pencil size={13} /> Edit Profile</Button>
              </Link>
            ) : (
              <>
                <Button size="sm">Book / Collab</Button>
                <Button size="sm" variant="outline">Message</Button>
              </>
            )}
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text hover:bg-surface-2 border border-border transition-all"
            >
              {copied
                ? <CheckCircle size={13} className="text-green-400" />
                : <Share2 size={13} />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Portfolio + Reviews */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera size={17} className="text-gold" />
                <h2 className="font-semibold text-sm">Portfolio</h2>
              </div>
              {isOwner && (
                <button className="text-xs text-gold hover:text-gold-light font-medium transition-colors">
                  + Add Photos
                </button>
              )}
            </div>
            {profile.portfolio_images?.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {profile.portfolio_images.map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-surface-2 border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Camera size={32} className="mx-auto mb-3 text-text-faint opacity-20" />
                <p className="text-sm text-text-faint">
                  {isOwner
                    ? 'Upload your best work — portfolio builds credibility and gets you booked.'
                    : 'No portfolio images yet.'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star size={17} className="text-gold" fill="currentColor" />
                <h2 className="font-semibold text-sm">Reviews</h2>
              </div>
              <span className="text-xs text-text-faint">{profile.review_count ?? 0} total</span>
            </div>
            <p className="text-sm text-text-faint text-center py-6">
              {isOwner
                ? 'Complete a collaboration to earn your first review.'
                : 'No reviews yet.'}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">

          {/* Share profile — owner */}
          {isOwner && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Share2 size={15} className="text-gold" />
                <h2 className="font-semibold text-sm">Share Your Profile</h2>
              </div>
              <p className="text-xs text-text-faint mb-3 leading-relaxed">
                Share across your socials to get discovered and booked.
              </p>

              <button
                onClick={copyLink}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:border-gold/40 hover:text-text transition-all mb-3"
              >
                {copied
                  ? <CheckCircle size={13} className="text-green-400 flex-shrink-0" />
                  : <Copy size={13} className="flex-shrink-0" />}
                <span className="truncate flex-1 text-left">{profileUrl}</span>
                <span className="text-gold font-medium flex-shrink-0">{copied ? '✓' : 'Copy'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:border-sky-400/30 hover:text-text transition-all">
                  <Twitter size={12} /> X / Twitter
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:border-blue-500/30 hover:text-text transition-all">
                  <Facebook size={12} /> Facebook
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:border-blue-400/30 hover:text-text transition-all">
                  <Linkedin size={12} /> LinkedIn
                </a>
                <button onClick={copyLink}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:border-pink-400/30 hover:text-text transition-all">
                  <Instagram size={12} /> Instagram
                </button>
              </div>
              <p className="text-xs text-text-faint mt-2 text-center leading-relaxed">
                Instagram: copy your link above, paste it in your bio or story.
              </p>
            </div>
          )}

          {/* Specialties */}
          {profile.specialties?.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-semibold text-sm mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((tag: string) => (
                  <Badge key={tag} variant="muted">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Top Collaborators */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Users size={15} className="text-gold" />
              <h2 className="font-semibold text-sm">Top Collaborators</h2>
            </div>
            <p className="text-xs text-text-faint mb-3">Ranked by projects completed together</p>
            <p className="text-sm text-text-faint text-center py-3">
              {isOwner
                ? 'Start collaborating to build your network sphere.'
                : 'No collaborations recorded yet.'}
            </p>
          </div>

          {/* Availability */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h2 className="font-semibold text-sm mb-2">Availability</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
              <span className="text-sm text-text-muted">Available for projects</span>
            </div>
          </div>

          {/* Connect CTA — non-owner */}
          {!isOwner && (
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
              <p className="text-xs text-text-muted leading-relaxed">
                <span className="text-gold font-semibold">Want to collaborate?</span>{' '}
                Send a message or post a Collab Call on the Forum — it&apos;s free.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1">Message</Button>
                <Link href="/forum" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">Forum</Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
