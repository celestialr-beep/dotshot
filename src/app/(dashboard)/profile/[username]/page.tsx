'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  MapPin, Star, CheckCircle, Globe, Camera, Share2, Copy,
  Users, Pencil, MessageSquare, Bookmark, Zap, Heart, Award,
  Clock, AtSign, Briefcase, ChevronDown, ExternalLink,
  Sparkles, CircleCheck, Video, FileText, Image, Layers,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, ROLE_LABELS, ROLE_COLORS } from '@/lib/utils'
import type { UserRole } from '@/types'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

type PortfolioTab = 'photos' | 'video' | 'campaigns' | 'bts' | 'credits'

const PORTFOLIO_TABS: { id: PortfolioTab; label: string; icon: React.ElementType }[] = [
  { id: 'photos',    label: 'Photos',    icon: Image },
  { id: 'video',     label: 'Video',     icon: Video },
  { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
  { id: 'bts',       label: 'BTS',       icon: Camera },
  { id: 'credits',   label: 'Credits',   icon: FileText },
]

const AVAILABILITY_OPTIONS = [
  { value: 'open',      label: 'Open for bookings',   color: 'bg-green-500' },
  { value: 'selective', label: 'Selective bookings',  color: 'bg-gold' },
  { value: 'unavailable', label: 'Unavailable',       color: 'bg-red-500' },
  { value: 'traveling', label: 'Traveling',           color: 'bg-blue-400' },
  { value: 'virtual',   label: 'Virtual only',        color: 'bg-purple-400' },
]

const REACTIONS = [
  { id: 'appreciate',  emoji: '👏', label: 'Appreciate' },
  { id: 'collab',      emoji: '🤝', label: 'Want to Collab' },
  { id: 'inspired',    emoji: '✨', label: 'Inspired' },
  { id: 'bookmarked',  emoji: '⭐', label: 'Bookmark' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string

  const [profile, setProfile]         = useState<any>(null)
  const [isOwner, setIsOwner]         = useState(false)
  const [loading, setLoading]         = useState(true)
  const [copied, setCopied]           = useState(false)
  const [activeTab, setActiveTab]     = useState<PortfolioTab>('photos')
  const [availability, setAvailability] = useState('open')
  const [reactions, setReactions]     = useState<Record<string, number>>({
    appreciate: 0, collab: 0, inspired: 0, bookmarked: 0,
  })
  const [myReaction, setMyReaction]   = useState<string | null>(null)
  const [showAvail, setShowAvail]     = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null

      if (username === 'me') {
        if (!currentUser) { setLoading(false); return }
        const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single()
        if (data) { setProfile(data); setIsOwner(true); setAvailability(data.availability ?? 'open') }
        setLoading(false)
        return
      }

      const { data } = await supabase.from('profiles').select('*').eq('username', username).single()
      if (data) {
        setProfile(data)
        setIsOwner(currentUser?.id === data.id)
        setAvailability(data.availability ?? 'open')
      }
      setLoading(false)
    }
    load()
  }, [username])

  function getProfileUrl() {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://dotshot.vercel.app'
    return `${base}/profile/${profile?.username ?? username}`
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(getProfileUrl()) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function toggleReaction(id: string) {
    if (myReaction === id) {
      setMyReaction(null)
      setReactions(r => ({ ...r, [id]: Math.max(0, r[id] - 1) }))
    } else {
      if (myReaction) setReactions(r => ({ ...r, [myReaction]: Math.max(0, r[myReaction] - 1) }))
      setMyReaction(id)
      setReactions(r => ({ ...r, [id]: r[id] + 1 }))
    }
  }

  const currentAvail = AVAILABILITY_OPTIONS.find(o => o.value === availability) ?? AVAILABILITY_OPTIONS[0]

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-36 bg-surface" />
        <div className="p-4 space-y-4 max-w-5xl mx-auto">
          <div className="h-24 bg-surface rounded-xl" />
          <div className="h-64 bg-surface rounded-xl" />
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

  const profileUrl   = getProfileUrl()
  const shareText    = encodeURIComponent(`Check out ${profile.full_name} on Dotshot`)
  const shareUrl     = encodeURIComponent(profileUrl)
  const isIncomplete = isOwner && (!profile.bio || !profile.avatar_url || !profile.location)

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">

      {/* ── Banner ──────────────────────────────────────────────────── */}
      <div className="relative h-36 sm:h-44 bg-gradient-to-br from-surface via-surface-2 to-dark overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(212,160,23,0.25) 0%, transparent 70%)' }}
        />
        {isOwner && (
          <button className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark/60 backdrop-blur-sm border border-border text-xs text-text-muted hover:text-text transition-all">
            <Image size={12} /> Add Banner
          </button>
        )}
      </div>

      {/* ── Profile header ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative -mt-14 sm:-mt-16 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-dark overflow-hidden bg-surface shadow-xl">
                <Avatar name={profile.full_name} src={profile.avatar_url}
                  size="xl" className="w-full h-full rounded-none" />
              </div>
              <span className={cn(
                'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark',
                currentAvail.color
              )} title={currentAvail.label} />
            </div>

            {/* Name + badges */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold">{profile.full_name}</h1>
                {profile.is_verified && (
                  <CircleCheck size={18} className="text-gold flex-shrink-0" fill="currentColor" />
                )}
                {profile.subscription_tier === 'pro'   && <Badge variant="gold">Pro</Badge>}
                {profile.subscription_tier === 'elite' && <Badge variant="gold">Elite ✦</Badge>}
              </div>
              {profile.role && (
                <p className="text-sm text-text-muted mb-1">
                  {ROLE_LABELS[profile.role as UserRole] ?? profile.role}
                </p>
              )}
              <div className="flex flex-wrap gap-3 text-xs text-text-faint">
                {profile.location && <span className="flex items-center gap-1"><MapPin size={11} />{profile.location}</span>}
                {profile.website  && (
                  <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-gold transition-colors">
                    <Globe size={11} />{profile.website}
                  </a>
                )}
                {profile.instagram && (
                  <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-gold transition-colors">
                    <AtSign size={11} />@{profile.instagram}
                  </a>
                )}
              </div>
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap gap-2 pb-1">
              {isOwner ? (
                <>
                  <Link href="/settings">
                    <Button size="sm" variant="outline"><Pencil size={13} /> Edit Profile</Button>
                  </Link>
                  {/* Availability toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setShowAvail(v => !v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-xs text-text-muted hover:text-text transition-all"
                    >
                      <span className={cn('w-2 h-2 rounded-full flex-shrink-0', currentAvail.color)} />
                      {currentAvail.label}
                      <ChevronDown size={11} />
                    </button>
                    {showAvail && (
                      <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
                        {AVAILABILITY_OPTIONS.map(opt => (
                          <button key={opt.value}
                            onClick={() => { setAvailability(opt.value); setShowAvail(false) }}
                            className={cn(
                              'w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left hover:bg-surface-2 transition-colors',
                              availability === opt.value ? 'text-gold' : 'text-text-muted'
                            )}>
                            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', opt.color)} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Button size="sm"><MessageSquare size={13} /> Message</Button>
                  <Button size="sm" variant="outline"><Users size={13} /> Collab</Button>
                  <button onClick={copyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-xs text-text-muted hover:text-text transition-all">
                    <Bookmark size={13} /> Save
                  </button>
                </>
              )}
              <button onClick={copyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-xs text-text-muted hover:text-text transition-all">
                {copied ? <CircleCheck size={13} className="text-green-400" /> : <Share2 size={13} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>

        {/* Incomplete-profile nudge */}
        {isIncomplete && (
          <div className="bg-gold/8 border border-gold/25 rounded-xl px-4 py-3 mb-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Sparkles size={15} className="text-gold flex-shrink-0" />
              <p className="text-sm text-text-muted">
                <span className="text-gold font-semibold">Complete your profile</span>
                {' '}— add a photo, bio, and location so collaborators can find and book you.
              </p>
            </div>
            <Link href="/settings">
              <Button size="sm" variant="outline" className="flex-shrink-0"><Pencil size={13} /> Edit</Button>
            </Link>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-text-muted leading-relaxed mb-5 max-w-2xl">{profile.bio}</p>
        )}
        {!profile.bio && isOwner && (
          <p className="text-sm text-text-faint italic mb-5">
            No bio yet —{' '}
            <Link href="/settings" className="text-gold hover:underline">add one in Settings</Link>
          </p>
        )}

        {/* ── Trust stats bar ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: CheckCircle, label: 'Completed Collabs',  value: profile.completed_projects ?? 0,    color: 'text-green-400' },
            { icon: Star,        label: 'Professionalism',    value: profile.rating ? `${Number(profile.rating).toFixed(1)} / 5` : '—', color: 'text-gold' },
            { icon: Clock,       label: 'Response Rate',      value: '—',   color: 'text-blue-400' },
            { icon: Award,       label: 'Reviews',            value: profile.review_count ?? 0, color: 'text-purple-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-surface border border-border rounded-xl p-4 text-center">
              <Icon size={18} className={cn('mx-auto mb-1.5', color)} />
              <div className="text-lg font-bold">{value}</div>
              <div className="text-xs text-text-faint">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Main grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-8">

          {/* Left: Portfolio + Top 8 + Reviews */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Portfolio */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-border overflow-x-auto scrollbar-none">
                {PORTFOLIO_TABS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap flex-shrink-0 border-b-2 -mb-px transition-all',
                      activeTab === id
                        ? 'text-gold border-gold'
                        : 'text-text-muted border-transparent hover:text-text'
                    )}>
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
              {/* Content */}
              <div className="p-5">
                {profile.portfolio_images?.length > 0 && activeTab === 'photos' ? (
                  <div className="grid grid-cols-3 gap-2">
                    {profile.portfolio_images.map((img: string, i: number) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden bg-surface-2 border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-3">
                      {activeTab === 'photos'    && <Camera   size={20} className="text-text-faint opacity-40" />}
                      {activeTab === 'video'     && <Video    size={20} className="text-text-faint opacity-40" />}
                      {activeTab === 'campaigns' && <Briefcase size={20} className="text-text-faint opacity-40" />}
                      {activeTab === 'bts'       && <Layers   size={20} className="text-text-faint opacity-40" />}
                      {activeTab === 'credits'   && <FileText size={20} className="text-text-faint opacity-40" />}
                    </div>
                    <p className="text-sm text-text-faint mb-1">
                      {activeTab === 'photos'    && (isOwner ? 'Upload your best photos to showcase your work.' : 'No photos yet.')}
                      {activeTab === 'video'     && (isOwner ? 'Add video reels or project highlights.' : 'No videos yet.')}
                      {activeTab === 'campaigns' && (isOwner ? 'Completed paid campaigns will appear here.' : 'No campaigns yet.')}
                      {activeTab === 'bts'       && (isOwner ? 'Behind-the-scenes content builds trust.' : 'No BTS content yet.')}
                      {activeTab === 'credits'   && (isOwner ? 'Tag your collaborators and credit your work.' : 'No credits yet.')}
                    </p>
                    {isOwner && activeTab === 'photos' && (
                      <Button size="sm" variant="outline" className="mt-3">
                        <Camera size={13} /> Upload Photos
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Top 8 Collaborators */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gold" />
                    <h2 className="font-semibold text-sm">Trusted Collaborators</h2>
                  </div>
                  <p className="text-xs text-text-faint mt-0.5">Top 8 — ranked by completed projects together</p>
                </div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 group">
                    <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-xl bg-surface-2 border border-border border-dashed flex items-center justify-center group-hover:border-gold/30 transition-colors">
                      {isOwner
                        ? <span className="text-text-faint text-lg leading-none">+</span>
                        : <Users size={14} className="text-text-faint opacity-30" />}
                    </div>
                    <span className="text-[10px] text-text-faint text-center leading-tight">
                      {isOwner ? 'Add' : 'Open'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-faint text-center mt-4">
                {isOwner
                  ? 'Complete collaborations to automatically build your trusted circle.'
                  : 'Collaborations will be displayed as they are completed.'}
              </p>
            </div>

            {/* Reviews */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-gold" fill="currentColor" />
                  <h2 className="font-semibold text-sm">Reviews</h2>
                </div>
                <span className="text-xs text-text-faint">{profile.review_count ?? 0} total</span>
              </div>
              {/* Rating breakdown */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {['Professionalism', 'Punctuality', 'Communication', 'Delivery'].map((cat) => (
                  <div key={cat} className="bg-surface-2 rounded-lg p-3">
                    <div className="text-xs text-text-faint mb-1">{cat}</div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                        <div className="h-full bg-gold rounded-full" style={{ width: '0%' }} />
                      </div>
                      <span className="text-xs font-medium text-text-muted">—</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-faint text-center py-4">
                {isOwner
                  ? 'Complete a collaboration to earn your first structured review.'
                  : 'No reviews yet. Be the first to collaborate!'}
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">

            {/* Reactions */}
            {!isOwner && (
              <div className="bg-surface border border-border rounded-xl p-5">
                <h2 className="font-semibold text-sm mb-3">React to this profile</h2>
                <div className="grid grid-cols-2 gap-2">
                  {REACTIONS.map(({ id, emoji, label }) => (
                    <button key={id} onClick={() => toggleReaction(id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all',
                        myReaction === id
                          ? 'bg-gold/15 border-gold/30 text-gold'
                          : 'bg-surface-2 border-border text-text-muted hover:text-text hover:border-gold/20'
                      )}>
                      <span className="text-base leading-none">{emoji}</span>
                      <span className="flex-1 text-left">{label}</span>
                      {reactions[id] > 0 && (
                        <span className={myReaction === id ? 'text-gold' : 'text-text-faint'}>{reactions[id]}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-semibold text-sm mb-3">Availability</h2>
              <div className="flex items-center gap-2.5">
                <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse', currentAvail.color)} />
                <span className="text-sm text-text-muted">{currentAvail.label}</span>
              </div>
            </div>

            {/* Verification badges */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award size={15} className="text-gold" />
                <h2 className="font-semibold text-sm">Credentials</h2>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Identity Verified',       active: profile.is_verified, future: false },
                  { label: 'Professional Verified',   active: false,               future: false },
                  { label: 'Background Checked',      active: false,               future: true  },
                  { label: 'Minor-Safe Certified',    active: false,               future: true  },
                ].map(({ label, active, future }) => (
                  <div key={label} className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs',
                    active   ? 'bg-gold/10 border border-gold/20 text-gold'
                    : future ? 'bg-surface-2 border border-border text-text-faint'
                    :          'bg-surface-2 border border-border text-text-faint'
                  )}>
                    {active
                      ? <CircleCheck size={13} className="text-gold flex-shrink-0" />
                      : <div className="w-3 h-3 rounded-full border border-border flex-shrink-0" />}
                    {label}
                    {future && <span className="ml-auto text-[10px] text-text-faint">Soon</span>}
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

            {/* Share */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Share2 size={15} className="text-gold" />
                <h2 className="font-semibold text-sm">Share Profile</h2>
              </div>
              <button onClick={copyLink}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:border-gold/40 hover:text-text transition-all mb-3">
                {copied
                  ? <CircleCheck size={12} className="text-green-400 flex-shrink-0" />
                  : <Copy size={12} className="flex-shrink-0" />}
                <span className="truncate flex-1 text-left">{profileUrl}</span>
                <span className="text-gold font-medium">{copied ? '✓' : 'Copy'}</span>
              </button>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: 'Share on X / Twitter', href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}` },
                  { label: 'Share on Facebook',    href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
                  { label: 'Share on LinkedIn',    href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:text-text hover:border-gold/20 transition-all">
                    {label}
                    <ExternalLink size={11} className="flex-shrink-0" />
                  </a>
                ))}
                <button onClick={copyLink}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2 border border-border text-xs text-text-muted hover:text-text hover:border-gold/20 transition-all">
                  Copy for Instagram / TikTok
                  <Copy size={11} className="flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* Connect CTA for visitors */}
            {!isOwner && (
              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                <p className="text-xs text-text-muted leading-relaxed mb-3">
                  <span className="text-gold font-semibold">Ready to work together?</span>{' '}
                  Post a free Collab Call or send a direct message.
                </p>
                <div className="flex gap-2">
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
    </div>
  )
}
