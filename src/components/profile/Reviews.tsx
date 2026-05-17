'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Avatar } from '@/components/ui/Avatar'
import { cn, ROLE_LABELS } from '@/lib/utils'
import type { UserRole } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewRow {
  id: string
  reviewer_id: string
  reviewer_name: string
  reviewer_role: string
  reviewer_avatar_url?: string | null
  reviewer_avatar_color: string
  rating: number
  text: string
  category_tags: string[]
  created_at: string
}

const CATEGORY_TAG_COLORS: Record<string, string> = {
  Punctual:           'bg-green-400/10 text-green-300 border-green-400/20',
  Professional:       'bg-blue-400/10 text-blue-300 border-blue-400/20',
  'Clear vision':     'bg-purple-400/10 text-purple-300 border-purple-400/20',
  'Great communicator': 'bg-gold/10 text-gold border-gold/20',
  'Team player':      'bg-teal-400/10 text-teal-300 border-teal-400/20',
  'Fast delivery':    'bg-orange-400/10 text-orange-300 border-orange-400/20',
  'Well prepared':    'bg-indigo-400/10 text-indigo-300 border-indigo-400/20',
  Reliable:           'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  Creative:           'bg-pink-400/10 text-pink-300 border-pink-400/20',
  'Easy to work with': 'bg-sky-400/10 text-sky-300 border-sky-400/20',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          className={n <= rating ? 'text-gold fill-gold' : 'text-border'}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewRow }) {
  return (
    <div className="bg-surface-2 border border-border rounded-xl p-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          name={review.reviewer_name}
          src={review.reviewer_avatar_url ?? null}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-text truncate">
              {review.reviewer_name}
            </p>
            <StarRow rating={review.rating} />
          </div>
          <p className="text-xs text-text-faint">
            {ROLE_LABELS[review.reviewer_role as UserRole] ?? review.reviewer_role}
          </p>
        </div>
      </div>

      {/* Text */}
      {review.text && (
        <p className="text-sm text-text-muted leading-relaxed mb-3">{review.text}</p>
      )}

      {/* Category tags */}
      {review.category_tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {review.category_tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-medium border',
                CATEGORY_TAG_COLORS[tag] ?? 'bg-surface border-border text-text-faint'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ReviewsProps {
  profileId: string
  reviewCount?: number
}

export function Reviews({ profileId, reviewCount }: ReviewsProps) {
  const [reviews, setReviews]     = useState<ReviewRow[]>([])
  const [loading, setLoading]     = useState(true)
  const [showAll, setShowAll]     = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('subject_id', profileId)
        .order('created_at', { ascending: false })
        .limit(20)

      setReviews(data ?? [])
      setLoading(false)
    }
    load()
  }, [profileId])

  const displayed = showAll ? reviews : reviews.slice(0, 2)
  const total     = reviewCount ?? reviews.length

  // Average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-gold fill-gold" />
          <h2 className="font-semibold text-sm">Reviews</h2>
          {avgRating && (
            <span className="text-sm font-bold text-gold">{avgRating}</span>
          )}
        </div>
        <span className="text-xs text-text-faint">{total} total</span>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-surface-2" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-text-faint text-center py-6">
          No reviews yet — reviews appear after collaborations are completed.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {displayed.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {reviews.length > 2 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full mt-3 py-2 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
            >
              See all {reviews.length} reviews ↓
            </button>
          )}
        </>
      )}
    </div>
  )
}
