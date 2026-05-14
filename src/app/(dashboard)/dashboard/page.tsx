'use client'

import { useEffect, useState } from 'react'
import { Bell, TrendingUp, Calendar, Star, Briefcase, MessageSquare, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const recentActivity = [
  { type: 'campaign', text: 'New campaign posted near you', time: '2h ago', icon: Briefcase },
  { type: 'collab', text: 'Check the forum for new collab requests', time: '4h ago', icon: Users },
  { type: 'review', text: 'Complete your profile to get discovered', time: 'Now', icon: Star },
  { type: 'message', text: 'Welcome to Dotshot! Browse open campaigns', time: 'Just now', icon: MessageSquare },
]

export default function DashboardPage() {
  const [firstName, setFirstName] = useState('')
  const [tier, setTier] = useState('free')

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('full_name, subscription_tier')
        .eq('id', user.id)
        .single()
      if (data) {
        setFirstName(data.full_name.split(' ')[0])
        setTier(data.subscription_tier || 'free')
      }
    }
    loadUser()
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="text-text-muted text-sm">Here&apos;s what&apos;s happening with your Dotshot account.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text transition-colors">
            <Bell size={18} />
          </button>
          <Link href="/campaigns">
            <Button size="sm">Find Campaigns</Button>
          </Link>
        </div>
      </div>

      {/* Welcome card for new users */}
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 mb-8">
        <h2 className="font-semibold mb-1">Welcome to Dotshot! 🎯</h2>
        <p className="text-sm text-text-muted mb-3">You&apos;re in. Here&apos;s how to get started:</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/forum">
            <Button size="sm" variant="outline">Post a Collab Request</Button>
          </Link>
          <Link href="/campaigns">
            <Button size="sm" variant="outline">Browse Campaigns</Button>
          </Link>
          <Link href="/marketplace">
            <Button size="sm" variant="outline">Visit Marketplace</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity feed */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Activity</h2>
            <TrendingUp size={16} className="text-text-muted" />
          </div>
          <div className="flex flex-col gap-3">
            {recentActivity.map(({ type, text, time, icon: Icon }) => (
              <div key={type + text} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">{text}</p>
                  <p className="text-xs text-text-faint mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-3">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link href="/forum">
                <Button variant="secondary" className="w-full justify-start gap-3" size="sm">
                  <MessageSquare size={15} />
                  Post a Collab Request
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
