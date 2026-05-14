'use client'

import { useState } from 'react'
import { Search, MapPin, DollarSign, Users, Calendar, Filter, Briefcase, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ROLE_LABELS, ROLE_COLORS, formatCurrency, formatDate } from '@/lib/utils'
import type { UserRole } from '@/types'
import Link from 'next/link'

const mockCampaigns = [
  {
    id: '1',
    title: 'Crown & Capture: LuxSkin Fall Campaign',
    description: 'Premium skincare brand seeking full creative team for 2-day editorial campaign. High-end luxury aesthetic. Must be able to work in studio and outdoor settings.',
    location: 'Orlando, FL',
    city: 'Orlando',
    budget_min: 800,
    budget_max: 1200,
    roles_needed: ['photographer', 'makeup_artist', 'hairstylist', 'model'] as UserRole[],
    start_date: '2026-06-15',
    status: 'open' as const,
    is_featured: true,
    application_count: 23,
    client: { username: 'luxskin_brand', full_name: 'LuxSkin Official', avatar_url: null, is_verified: true },
  },
  {
    id: '2',
    title: 'Music Video — R&B Artist Promo Shoot',
    description: 'Local R&B artist looking for videographer, photographer, and makeup artist for upcoming single release. Moody, cinematic vibes.',
    location: 'Orlando, FL',
    city: 'Orlando',
    budget_min: 400,
    budget_max: 700,
    roles_needed: ['videographer', 'photographer', 'makeup_artist'] as UserRole[],
    start_date: '2026-06-08',
    status: 'open' as const,
    is_featured: false,
    application_count: 15,
    client: { username: 'kingdre_music', full_name: 'King Dre', avatar_url: null, is_verified: false },
  },
  {
    id: '3',
    title: 'Beauty Brand Launch — Miami Boutique',
    description: 'New Miami beauty boutique opening needs a full content team for social media content, website imagery, and launch event coverage.',
    location: 'Miami, FL',
    city: 'Miami',
    budget_min: 1500,
    budget_max: 2500,
    roles_needed: ['photographer', 'videographer', 'makeup_artist', 'hairstylist', 'stylist'] as UserRole[],
    start_date: '2026-07-01',
    status: 'casting' as const,
    is_featured: true,
    application_count: 41,
    client: { username: 'glowboutique_mia', full_name: 'Glow Boutique Miami', avatar_url: null, is_verified: true },
  },
  {
    id: '4',
    title: 'Corporate Headshots + Team Photos',
    description: 'Tech startup in need of clean, modern headshots for 30+ team members. Looking for an efficient photographer with post-processing included.',
    location: 'Orlando, FL',
    city: 'Orlando',
    budget_min: 600,
    budget_max: 800,
    roles_needed: ['photographer', 'retoucher'] as UserRole[],
    start_date: '2026-05-28',
    status: 'open' as const,
    is_featured: false,
    application_count: 9,
    client: { username: 'techlaunch_orl', full_name: 'TechLaunch Inc.', avatar_url: null, is_verified: false },
  },
]

const statusColors: Record<string, string> = {
  open: 'bg-green-500/20 text-green-300 border-green-500/30',
  casting: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  in_progress: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  completed: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
}

const statusLabels: Record<string, string> = {
  open: 'Open',
  casting: 'Casting',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export default function CampaignsPage() {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')

  const filtered = mockCampaigns.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase())
    const matchLocation = locationFilter === 'all' || c.city === locationFilter
    return matchSearch && matchLocation
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Campaigns</h1>
          <p className="text-text-muted text-sm">Crown & Capture sessions — paid opportunities for creative teams.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="muted" className="text-xs">
            <Briefcase size={11} />
            {mockCampaigns.filter(c => c.status === 'open').length} Open
          </Badge>
          <Link href="/campaigns/post">
            <Button size="sm" variant="outline">Post a Campaign</Button>
          </Link>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold transition-colors"
        >
          <option value="all">All Locations</option>
          <option value="Orlando">Orlando, FL</option>
          <option value="Miami">Miami, FL</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-muted hover:text-text transition-colors">
          <Filter size={15} />
          More Filters
        </button>
      </div>

      {/* Campaigns */}
      <div className="flex flex-col gap-4">
        {filtered.map((campaign) => (
          <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
            <article className="bg-surface border border-border rounded-xl p-5 card-hover">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {campaign.is_featured && (
                      <Badge variant="gold" className="text-xs">
                        <Star size={9} fill="currentColor" /> Featured
                      </Badge>
                    )}
                    <Badge className={statusColors[campaign.status]}>
                      {statusLabels[campaign.status]}
                    </Badge>
                    <span className="text-xs text-text-faint ml-auto">
                      {campaign.application_count} applicants
                    </span>
                  </div>

                  <h2 className="font-semibold text-text mb-1.5">{campaign.title}</h2>
                  <p className="text-sm text-text-muted line-clamp-2 mb-3">{campaign.description}</p>

                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin size={12} /> {campaign.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <DollarSign size={12} /> {formatCurrency(campaign.budget_min)}–{formatCurrency(campaign.budget_max)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Calendar size={12} /> {formatDate(campaign.start_date)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs text-text-faint flex items-center gap-1 mr-1">
                      <Users size={11} /> Roles:
                    </span>
                    {campaign.roles_needed.map((role) => (
                      <Badge key={role} className={`text-xs ${ROLE_COLORS[role]}`}>
                        {ROLE_LABELS[role]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Avatar name={campaign.client.full_name} size="xs" />
                    <span className="text-xs text-text-muted">{campaign.client.full_name}</span>
                  </div>
                  <Button size="sm" className="flex-shrink-0">Apply Now</Button>
                </div>
              </div>
            </article>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No campaigns found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
