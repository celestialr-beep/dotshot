'use client'

import { useState } from 'react'
import { Search, MapPin, DollarSign, Users, Calendar, Briefcase, Star, SlidersHorizontal, X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ROLE_LABELS, ROLE_COLORS, ROLE_GROUPS, formatCurrency, formatDate } from '@/lib/utils'
import type { UserRole } from '@/types'
import Link from 'next/link'

const mockCampaigns = [
  {
    id: '1',
    title: 'Crown & Capture: LuxSkin Fall Campaign',
    description: 'Premium skincare brand seeking full creative team for 2-day editorial campaign. High-end luxury aesthetic. Must be able to work in studio and outdoor settings.',
    location: 'Orlando, FL', city: 'Orlando',
    budget_min: 800, budget_max: 1200,
    roles_needed: ['photographer', 'makeup_artist', 'hairstylist', 'model'] as UserRole[],
    start_date: '2026-06-15', status: 'open' as const,
    is_featured: true, application_count: 23,
    client: { username: 'luxskin_brand', full_name: 'LuxSkin Official', avatar_url: null, is_verified: true },
  },
  {
    id: '2',
    title: 'Music Video — R&B Artist Promo Shoot',
    description: 'Local R&B artist looking for videographer, choreographer, dancers, and makeup for upcoming single release. Moody, cinematic vibes.',
    location: 'Orlando, FL', city: 'Orlando',
    budget_min: 400, budget_max: 700,
    roles_needed: ['videographer', 'dancer', 'choreographer', 'makeup_artist'] as UserRole[],
    start_date: '2026-06-08', status: 'open' as const,
    is_featured: false, application_count: 15,
    client: { username: 'kingdre_music', full_name: 'King Dre', avatar_url: null, is_verified: false },
  },
  {
    id: '3',
    title: 'Grand Opening Event — Miami Boutique',
    description: 'New Miami boutique opening needs DJ, host/emcee, event photographer, and social media coverage for launch night.',
    location: 'Miami, FL', city: 'Miami',
    budget_min: 1500, budget_max: 2500,
    roles_needed: ['dj', 'host_emcee', 'photographer', 'social_media_manager'] as UserRole[],
    start_date: '2026-07-01', status: 'casting' as const,
    is_featured: true, application_count: 41,
    client: { username: 'glowboutique_mia', full_name: 'Glow Boutique Miami', avatar_url: null, is_verified: true },
  },
  {
    id: '4',
    title: 'Corporate Headshots + Team Photos',
    description: 'Tech startup in need of clean, modern headshots for 30+ team members. Looking for an efficient photographer with post-processing included.',
    location: 'Orlando, FL', city: 'Orlando',
    budget_min: 600, budget_max: 800,
    roles_needed: ['photographer', 'retoucher'] as UserRole[],
    start_date: '2026-05-28', status: 'open' as const,
    is_featured: false, application_count: 9,
    client: { username: 'techlaunch_orl', full_name: 'TechLaunch Inc.', avatar_url: null, is_verified: false },
  },
  {
    id: '5',
    title: 'Comedy Show Promo — Full Production',
    description: 'Stand-up comedian needs a full promo package: videographer, photographer, graphic designer, and writer for press release and social copy.',
    location: 'Orlando, FL', city: 'Orlando',
    budget_min: 300, budget_max: 600,
    roles_needed: ['videographer', 'photographer', 'writer'] as UserRole[],
    start_date: '2026-06-20', status: 'open' as const,
    is_featured: false, application_count: 7,
    client: { username: 'jokesbyray', full_name: 'Ray Combs Jr.', avatar_url: null, is_verified: false },
  },
  {
    id: '6',
    title: 'Dance Recital — Production & Costumes',
    description: 'Dance studio seeking choreographer, costume designer, lighting designer, and videographer for annual recital production.',
    location: 'Orlando, FL', city: 'Orlando',
    budget_min: 1000, budget_max: 1800,
    roles_needed: ['choreographer', 'costume_designer', 'lighting_designer', 'videographer'] as UserRole[],
    start_date: '2026-07-12', status: 'open' as const,
    is_featured: false, application_count: 12,
    client: { username: 'elite_dance_orl', full_name: 'Elite Dance Studio', avatar_url: null, is_verified: true },
  },
]

