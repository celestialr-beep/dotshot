'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Camera, FileText, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CaseStudyCard } from './CaseStudyCard'
import type { CaseStudy, CaseStudyType } from './CaseStudyCard'
import { cn } from '@/lib/utils'

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS: { id: CaseStudyType; label: string; icon: React.ElementType }[] = [
  { id: 'campaign', label: 'Campaigns', icon: Briefcase },
  { id: 'bts',      label: 'BTS',       icon: Camera },
  { id: 'credits',  label: 'Credits',   icon: FileText },
]

const EMPTY_MESSAGES: Record<CaseStudyType, { owner: string; visitor: string }> = {
  campaign: {
    owner:   'Add your first campaign — showcase a completed paid project.',
    visitor: 'No campaigns yet.',
  },
  bts: {
    owner:   'Behind-the-scenes content builds trust. Add your first BTS.',
    visitor: 'No BTS content yet.',
  },
  credits: {
    owner:   'Credit your collaborators and document your creative roles.',
    visitor: 'No credits posted yet.',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CaseStudiesProps {
  profileId: string
  isOwner: boolean
}

export function CaseStudies({ profileId, isOwner }: CaseStudiesProps) {
  const [activeTab, setActiveTab] = useState<CaseStudyType>('campaign')
  const [studies, setStudies]     = useState<CaseStudy[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('case_studies')
        .select('*')
        .eq('creator_id', profileId)
        .order('date', { ascending: false })

      setStudies(data ?? [])
      setLoading(false)
    }
    load()
  }, [profileId])

  const filtered = studies.filter((s) => s.type === activeTab)

  function handlePublish(study: CaseStudy) {
    // TODO: open PublishSheet drawer — Phase 1
    console.log('Publish:', study.id)
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border overflow-x-auto scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap flex-shrink-0 border-b-2 -mb-px transition-all',
              activeTab === id
                ? 'text-gold border-gold'
                : 'text-text-muted border-transparent hover:text-text'
            )}
          >
            <Icon size={13} />
            {label}
            {studies.filter((s) => s.type === id).length > 0 && (
              <span className={cn(
                'ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold',
                activeTab === id ? 'bg-gold/20 text-gold' : 'bg-surface-2 text-text-faint'
              )}>
                {studies.filter((s) => s.type === id).length}
              </span>
            )}
          </button>
        ))}

        {/* Add button for owner */}
        {isOwner && (
          <button
            className="ml-auto flex items-center gap-1 px-4 py-3 text-xs text-text-muted hover:text-gold transition-colors flex-shrink-0"
            title="Add case study"
          >
            <Plus size={13} />
            Add
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl bg-surface-2 h-52" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((study) => (
              <CaseStudyCard
                key={study.id}
                study={study}
                isOwner={isOwner}
                onPublish={handlePublish}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-3">
              {activeTab === 'campaign' && <Briefcase size={20} className="text-text-faint opacity-40" />}
              {activeTab === 'bts'      && <Camera    size={20} className="text-text-faint opacity-40" />}
              {activeTab === 'credits'  && <FileText  size={20} className="text-text-faint opacity-40" />}
            </div>
            <p className="text-sm text-text-faint">
              {isOwner
                ? EMPTY_MESSAGES[activeTab].owner
                : EMPTY_MESSAGES[activeTab].visitor}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
