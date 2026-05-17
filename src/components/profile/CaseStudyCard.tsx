'use client'

import { MapPin, Calendar, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CaseStudyType = 'campaign' | 'bts' | 'credits'

export interface CaseStudy {
  id: string
  creator_id: string
  title: string
  type: CaseStudyType
  date: string         // "2024-03"
  location?: string
  credit_role?: string  // for 'credits' type — shown instead of location
  media_url?: string | null
  collaborators?: {
    user_id: string
    initials: string
    color: string
    role: string
  }[]
  additional_count?: number
  description?: string
}

const TYPE_COLORS: Record<CaseStudyType, string> = {
  campaign: 'bg-gold/15 text-gold border-gold/20',
  bts:      'bg-purple-400/15 text-purple-300 border-purple-400/20',
  credits:  'bg-blue-400/15 text-blue-300 border-blue-400/20',
}

const TYPE_LABELS: Record<CaseStudyType, string> = {
  campaign: 'Campaign',
  bts:      'BTS',
  credits:  'Credits',
}

// ─── Collaborator avatar stack ────────────────────────────────────────────────

function CollabStack({
  collaborators,
  additional,
}: {
  collaborators: CaseStudy['collaborators']
  additional?: number
}) {
  if (!collaborators?.length) return null
  const shown = collaborators.slice(0, 4)
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-2">
        {shown.map((c) => (
          <div
            key={c.user_id}
            className="w-6 h-6 rounded-full border-2 border-surface flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: c.color }}
            title={`${c.initials} — ${c.role}`}
          >
            {c.initials}
          </div>
        ))}
        {(additional ?? 0) > 0 && (
          <div className="w-6 h-6 rounded-full border-2 border-surface bg-surface-2 flex items-center justify-center text-[9px] font-semibold text-text-faint flex-shrink-0">
            +{additional}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CaseStudyCardProps {
  study: CaseStudy
  isOwner: boolean
  onPublish?: (study: CaseStudy) => void
}

export function CaseStudyCard({ study, isOwner, onPublish }: CaseStudyCardProps) {
  return (
    <div className="bg-surface-2 border border-border rounded-xl overflow-hidden hover:border-gold/20 transition-colors group">
      {/* Media thumbnail */}
      <div className="relative aspect-[16/9] bg-surface overflow-hidden">
        {study.media_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={study.media_url}
            alt={study.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface via-surface-2 to-dark">
            <div className="text-center">
              <div className="text-3xl mb-2 opacity-30">
                {study.type === 'campaign' ? '🎬' : study.type === 'bts' ? '📷' : '🎭'}
              </div>
            </div>
          </div>
        )}

        {/* Type badge */}
        <span
          className={cn(
            'absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
            TYPE_COLORS[study.type]
          )}
        >
          {TYPE_LABELS[study.type]}
        </span>

        {/* Owner publish button */}
        {isOwner && onPublish && (
          <button
            onClick={() => onPublish(study)}
            className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 text-[10px] font-medium text-white/80 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
          >
            <Share2 size={10} />
            Publish
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="p-3.5">
        <h3 className="text-sm font-semibold text-text mb-1.5 leading-snug line-clamp-2">
          {study.title}
        </h3>

        <div className="flex flex-wrap gap-2 text-[10px] text-text-faint mb-2.5">
          <span className="flex items-center gap-1">
            <Calendar size={9} />
            {study.date}
          </span>
          {study.type === 'credits' && study.credit_role ? (
            <span className="flex items-center gap-1">
              <span className="opacity-50">·</span>
              {study.credit_role}
            </span>
          ) : study.location ? (
            <span className="flex items-center gap-1">
              <MapPin size={9} />
              {study.location}
            </span>
          ) : null}
        </div>

        {study.collaborators && study.collaborators.length > 0 && (
          <CollabStack
            collaborators={study.collaborators}
            additional={study.additional_count}
          />
        )}

        {study.description && (
          <p className="text-[11px] text-text-faint mt-2 leading-relaxed line-clamp-2">
            {study.description}
          </p>
        )}
      </div>
    </div>
  )
}