const statusColors: Record<string, string> = {
  open: 'bg-green-500/20 text-green-300 border-green-500/30',
  casting: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  in_progress: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  completed: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
}

const statusLabels: Record<string, string> = {
  open: 'Open', casting: 'Casting', in_progress: 'In Progress', completed: 'Completed',
}

// Industry tabs built from ROLE_GROUPS
const industryTabs = [
  { label: 'All', roles: [] as UserRole[] },
  ...ROLE_GROUPS.filter(g => g.label !== 'Other').map(g => ({ label: g.label, roles: g.roles })),
]

export default function CampaignsPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])
  const [showRoleFilter, setShowRoleFilter] = useState(false)

  const currentTabRoles = industryTabs[activeTab].roles

  const filtered = mockCampaigns.filter((c) => {
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())

    // Tab filter — campaign must need at least one role in this industry
    const matchTab = activeTab === 0 || c.roles_needed.some(r => currentTabRoles.includes(r))

    // Role chip filter — if any specific roles selected, campaign must need them
    const matchRoles = selectedRoles.length === 0 ||
      selectedRoles.some(r => c.roles_needed.includes(r))

    return matchSearch && matchTab && matchRoles
  })

  function toggleRole(role: UserRole) {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  function clearFilters() {
    setSelectedRoles([])
    setSearch('')
    setActiveTab(0)
  }

  const hasFilters = search || selectedRoles.length > 0 || activeTab > 0

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Campaigns</h1>
          <p className="text-text-muted text-sm">Crown &amp; Capture — paid opportunities for every creative.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="muted" className="text-xs">
            <Briefcase size={11} />
            {mockCampaigns.filter(c => c.status === 'open').length} Open
          </Badge>
          <Link href="/campaigns/new">
            <Button size="sm">Post a Campaign</Button>
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search campaigns by title, role, or keyword..."
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <button
          onClick={() => setShowRoleFilter(!showRoleFilter)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-colors ${
            showRoleFilter || selectedRoles.length > 0
              ? 'bg-gold/15 border-gold/40 text-gold'
              : 'bg-surface border-border text-text-muted hover:text-text'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters {selectedRoles.length > 0 && `(${selectedRoles.length})`}
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm border border-border text-text-muted hover:text-text bg-surface transition-colors"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Industry tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-4 scrollbar-hide">
        {industryTabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => { setActiveTab(i); setSelectedRoles([]) }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === i
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'bg-surface border border-border text-text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Role chip filters — shown within selected industry */}
      {showRoleFilter && (
        <div className="bg-surface border border-border rounded-xl p-4 mb-4">
          <p className="text-xs text-text-faint font-semibold uppercase tracking-wider mb-3">
            Filter by specific role
          </p>
          <div className="flex flex-wrap gap-2">
            {(activeTab === 0 ? ROLE_GROUPS.flatMap(g => g.roles) : currentTabRoles).map(role => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedRoles.includes(role)
                    ? `${ROLE_COLORS[role]} opacity-100`
                    : 'bg-surface border-border text-text-muted hover:border-border-light'
                }`}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active role filters shown as chips */}
      {selectedRoles.length > 0 && !showRoleFilter && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedRoles.map(role => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${ROLE_COLORS[role]}`}
            >
              {ROLE_LABELS[role]} <X size={11} />
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-text-faint mb-4">
        {filtered.length} campaign{filtered.length !== 1 ? 's' : ''} found
        {activeTab > 0 && ` in ${industryTabs[activeTab].label}`}
        {selectedRoles.length > 0 && ` · filtered by ${selectedRoles.length} role${selectedRoles.length > 1 ? 's' : ''}`}
      </p>

      {/* Campaigns list */}
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
                      <Users size={11} /> Needs:
                    </span>
                    {campaign.roles_needed.map((role) => (
                      <Badge key={role} className={`text-xs ${ROLE_COLORS[role] ?? ''}`}>
                        {ROLE_LABELS[role] ?? role}
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
          <div className="text-center py-16 text-text-muted">
            <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium mb-1">No campaigns found</p>
            <p className="text-sm mb-4">
              {hasFilters ? 'Try removing some filters or searching differently.' : 'Be the first to post a campaign in this category.'}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-gold text-sm hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
