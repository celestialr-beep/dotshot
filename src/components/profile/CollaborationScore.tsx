'use client'

import { CheckCircle, Star, Clock, Zap, Shield, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollaborationScoreProps {
  profile: {
    completed_projects?: number | null
    professionalism_rating?: number | null
    response_rate?: number | null
    cancellation_rate?: number | null
    badge_top_collaborator?: boolean | null
    badge_fast_responder?: boolean | null
    badge_id_verified?: boolean | null
    badge_background_checked?: boolean | null
    badge_minor_safe?: boolean | null
    is_verified?: boolean
  }
}

export function CollaborationScore({ profile }: CollaborationScoreProps) {
  const completed = profile.completed_projects ?? 0
  const rating    = profile.professionalism_rating ?? null
  const response  = profile.response_rate ?? null

  const isEmpty = completed === 0 && rating === null && response === null

  const stats = [
    {
      icon: CheckCircle,
      label: 'Completed Collabs',
      value: completed.toString(),
      color: 'text-green-400',
      iconBg: 'bg-green-400/10',
    },
    {
      icon: Star,
      label: 'Professionalism',
      value: rating !== null ? `${Number(rating).toFixed(1)} / 5` : '—',
      color: 'text-gold',
      iconBg: 'bg-gold/10',
    },
    {
      icon: Clock,
      label: 'Response Rate',
      value: response !== null ? `${response}%` : '—',
      color: 'text-blue-400',
      iconBg: 'bg-blue-400/10',
    },
  ]

  const badges: { icon: React.ElementType; label: string; active: boolean; future?: boolean }[] = [
    {
      icon: Award,
      label: 'Top Collaborator',
      active: !!profile.badge_top_collaborator,
    },
    {
      icon: Zap,
      label: 'Fast Responder',
      active: !!profile.badge_fast_responder,
    },
    {
      icon: Shield,
      label: profile.badge_id_verified || profile.is_verified ? 'ID Verified' : 'ID Verify',
      active: !!(profile.badge_id_verified ?? profile.is_verified),
    },
  ]

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div>
        {/* 3-stat grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {stats.map(({ icon: Icon, label, value, color, iconBg }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center text-center bg-surface-2 rounded-xl p-4 gap-1.5"
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-0.5', iconBg)}>
                <Icon size={16} className={color} />
              </div>
              <div className="text-lg font-bold text-text leading-none">{value}</div>
              <div className="text-[10px] text-text-faint leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Empty state nudge */}
        {isEmpty && (
          <p className="text-xs text-text-faint text-center mb-4 -mt-1">
            Complete your first project to build your score
          </p>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          {badges.map(({ icon: Icon, label, active, future }) => (
            <div
              key={label}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium',
                active
                  ? 'bg-gold/10 border-gold/25 text-gold'
                  : future
                  ? 'bg-surface-2 border-border text-text-faint'
                  : 'bg-surface-2 border-border text-text-faint opacity-50'
              )}
            >
              <Icon size={12} className={active ? 'text-gold' : 'text-text-faint'} />
              {label}
              {future && (
                <span className="ml-1 text-[9px] text-text-faint/60">Soon</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
