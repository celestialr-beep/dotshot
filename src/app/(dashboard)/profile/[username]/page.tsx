'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Star, CheckCircle, AtSign, Globe, Camera, Link2, Pencil } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/utils'
import type { UserRole } from '@/types'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch profile by username
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (data) {
        setProfile(data)
        setIsOwner(user?.id === data.id)
      }
      setLoading(false)
    }
    load()
  }, [username])

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-surface rounded-2xl" />
          <div className="h-80 bg-surface rounded-xl" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold mb-2">Profile not found</h2>
        <p className="text-text-muted mb-4">@{username} doesn&apos;t exist yet.</p>
        <Link href="/dashboard"><Button variant="outline">Go to Dashboard</Button></Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Profile header */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <Avatar name={profile.full_name} src={profile.avatar_url} size="xl" />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{profile.full_name}</h1>
                  {profile.is_verified && (
                    <CheckCircle size={18} className="text-gold flex-shrink-0" fill="currentColor" />
                  )}
                </div>
                <p className="text-text-muted text-sm">@{profile.username}</p>
              </div>
              {profile.role && (
                <Badge className={ROLE_COLORS[profile.role as UserRole] ?? 'bg-surface-2 text-text-muted'}>
                  {ROLE_LABELS[profile.role as UserRole] ?? profile.role}
                </Badge>
              )}
              {profile.subscription_tier === 'pro' && <Badge variant="gold">Pro</Badge>}
              {profile.subscription_tier === 'elite' && <Badge variant="gold">Elite</Badge>}
            </div>

            {profile.bio ? (
              <p className="text-sm text-text-muted leading-relaxed mb-3 max-w-xl">{profile.bio}</p>
            ) : isOwner ? (
              <p className="text-sm text-text-faint italic mb-3">Add a bio to tell people about yourself.</p>
            ) : null}

            <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-4">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {profile.location}
                </span>
              )}
              {profile.website && (
                <a href={`https://${profile.website}`} className="flex items-center gap-1 hover:text-gold transition-colors" target="_blank" rel="noopener noreferrer">
                  <Globe size={13} /> {profile.website}
                </a>
              )}
              {profile.instagram && (
                <span className="flex items-center gap-1">
                  <AtSign size={13} /> {profile.instagram}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-5 text-sm">
              <div className="text-center">
                <div className="font-bold text-text">{profile.completed_projects ?? 0}</div>
                <div className="text-xs text-text-muted">Projects</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-text flex items-center gap-1">
                  <Star size={13} className="text-gold" fill="currentColor" />
                  {profile.rating ? Number(profile.rating).toFixed(1) : '—'}
                </div>
                <div className="text-xs text-text-muted">{profile.review_count ?? 0} reviews</div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 sm:items-end">
            {isOwner ? (
              <Button size="sm" variant="outline">
                <Pencil size={14} />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button size="sm">Book / Collab</Button>
                <Button size="sm" variant="outline">Message</Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Portfolio */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-xl p-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <Camera size={18} className="text-gold" />
              <h2 className="font-semibold">Portfolio</h2>
            </div>
            {profile.portfolio_images && profile.portfolio_images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {profile.portfolio_images.map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-lg bg-surface-2 border border-border overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-text-faint">
                <Camera size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">{isOwner ? 'Upload your first portfolio image' : 'No portfolio images yet'}</p>
                {isOwner && (
                  <Button size="sm" variant="outline" className="mt-3">Upload Photos</Button>
                )}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star size={18} className="text-gold" fill="currentColor" />
              <h2 className="font-semibold">Reviews</h2>
              <span className="text-xs text-text-muted ml-auto">{profile.review_count ?? 0} total</span>
            </div>
            <p className="text-sm text-text-faint text-center py-6">
              No reviews yet — complete a project to earn your first one.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Specialties */}
          {profile.specialties && profile.specialties.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-semibold text-sm mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((tag: string) => (
                  <Badge key={tag} variant="muted">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Top Collaborators */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Link2 size={16} className="text-gold" />
              <h2 className="font-semibold text-sm">Top Collaborators</h2>
            </div>
            <p className="text-xs text-text-faint mb-3">Ranked by completed projects together</p>
            <p className="text-sm text-text-faint text-center py-3">
              Collaborate on projects to build your network sphere.
            </p>
          </div>

          {/* Availability */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-semibold text-sm mb-2">Availability</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-sm text-text-muted">Available for projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
