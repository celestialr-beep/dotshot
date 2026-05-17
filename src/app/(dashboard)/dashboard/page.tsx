'use client'

import { useEffect, useState } from 'react'
import {
  TrendingUp, Calendar, Star, Briefcase, MessageSquare,
  Users, ArrowRight, Plus, Camera,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { timeAgo } from '@/lib/utils'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// Curated welcome photo — swap the ID at unsplash.com
// Person holding camera in front of laptop — creative tools, studio vibe
// Swap the photo ID at unsplash.com to change the image
// Diverse creative team collaborating — swap photo ID at unsplash.com
const WELCOME_PHOTO =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

type FeedItem = {
  id: string
  type: 'forum' | 'campaign'
  title: string
  meta: string
  time: string
  href: string
  authorName?: string
  authorAvatar?: string | null
}

export default function DashboardPage() {
  const [firstName, setFirstName] = useState('')
  const [tier, setTier] = useState('free')
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [feedLoading, setFeedLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('full_name, subscription_tier, created_at')
        .eq('id', user.id)
        .single()

      if (data) {
        setFirstName(data.full_name.split(' ')[0])
        setTier(data.subscription_tier || 'free')
        // Consider new if account is less than 24 hours old
        const created = new Date(data.created_at).getTime()
        setIsNewUser(Date.now() - created < 86_400_000)
      }
    }

    async function loadFeed() {
      setFeedLoading(true)
      const [postsRes, campaignsRes] = await Promise.all([
        supabase
          .from('forum_posts')
          .select('id, title, category, created_at, author:profiles!author_id(full_name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('campaigns')
          .select('id, title, city, state, created_at')
          .in('status', ['open', 'casting'])
          .order('created_at', { ascending: false })
          .limit(3),
      ])

      const items: FeedItem[] = []

      for (const post of (postsRes.data ?? []) as unknown as {
        id: string; title: string; category: string; created_at: string;
        author: { full_name: string; avatar_url: string | null }
      }[]) {
        items.push({
          id: `post-${post.id}`,
          type: 'forum',
          title: post.title,
          meta: post.category === 'collab_request' ? 'Collab Call' : 'Forum Post',
          time: post.created_at,
          href: '/forum',
          authorName: post.author?.full_name,
          authorAvatar: post.author?.avatar_url ?? null,
        })
      }

      for (const campaign of (campaignsRes.data ?? []) as {
        id: string; title: string; city: string; state: string | null; created_at: string
      }[]) {
        items.push({
          id: `campaign-${campaign.id}`,
          type: 'campaign',
          title: campaign.title,
          meta: [campaign.city, campaign.state].filter(Boolean).join(', '),
          time: campaign.created_at,
          href: `/campaigns/${campaign.id}`,
        })
      }

      // Sort newest first
      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setFeed(items.slice(0, 5))
      setFeedLoading(false)
    }

    loadUser()
    loadFeed()
  }, [])

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">

      {/* ── Welcome hero (photo-backed) ── */}
      <div className="relative overflow-hidden rounded-2xl mb-8 min-h-[160px] sm:min-h-[200px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WELCOME_PHOTO}
          alt="Creative professionals at work"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/70 to-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />

        <div className="relative p-6 sm:p-8 h-full flex flex-col justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1 text-white drop-shadow">
              {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
            </h1>
            <p className="text-white/70 text-sm">
              {isNewUser
                ? "Welcome to Dotshot — your creative career starts here."
                : "Here's what's happening in your creative network."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <Link href="/forum">
              <Button size="sm" className="glow-gold backdrop-blur-sm">
                <MessageSquare size={14} />
                Post a Collab Call
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Briefcase size={14} />
                Browse Campaigns
              </Button>
            </Link>
            {isNewUser && (
              <Link href="/settings">
                <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Camera size={14} />
                  Complete Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Activity feed (real data) ── */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">What&apos;s Happening</h2>
            <TrendingUp size={16} className="text-text-muted" />
          </div>

          {feedLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-border flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-border rounded w-3/4" />
                    <div className="h-2 bg-border rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!feedLoading && feed.length === 0 && (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-3">
                <Briefcase size={18} className="text-gold" />
              </div>
              <p className="text-sm text-text-muted mb-1 font-medium">No activity yet</p>
              <p className="text-xs text-text-faint mb-4 max-w-xs">
                Be the first — post a Collab Call or list the first Crown &amp; Capture campaign.
              </p>
              <div className="flex gap-2">
                <Link href="/forum">
                  <Button size="sm" variant="outline">Post a Collab Call</Button>
                </Link>
                <Link href="/campaigns/new">
                  <Button size="sm">
                    <Plus size={13} />
                    New Campaign
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!feedLoading && feed.length > 0 && (
            <div className="flex flex-col gap-1">
              {feed.map((item) => (
                <Link key={item.id} href={item.href}>
                  <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0 hover:bg-surface-2 -mx-2 px-2 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.type === 'forum' ? (
                        <MessageSquare size={14} className="text-gold" />
                      ) : (
                        <Briefcase size={14} className="text-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text font-medium truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-text-faint">{item.meta}</span>
                        {item.authorName && (
                          <>
                            <span className="text-text-faint text-xs">·</span>
                            <span className="text-xs text-text-faint">{item.authorName}</span>
                          </>
                        )}
                        <span className="text-text-faint text-xs">·</span>
                        <span className="text-xs text-text-faint">{timeAgo(item.time)}</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-text-faint flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!feedLoading && feed.length > 0 && (
            <div className="flex gap-3 mt-4 pt-3 border-t border-border">
              <Link href="/forum" className="text-xs text-gold hover:underline">
                View all forum posts →
              </Link>
              <Link href="/campaigns" className="text-xs text-gold hover:underline">
                View all campaigns →
              </Link>
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4">

          {/* Quick actions */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-3">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link href="/forum">
                <Button variant="secondary" className="w-full justify-start gap-3" size="sm">
                  <MessageSquare size={15} />
                  Post a Collab Call
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button variant="secondary" className="w-full justify-start gap-3" size="sm">
                  <Briefcase size={15} />
                  Browse Campaigns
                </Button>
              </Link>
              <Link href="/network">
                <Button variant="secondary" className="w-full justify-start gap-3" size="sm">
                  <Users size={15} />
                  Grow Your Network
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="secondary" className="w-full justify-start gap-3" size="sm">
                  <Star size={15} />
                  Visit Marketplace
                </Button>
              </Link>
            </div>
          </div>

          {/* Upgrade CTA — only show for free users */}
          {tier === 'free' && (
            <div className="bg-gold/5 border border-gold/30 rounded-xl p-5">
              <Badge variant="gold" className="mb-3 text-xs">Upgrade</Badge>
              <h3 className="font-semibold mb-2">Unlock paid campaigns</h3>
              <p className="text-xs text-text-muted mb-3 leading-relaxed">
                Upgrade to Pro to apply for paid Crown &amp; Capture sessions and get priority placement.
              </p>
              <Button size="sm" className="w-full">Upgrade — $6.99/mo</Button>
            </div>
          )}

          {/* Upcoming */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-gold" />
              <h2 className="font-semibold">Upcoming</h2>
            </div>
            <p className="text-sm text-text-muted">No upcoming sessions booked yet.</p>
            <Link href="/campaigns" className="text-xs text-gold hover:underline mt-2 block">
              Browse open campaigns →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
