'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, DollarSign, Users, Calendar, Briefcase, Star, SlidersHorizontal, X, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ROLE_LABELS, ROLE_COLORS, ROLE_GROUPS, formatCurrency, formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'
import Link from 'next/link'

type Campaign = {
  id: string
  title: string
  description: string
  location: string
  city: string
  budget_min: number
  budget_max: number
  roles_needed: UserRole[]
  start_date: string
  status: 'open' | 'casting' | 'in_progress' | 'completed' | 'cancelled'
  is_featured: boolean
  application_count: number
  client: {
    username: string
    full_name: string
    avatar_url: string | null
    is_verified: boolean
  }
}

const statusColors: Record<string, string> = {
  open: 'bg-green-500/20 text-green-300 border-green-500/30',
  casting: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  in_progress: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  completed: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
}

const statusLabels: Record<string, string> = {
  open: 'Open', casting: 'Casting', in_progress: 'In Progress', completed: 'Completed',
}

const industryTabs = [
  { label: 'All', roles: [] as UserRole[] },
  ...ROLE_GROUPS.filter(g => g.label !== 'Other').map(g => ({ label: g.label, roles: g.roles })),
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])
  const [showRoleFilter, setShowRoleFilter] = useState(false)

  useEffect(() => {
    async function loadCampaigns() {
      setLoading(true)
      const { data } = await supabase
        .from('campaigns')
        .select(`
          id, title, description, location, city, budget_min, budget_max,
          roles_needed, start_date, status, is_featured, application_count,
          client:profiles!client_id(username, full_name, avatar_url, is_verified)
        `)
        .in('status', ['open', 'casting'])
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(40)

      setCampaigns((data as unknown as Campaign[]) ?? [])
      setLoading(false)
    }
    loadCampaigns()
  }, [])

  const currentTabRoles = industryTabs[activeTab].roles

  const filtered = campaigns.filter((c) => {
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchTab = activeTab === 0 || c.roles_needed.some(r => currentTabRoles.includes(r))
    const matchRoles = selectedRoles.length === 0 || selectedRoles.some(r => c.roles_needed.includes(r))
    return matchSearch && matchTab && matchRoles
  })

  function toggleRole(role: UserRole) {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role])
  }

  function clearFilters() {
    setSelectedRoles([])
    setSearch('')
    setActiveTab(0)
  }

  const hasFilters = search || selectedRoles.length > 0 || activeTab > 0
  const isEmpty = !loading && campaigns.length === 0

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Crown &amp; Capture</h1>
          <p className="text-text-muted text-sm">Paid opportunities for every creative role.</p>
        </div>
        <div className="flex gap-2 items-center">
          {!loading && campaigns.length > 0 && (
            <Badge variant="muted" className="text-xs">
              <Briefcase size={11} />
              {campaigns.filter(c => c.status === 'open').length} Open
            </Badge>
          )}
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

      {/* Role chip filters */}
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

      {/* Active role chips */}
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
      {!loading && !isEmpty && (
        <p className="text-xs text-text-faint mb-4">
          {filtered.length} campaign{filtered.length !== 1 ? 's' : ''} found
          {activeTab > 0 && ` in ${industryTabs[activeTab].label}`}
          {selectedRoles.length > 0 && ` · ${selectedRoles.length} role filter${selectedRoles.length > 1 ? 's' : ''}`}
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2.5">
                  <div className="h-3 bg-border rounded w-1/4" />
                  <div className="h-5 bg-border rounded w-3/4" />
                  <div className="h-3 bg-border rounded w-full" />
                  <div className="h-3 bg-border rounded w-5/6" />
                  <div className="flex gap-2 mt-2">
                    {[1,2,3].map(j => <div key={j} className="h-5 bg-border rounded-full w-20" />)}
                  </div>
                </div>
                <div className="w-28 flex-shrink-0 space-y-2">
                  <div className="h-8 bg-border rounded w-full" />
                  <div className="h-8 bg-border rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
            <Sparkles size={28} className="text-gold" />
          </div>
          <h2 className="text-lg font-bold mb-2">The First Campaign Here Is Yours</h2>
          <p className="text-text-muted text-sm max-w-sm mb-4 leading-relaxed">
            No paid campaigns are posted yet — but they will be. Every brand, artist,
            and creator with a real project will post here. You can be the first.
          </p>
          <p className="text-xs text-text-faint max-w-xs mb-8 leading-relaxed">
            Are you a brand, studio, or artist with an upcoming shoot, event, or production?
            Post your campaign now and let the right creatives come to you.
          </p>
          <Link href="/campaigns/new">
            <Button size="lg" className="glow-gold">Post the First Campaign</Button>
          </Link>
        </div>
      )}

      {/* Search/filter empty */}
      {!loading && !isEmpty && filtered.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-1">No campaigns match your filters</p>
          <p className="text-sm mb-4">Try removing some filters or searching differently.</p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-gold text-sm hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Real campaigns */}
      {!loading && filtered.length > 0 && (
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
                        {campaign.application_count} applicant{campaign.application_count !== 1 ? 's' : ''}
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
                      <Avatar name={campaign.client.full_name} src={campaign.client.avatar_url} size="xs" />
                      <span className="text-xs text-text-muted">{campaign.client.full_name}</span>
                    </div>
                    <Button size="sm" className="flex-shrink-0">Apply Now</Button>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
