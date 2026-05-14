'use client'

import { useState } from 'react'
import { Search, Plus, MapPin, ThumbsUp, MessageCircle, Filter } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ROLE_COLORS, ROLE_LABELS, timeAgo } from '@/lib/utils'
import type { UserRole } from '@/types'
import Link from 'next/link'

const mockPosts = [
  {
    id: '1',
    title: 'Looking for Makeup Artist for Editorial Shoot — Orlando',
    body: 'I have a paid editorial shoot lined up next weekend and my MUA just cancelled. Looking for someone experienced in bold, high-fashion looks. TFP available with full usage rights.',
    category: 'collab_request',
    tags: ['editorial', 'high-fashion', 'paid'],
    location: 'Orlando, FL',
    upvotes: 24,
    reply_count: 8,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    author: { username: 'marcus_shots', full_name: 'Marcus Patterson', avatar_url: null, role: 'photographer' as UserRole, is_verified: true },
  },
  {
    id: '2',
    title: 'Hairstylist available for free collabs — building portfolio',
    body: 'I just relocated to Orlando and I\'m looking to build my portfolio in the editorial and beauty space. I can do braids, weaves, natural styles. Let\'s create together!',
    category: 'collab_request',
    tags: ['free', 'tfp', 'hair'],
    location: 'Orlando, FL',
    upvotes: 17,
    reply_count: 12,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    author: { username: 'jayla_hair', full_name: 'Jayla Thompson', avatar_url: null, role: 'hairstylist' as UserRole, is_verified: false },
  },
  {
    id: '3',
    title: 'Tips for negotiating creative rights on campaign work?',
    body: 'I just got approached for a brand campaign but they want unlimited usage rights in perpetuity. I\'ve heard this is worth negotiating. Any advice from those who\'ve been through it?',
    category: 'advice',
    tags: ['legal', 'contracts', 'rights'],
    location: null,
    upvotes: 52,
    reply_count: 31,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    author: { username: 'sofia_glam', full_name: 'Sofia Morales', avatar_url: null, role: 'makeup_artist' as UserRole, is_verified: true },
  },
  {
    id: '4',
    title: 'Showcase: Beach campaign I shot last week in Miami',
    body: 'Just wrapped an incredible 3-day campaign shoot in Miami. Team of 6 creatives from Dotshot. Hair, makeup, photography, videography all came together perfectly.',
    category: 'showcase',
    tags: ['showcase', 'miami', 'campaign'],
    location: 'Miami, FL',
    upvotes: 89,
    reply_count: 44,
    created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    author: { username: 'rex_films', full_name: 'Rex Williams', avatar_url: null, role: 'videographer' as UserRole, is_verified: true },
  },
]

const categories = [
  { value: 'all', label: 'All Posts' },
  { value: 'collab_request', label: 'Collab Requests' },
  { value: 'showcase', label: 'Showcases' },
  { value: 'advice', label: 'Advice' },
  { value: 'general', label: 'General' },
]

const categoryColors: Record<string, string> = {
  collab_request: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  showcase: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  advice: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  general: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
}

const categoryLabels: Record<string, string> = {
  collab_request: 'Collab Request',
  showcase: 'Showcase',
  advice: 'Advice',
  general: 'General',
}

export default function ForumPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = mockPosts.filter((p) => {
    const matchCat = category === 'all' || p.category === category
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Community Forum</h1>
          <p className="text-text-muted text-sm">Find collaborators, share work, and get advice — free for everyone.</p>
        </div>
        <Button className="flex-shrink-0">
          <Plus size={16} />
          New Post
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-muted hover:text-text transition-colors">
          <Filter size={15} />
          Filter
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {categories.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              category === value
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'bg-surface border border-border text-text-muted hover:text-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-3">
        {filtered.map((post) => (
          <article key={post.id} className="bg-surface border border-border rounded-xl p-5 card-hover cursor-pointer">
            <div className="flex items-start gap-4">
              <Avatar name={post.author.full_name} src={post.author.avatar_url} size="sm" className="flex-shrink-0 mt-0.5" />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{post.author.full_name}</span>
                  <Badge className={ROLE_COLORS[post.author.role]}>
                    {ROLE_LABELS[post.author.role]}
                  </Badge>
                  <Badge className={categoryColors[post.category]}>
                    {categoryLabels[post.category]}
                  </Badge>
                  <span className="text-xs text-text-faint ml-auto">{timeAgo(post.created_at)}</span>
                </div>

                <h2 className="font-semibold text-text mb-1.5 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-text-muted line-clamp-2 mb-3">{post.body}</p>

                <div className="flex flex-wrap items-center gap-3">
                  {post.location && (
                    <span className="flex items-center gap-1 text-xs text-text-faint">
                      <MapPin size={11} /> {post.location}
                    </span>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-gold transition-colors">
                      <ThumbsUp size={13} /> {post.upvotes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-gold transition-colors">
                      <MessageCircle size={13} /> {post.reply_count}
                    </button>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="muted" className="text-xs">#{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No posts found</p>
            <p className="text-sm">Be the first to post in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
