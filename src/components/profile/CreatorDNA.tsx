'use client'

import { Sparkles, Clock, DollarSign, Handshake, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreatorDNAProps {
  profile: {
    aesthetic_tags?: string[] | null
    turnaround_days?: string | null
    budget_range?: string | null
    open_to?: string | null
    works_best?: string | null
  }
  isOwner: boolean
}

export function CreatorDNA({ profile, isOwner }: CreatorDNAProps) {
  const tags      = profile.aesthetic_tags ?? []
  const hasPrefs  = profile.turnaround_days || profile.budget_range || profile.open_to || profile.works_best
  const hasAnything = tags.length > 0 || hasPrefs

  if (!hasAnything) {
    if (!isOwner) return null
    // Owner — show empty state with prompt
    return (
      <div className="bg-surface border border-border rounded-xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={15} className="text-gold" />
          <h2 className="font-semibold text-sm">Creator DNA</h2>
        </div>
        <p className="text-xs text-text-faint text-center py-4">
          Add your aesthetic tags and working preferences in{' '}
          <a href="/settings" className="text-gold hover:underline">Settings</a>{' '}
          so collaborators know how you work.
        </p>
      </div>
    )
  }

  const prefs = [
    { icon: Clock,      label: 'Turnaround', value: profile.turnaround_days },
    { icon: DollarSign, label: 'Budget',     value: profile.budget_range },
    { icon: Handshake,  label: 'Open to',    value: profile.open_to },
    { icon: Users,      label: 'Works best', value: profile.works_best },
  ].filter((p) => !!p.value)

  return (
    <div className="bg-surface border border-border rounded-xl p-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={15} className="text-gold" />
        <h2 className="font-semibold text-sm">Creator DNA</h2>
      </div>

      {/* Aesthetic tags */}
      {tags.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-text-faint mb-2">Aesthetic</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-xs text-gold font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Working prefs grid */}
      {prefs.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {prefs.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-surface-2 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={11} className="text-text-faint" />
                <span className="text-[10px] uppercase tracking-wider text-text-faint">{label}</span>
              </div>
              <span className="text-xs font-medium text-text">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
