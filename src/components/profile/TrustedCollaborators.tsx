'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Crown, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Avatar } from '@/components/ui/Avatar'
import { cn, ROLE_LABELS } from '@/lib/utils'
import type { UserRole } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TopCollaborator {
  user_id: string
  username: string
  display_name: string
  avatar_url: string | null
  role: string
  project_count: number
  is_verified: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

interface TrustedCollaboratorsProps {
  profileId: string
}

export function TrustedCollaborators({ profileId }: TrustedCollaboratorsProps) {
  const [collaborators, setCollaborators] = useState<TopCollaborator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      // Pull from collaboration_history table joined to profiles
      // Falls back gracefully if the table doesn't exist yet
      const { data, error } = await supabase
        .from('collaboration_history')
        .select(`
          collaborator_id,
          project_count,
          collaborator:profiles!collaboration_history_collaborator_id_fkey(
            id, username, full_name, avatar_url, role, is_verified
          )
        `)
        .eq('user_id', profileId)
        .order('project_count', { ascending: false })
        .limit(8)

      if (!error && data) {
        const mapped: TopCollaborator[] = data
          .filter((row: any) => row.collaborator)
          .map((row: any) => ({
            user_id:       row.collaborator.id,
            username:      row.collaborator.username,
            display_name:  row.collaborator.full_name,
            avatar_url:    row.collaborator.avatar_url,
            role:          row.collaborator.role,
            project_count: row.project_count,
            is_verified:   row.collaborator.is_verified,
          }))
        setCollaborators(mapped)
      }

      setLoading(false)
    }
    load()
  }, [profileId])

  // Hidden entirely when empty
  if (!loading && collaborators.length === 0) return null

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gold" />
            <h2 className="font-semibold text-sm">Trusted Collaborators</h2>
          </div>
          <p className="text-xs text-text-faint mt-0.5">
            Top 8 — ranked by completed projects together
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-xl bg-surface-2" />
              <div className="h-2 w-8 bg-surface-2 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {collaborators.map((collab, i) => (
            <Link
              key={collab.user_id}
              href={`/profile/${collab.username}`}
              className="flex flex-col items-center gap-1.5 group"
              title={`${collab.display_name} · ${ROLE_LABELS[collab.role as UserRole] ?? collab.role} · ${collab.project_count} projects`}
            >
              <div className="relative">
                <div
                  className={cn(
                    'w-12 h-12 sm:w-10 sm:h-10 rounded-xl overflow-hidden transition-all duration-200 group-hover:scale-105',
                    i === 0
                      ? 'ring-2 ring-gold ring-offset-1 ring-offset-surface'
                      : 'ring-1 ring-border group-hover:ring-gold/30'
                  )}
                >
                  <Avatar
                    name={collab.display_name}
                    src={collab.avatar_url}
                    size="sm"
                    className="w-full h-full rounded-none"
                  />
                </div>

                {/* Crown for rank #1 */}
                {i === 0 && (
                  <span className="absolute -top-2 -right-1">
                    <Crown size={12} className="text-gold fill-gold" />
                  </span>
                )}
              </div>

              <span className="text-[10px] text-text-faint text-center leading-tight truncate w-full text-center">
                {collab.display_name.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
