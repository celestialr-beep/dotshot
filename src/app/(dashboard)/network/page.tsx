'use client'

import { useState } from 'react'
import { Search, MapPin, Star, CheckCircle, Filter } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/utils'
import type { UserRole } from '@/types'
import Link from 'next/link'

const mockCreatives = [
  {
    id: '1', username: 'marcus_shots', full_name: 'Marcus Patterson',
    role: 'photographer' as UserRole, location: 'Orlando, FL',
    rating: 4.9, review_count: 38, is_verified: true,
    bio: 'Editorial & fashion photographer. 7+ years.',
    subscription_tier: 'pro',
    specialties: ['Fashion', 'Editorial', 'Portrait'],
    avatar_url: null,
  },
  {
    id: '2', username: 'sofia_glam', full_name: 'Sofia Morales',
    role: 'makeup_artist' as UserRole, location: 'Orlando, FL',
    rating: 5.0, review_count: 52, is_verified: true,
    bio: 'Luxury MUA. Editorial, bridal, and campaign work.',
    subscription_tier: 'elite',
    specialties: ['Editorial', 'Bridal', 'SFX'],
    avatar_url: null,
  },
  {
    id: '3', username: 'rex_films', full_name: 'Rex Williams',
    role: 'videographer' as UserRole, location: 'Miami, FL',
    rating: 4.8, review_count: 29, is_verified: true,
    bio: 'Cinematic storytelling for brands and artists.',
    subscription_tier: 'pro',
    specialties: ['Cinematic', 'Music Video', 'Brand'],
    avatar_url: null,
  },
  {
    id: '4', username: 'jayla_hair', full_name: 'Jayla Thompson',
    role: 'hairstylist' as UserRole, location: 'Orlando, FL',
    rating: 4.7, review_count: 21, is_verified: false,
    bio: 'Natural hair specialist. Braids, weaves, editorial.',
    subscription_tier: 'free',
    specialties: ['Natural', 'Braids', 'Editorial'],
    avatar_url: null,
  },
  {
    id: '5', username: 'nia_style', full_name: 'Nia Davis',
    role: 'stylist' as UserRole, location: 'Orlando, FL',
    rating: 4.6, review_count: 14, is_verified: false,
    bio: 'Fashion stylist with eye for editorial and commercial.',
    subscription_tier: 'pro',
    specialties: ['Fashion', 'Commercial', 'Celebrity'],
    avatar_url: null,
  },
  {
    id: '6', username: 'bella_model', full_name: 'Isabella Rosa',
    role: 'model' as UserRole, location: 'Miami, FL',
    rating: 4.9, review_count: 67, is_verified: true,
    bio: 'Commercial and editorial model. International bookings.',
    subscription_tier: 'elite',
    specialties: ['Editorial', 'Commercial', 'Runway'],
    avatar_url: null,
  },
]

const roleFilters = [
  { value: 'all', label: 'All Roles' },
  { value: 'photographer', label: 'Photographers' },
  { value: 'videographer', label: 'Videographers' },
  { value: 'makeup_artist', label: 'Makeup Artists' },
  { value: 'hairstylist', label: 'Hairstylists' },
  { value: 'model', label: 'Models' },
  { value: 'stylist', label: 'Stylists' },
]

export default function NetworkPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = mockCreatives.filter((c) => {
    const matchSearch = !search || c.full_name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || c.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Creative Network</h1>
        <p className="text-text-muted text-sm">Find photographers, videographers, MUAs, and more near you.</p>
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
          {roleFilters.map(({ value, label }) => (
            <option key={value} value={value} className="bg-surface">{label}</option>
          ))}
        </select>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-muted hover:text-text transition-colors">
          <Filter size={15} />
          Filter
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((creative) => (
          <Link key={creative.id} href={`/profile/${creative.username}`}>
            <div className="bg-surface border border-border rounded-xl p-5 card-hover h-full">
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={creative.full_name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm truncate">{creative.full_name}</span>
                    {creative.is_verified && <CheckCircle size={13} className="text-gold flex-shrink-0" fill="currentColor" />}
                  </div>
                  <span className="text-xs text-text-muted">@{creative.username}</span>
                </div>
                {creative.subscription_tier === 'elite' && (
                  <Badge variant="gold" className="text-xs flex-shrink-0">Elite</Badge>
                )}
              </div>

              <Badge className={`${ROLE_COLORS[creative.role]} mb-3`}>
                {ROLE_LABELS[creative.role]}
              </Badge>

              <p className="text-xs text-text-muted line-clamp-2 mb-3">{creative.bio}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-text-muted">
                  <MapPin size={10} /> {creative.location}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Star size={11} className="text-gold" fill="currentColor" />
                  {creative.rating}
                  <span className="text-text-faint">({creative.review_count})</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {creative.specialties.map((s) => (
                  <Badge key={s} variant="muted" className="text-xs">{s}</Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No creatives found</p>
          <p className="text-sm">Try a different search or filter.</p>
        </div>
      )}
    </div>
  )
}
