'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, CheckCircle, Filter, Users } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ROLE_LABELS, ROLE_COLORS, ROLE_GROUPS } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'
import Link from 'next/link'

type Creative = {
  id: string
  username: string
  full_name: string
  role: UserRole
  location: string | null
  bio: string | null
  avatar_url: string | null
  subscription_tier: string | null
}

const roleFilters = [
  { value: 'all', label: 'All Roles' },
  ...ROLE_GROUPS.flatMap((g) =>
    g.roles.map((r) => ({ value: r, label: ROLE_LABELS[r] }))
  ),
]

export default function NetworkPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCreatives() {
      setLoading(true)
      const { data } = await supabase
        .from('profiles')
        .select('id, username, full_name, role, location, bio, avatar_url, subscription_tier')
        .not('role', 'is', null)
        .order('created_at', { ascending: false })
        .limit(60)

      setCreatives((data as Creative[]) ?? [])
      setLoading(false)
    }
    loadCreatives()
  }, [])

  const filtered = creatives.filter((c) => {
    const matchSearch =
      !search ||
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.location ?? '').toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || c.role === (roleFilter as UserRole)
    return matchSearch && matchRole
  })

  const isEmpty = !loading && creatives.length === 0

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Creative Network</h1>
        <p className="text-text-muted text-sm">
          Real creative professionals in your city — photographers, MUAs, stylists, musicians, and more.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold transition-colors"
        >
          <option value="all" className="bg-surface">All Roles</option>
          {ROLE_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.roles.map((r) => (
                <option key={r} value={r} className="bg-surface">{ROLE_LABELS[r]}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-border flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-border rounded w-3/4" />
                  <div className="h-3 bg-border rounded w-1/2" />
                </div>
              </div>
              <div className="h-5 bg-border rounded w-1/3 mb-3" />
              <div className="h-3 bg-border rounded w-full mb-1" />
              <div className="h-3 bg-border rounded w-4/5" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state — honest, no fake accounts */}
      {isEmpty && (
        <div className="flex flex-col items-center text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
            <Users size={28} className="text-gold" />
          </div>
          <h2 className="text-lg font-bold mb-2">Your City's Creative Network Starts Here</h2>
          <p className="text-text-muted text-sm max-w-sm mb-6 leading-relaxed">
            Every photographer, MUA, hairstylist, model, musician, and director in your city
            will have a home here. Right now the network is forming — and you're one of the first in it.
          </p>
          <p className="text-xs text-text-faint mb-8 max-w-xs leading-relaxed">
            Complete your own profile so other creatives can find you. The more complete your
            profile, the more collaboration invites you'll receive when the network grows.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="lg">
              Complete My Profile
            </Button>
            <Button size="lg" className="glow-gold">
              Post a Collab Call
            </Button>
          </div>
        </div>
      )}

      {/* Search empty */}
      {!loading && !isEmpty && filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No creatives match your search</p>
          <p className="text-sm">Try a different name, location, or role.</p>
        </div>
      )}

      {/* Real profiles grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((creative) => (
            <Link key={creative.id} href={`/profile/${creative.username}`}>
              <div className="bg-surface border border-border rounded-xl p-5 card-hover h-full">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name={creative.full_name} src={creative.avatar_url} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm truncate">{creative.full_name}</span>
                    </div>
                    <span className="text-xs text-text-muted">@{creative.username}</span>
                  </div>
                  {creative.subscription_tier === 'elite' && (
                    <Badge variant="gold" className="text-xs flex-shrink-0">Elite</Badge>
                  )}
                </div>

                {creative.role && (
                  <Badge className={`${ROLE_COLORS[creative.role]} mb-3`}>
                    {ROLE_LABELS[creative.role]}
                  </Badge>
                )}

                {creative.bio && (
                  <p className="text-xs text-text-muted line-clamp-2 mb-3">{creative.bio}</p>
                )}

                {creative.location && (
                  <span className="flex items-center gap-1 text-xs text-text-faint">
                    <MapPin size={10} /> {creative.location}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
