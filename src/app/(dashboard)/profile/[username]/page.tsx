import { MapPin, Star, CheckCircle, AtSign, Globe, Camera, Link2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/utils'
import type { UserRole } from '@/types'
import Link from 'next/link'

// Mock profile data — will be replaced with Supabase fetch
const mockProfile = {
  id: '1',
  username: 'marcus_shots',
  full_name: 'Marcus Patterson',
  avatar_url: null,
  bio: 'Portrait & editorial photographer based in Orlando. Specializing in high-fashion and lifestyle content. 7+ years of experience. Let\'s create something incredible together.',
  role: 'photographer' as UserRole,
  location: 'Orlando, FL',
  website: 'marcusshots.com',
  instagram: '@marcus_shots',
  subscription_tier: 'pro' as const,
  is_verified: true,
  rating: 4.9,
  review_count: 38,
  completed_projects: 124,
  top_collaborators: [
    { id: '2', username: 'sofia_glam', full_name: 'Sofia Morales', role: 'makeup_artist' as UserRole, avatar_url: null },
    { id: '3', username: 'jayla_hair', full_name: 'Jayla Thompson', role: 'hairstylist' as UserRole, avatar_url: null },
    { id: '4', username: 'rex_films', full_name: 'Rex Williams', role: 'videographer' as UserRole, avatar_url: null },
    { id: '5', username: 'nia_style', full_name: 'Nia Davis', role: 'stylist' as UserRole, avatar_url: null },
    { id: '6', username: 'chen_art', full_name: 'Chen Li', role: 'art_director' as UserRole, avatar_url: null },
    { id: '7', username: 'bella_model', full_name: 'Isabella Rosa', role: 'model' as UserRole, avatar_url: null },
  ],
  portfolio_images: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
}

const recentReviews = [
  { author: 'Sofia M.', rating: 5, text: 'Marcus is incredibly professional and talented. The photos came out stunning.', date: '2 weeks ago' },
  { author: 'Campaign: LuxBrand', rating: 5, text: 'Delivered everything on time and exceeded expectations. Will book again.', date: '1 month ago' },
  { author: 'Jayla T.', rating: 5, text: 'Great energy on set. Knows exactly how to capture the vision.', date: '2 months ago' },
]

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const profile = { ...mockProfile, username }

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
              <Badge className={ROLE_COLORS[profile.role]}>
                {ROLE_LABELS[profile.role]}
              </Badge>
              {profile.subscription_tier === 'pro' && (
                <Badge variant="gold">Pro</Badge>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm text-text-muted leading-relaxed mb-3 max-w-xl">{profile.bio}</p>
            )}

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
                <a href="#" className="flex items-center gap-1 hover:text-gold transition-colors">
                  <AtSign size={13} /> {profile.instagram}
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-5 text-sm">
              <div className="text-center">
                <div className="font-bold text-text">{profile.completed_projects}</div>
                <div className="text-xs text-text-muted">Projects</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-text flex items-center gap-1">
                  <Star size={13} className="text-gold" fill="currentColor" />
                  {profile.rating}
                </div>
                <div className="text-xs text-text-muted">{profile.review_count} reviews</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-text">{profile.top_collaborators.length}</div>
                <div className="text-xs text-text-muted">Top Collabs</div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 sm:items-end">
            <Button size="sm">Book / Collab</Button>
            <Button size="sm" variant="outline">Message</Button>
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
            <div className="grid grid-cols-3 gap-2">
              {profile.portfolio_images.map((img, i) => (
                <div
                  key={img}
                  className="aspect-square rounded-lg bg-surface-2 border border-border flex items-center justify-center text-text-faint text-xs hover:border-gold/40 transition-colors cursor-pointer"
                >
                  {i === 0 ? <Camera size={20} className="opacity-30" /> : null}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star size={18} className="text-gold" fill="currentColor" />
              <h2 className="font-semibold">Reviews</h2>
              <span className="text-xs text-text-muted ml-auto">{profile.review_count} total</span>
            </div>
            <div className="flex flex-col gap-4">
              {recentReviews.map(({ author, rating, text, date }) => (
                <div key={author} className="border-b border-border last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{author}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} size={11} className="text-gold" fill="currentColor" />
                      ))}
                      <span className="text-xs text-text-faint ml-1">{date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Top Collaborators — ranked by collab history */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Link2 size={16} className="text-gold" />
              <h2 className="font-semibold text-sm">Top Collaborators</h2>
              <span className="text-xs text-text-faint ml-auto">Top {profile.top_collaborators.length}</span>
            </div>
            <p className="text-xs text-text-faint mb-4">Ranked by completed projects together</p>

            <div className="grid grid-cols-3 gap-3">
              {profile.top_collaborators.map((collab, i) => (
                <Link key={collab.id} href={`/profile/${collab.username}`} className="flex flex-col items-center gap-1 group">
                  <div className="relative">
                    <Avatar name={collab.full_name} size="sm" className="group-hover:ring-2 ring-gold transition-all" />
                    {i === 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full text-dark text-xs flex items-center justify-center font-black leading-none">1</span>
                    )}
                  </div>
                  <span className="text-xs text-text-muted group-hover:text-gold transition-colors text-center truncate w-full text-center">
                    {collab.full_name.split(' ')[0]}
                  </span>
                  <Badge className={`text-xs scale-75 origin-center ${ROLE_COLORS[collab.role]}`}>
                    {ROLE_LABELS[collab.role].split(' ')[0]}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Skills/roles */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-semibold text-sm mb-3">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {['Editorial', 'Fashion', 'Portrait', 'Lifestyle', 'Brand', 'Events'].map((tag) => (
                <Badge key={tag} variant="muted">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-semibold text-sm mb-2">Availability</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-sm text-text-muted">Available for projects</span>
            </div>
            <p className="text-xs text-text-faint mt-1">Typically responds within 2 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
