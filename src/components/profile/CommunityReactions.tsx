'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type ReactionType = 'appreciate' | 'want_to_collab' | 'inspired'

const REACTION_OPTIONS: {
  id: ReactionType
  emoji: string
  label: string
}[] = [
  { id: 'appreciate',    emoji: '👏', label: 'Appreciate' },
  { id: 'want_to_collab', emoji: '🤝', label: 'Want to Collab' },
  { id: 'inspired',      emoji: '✨', label: 'Inspired' },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface CommunityReactionsProps {
  profileId: string
  currentUserId: string | null
  isOwner: boolean
}

export function CommunityReactions({
  profileId,
  currentUserId,
  isOwner,
}: CommunityReactionsProps) {
  const [counts, setCounts] = useState<Record<ReactionType, number>>({
    appreciate: 0,
    want_to_collab: 0,
    inspired: 0,
  })
  const [myReaction, setMyReaction] = useState<ReactionType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      // Fetch aggregate counts
      const { data: rows } = await supabase
        .from('reactions')
        .select('type')
        .eq('profile_id', profileId)

      if (rows) {
        const newCounts: Record<ReactionType, number> = {
          appreciate: 0, want_to_collab: 0, inspired: 0,
        }
        rows.forEach((r: { type: string }) => {
          if (r.type in newCounts) newCounts[r.type as ReactionType]++
        })
        setCounts(newCounts)
      }

      // Fetch current user's reaction
      if (currentUserId) {
        const { data: mine } = await supabase
          .from('reactions')
          .select('type')
          .eq('profile_id', profileId)
          .eq('reactor_id', currentUserId)
          .maybeSingle()

        if (mine) setMyReaction(mine.type as ReactionType)
      }

      setLoading(false)
    }
    load()
  }, [profileId, currentUserId])

  async function toggleReaction(type: ReactionType) {
    if (!currentUserId || isOwner) return

    const prev = myReaction

    // Optimistic update
    setCounts((c) => {
      const next = { ...c }
      if (prev) next[prev] = Math.max(0, next[prev] - 1)
      if (prev !== type) next[type]++
      return next
    })
    setMyReaction(prev === type ? null : type)

    // Persist to Supabase
    if (prev === type) {
      // Remove reaction
      await supabase
        .from('reactions')
        .delete()
        .eq('profile_id', profileId)
        .eq('reactor_id', currentUserId)
    } else {
      // Upsert reaction (replaces existing if present)
      await supabase.from('reactions').upsert(
        { profile_id: profileId, reactor_id: currentUserId, type },
        { onConflict: 'profile_id,reactor_id' }
      )
    }
  }

  const disabled = isOwner || !currentUserId

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h2 className="font-semibold text-sm mb-3">Community Reactions</h2>

      {isOwner && (
        <p className="text-xs text-text-faint mb-3 -mt-1">
          How others are responding to your profile
        </p>
      )}

      <div className="flex flex-col gap-2">
        {REACTION_OPTIONS.map(({ id, emoji, label }) => (
          <button
            key={id}
            onClick={() => toggleReaction(id)}
            disabled={disabled}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all',
              disabled && 'cursor-default',
              myReaction === id
                ? 'bg-[#FAEEDA] border-[#D4A017]/30 text-[#854F0B]'
                : disabled
                ? 'bg-surface-2 border-border text-text-muted'
                : 'bg-surface-2 border-border text-text-muted hover:border-gold/20 hover:text-text'
            )}
          >
            <span className="text-xl leading-none">{emoji}</span>
            <span className="flex-1 text-left text-xs">{label}</span>
            <span
              className={cn(
                'text-xs font-semibold tabular-nums',
                myReaction === id ? 'text-[#854F0B]' : 'text-text-faint'
              )}
            >
              {loading ? '—' : counts[id] > 0 ? counts[id] : ''}
            </span>
          </button>
        ))}
      </div>

      {!currentUserId && (
        <p className="text-[10px] text-text-faint text-center mt-3">
          <a href="/login" className="text-gold hover:underline">Sign in</a>{' '}
          to leave a reaction
        </p>
      )}
    </div>
  )
}
