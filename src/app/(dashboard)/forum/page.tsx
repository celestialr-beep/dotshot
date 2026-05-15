'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, MapPin, ThumbsUp, MessageCircle, Filter, Sparkles, X, Loader2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ROLE_COLORS, ROLE_LABELS, timeAgo } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { EarlyAccessBanner } from '@/components/ui/EarlyAccessBanner'
import type { UserRole } from '@/types'

type Post = {
  id: string
  title: string
  body: string
  category: string
  tags: string[]
  location: string | null
  upvotes: number
  reply_count: number
  created_at: string
  author: {
    username: string
    full_name: string
    avatar_url: string | null
    role: UserRole
  }
}

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

const starterIdeas = [
  { emoji: '📸', text: 'Looking for a photographer for a free collab shoot' },
  { emoji: '💄', text: 'MUA available — building portfolio, open to TFP' },
  { emoji: '🎬', text: 'Just wrapped a brand shoot — sharing what I learned' },
  { emoji: '💡', text: 'Tips for negotiating usage rights on campaign work?' },
]

type NewPostForm = {
  title: string
  body: string
  category: string
  location: string
  tags: string
}

export default function ForumPage() {
  const [filterCategory, setFilterCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [postError, setPostError] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [form, setForm] = useState<NewPostForm>({
    title: '',
    body: '',
    category: 'collab_request',
    location: '',
    tags: '',
  })

  useEffect(() => {
    async function init() {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id ?? null)
      // Load posts
      loadPosts()
    }
    init()
  }, [])

  async function loadPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('forum_posts')
      .select(`
        id, title, body, category, tags, location, upvotes, reply_count, created_at,
        author:profiles!author_id(username, full_name, avatar_url, role)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    setPosts((data as unknown as Post[]) ?? [])
    setLoading(false)
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function openNewPost(prefillTitle?: string) {
    if (prefillTitle) setForm(prev => ({ ...prev, title: prefillTitle }))
    setShowNewPost(true)
    setPostError('')
  }

  async function submitPost(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUserId) {
      setPostError('You must be signed in to post.')
      return
    }
    if (!form.title.trim() || !form.body.trim()) {
      setPostError('Title and message are required.')
      return
    }

    setSubmitting(true)
    setPostError('')

    const tagsArray = form.tags
      .split(',')
      .map(t => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean)

    const { error } = await supabase.from('forum_posts').insert({
      author_id: currentUserId,
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
      location: form.location.trim() || null,
      tags: tagsArray,
    })

    setSubmitting(false)

    if (error) {
      setPostError(error.message)
      return
    }

    // Reset and reload
    setForm({ title: '', body: '', category: 'collab_request', location: '', tags: '' })
    setShowNewPost(false)
    loadPosts()
  }

  const filtered = posts.filter((p) => {
    const matchCat = filterCategory === 'all' || p.category === filterCategory
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const isEmpty = !loading && posts.length === 0

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Collab Calls</h1>
          <p className="text-text-muted text-sm">
            Find collaborators, share your work, and get advice — free for everyone.
          </p>
        </div>
        <Button
          className="flex-shrink-0 sm:w-auto w-full"
          onClick={() => openNewPost()}
        >
          <Plus size={16} />
          Post a Collab Call
        </Button>
      </div>

      {/* Early access banner — shown to every user, dismissible */}
      <EarlyAccessBanner
        storageKey="forum_early_access_v1"
        headline="You're one of the first creatives here."
        body="This network is just getting started in Orlando. Every post you make, every connection you start, helps build the foundation for every creator who joins after you. Be bold — post first."
      />

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
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
            onClick={() => setFilterCategory(value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === value
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'bg-surface border border-border text-text-muted hover:text-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-border flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-border rounded w-1/3" />
                  <div className="h-4 bg-border rounded w-3/4" />
                  <div className="h-3 bg-border rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
            <Sparkles size={28} className="text-gold" />
          </div>
          <h2 className="text-lg font-bold mb-2">Be the First to Post</h2>
          <p className="text-text-muted text-sm max-w-sm mb-8 leading-relaxed">
            This community is just getting started. The first Collab Call you post could lead to
            your next creative partnership — and help build the network for every creator who comes after you.
          </p>
          <div className="flex flex-col gap-2.5 w-full max-w-sm mb-8">
            <p className="text-xs text-text-faint uppercase tracking-wider font-medium mb-1">
              Need inspiration? Start with one of these:
            </p>
            {starterIdeas.map(({ emoji, text }) => (
              <button
                key={text}
                onClick={() => openNewPost(text)}
                className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-muted hover:text-text hover:border-gold/30 transition-all text-left"
              >
                <span className="text-base">{emoji}</span>
                <span>{text}</span>
              </button>
            ))}
          </div>
          <Button size="lg" className="glow-gold" onClick={() => openNewPost()}>
            <Plus size={18} />
            Post Your First Collab Call
          </Button>
        </div>
      )}

      {/* Search empty */}
      {!loading && !isEmpty && filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No posts match your search</p>
          <p className="text-sm">Try a different keyword or category.</p>
        </div>
      )}

      {/* Real posts */}
      {!loading && filtered.length > 0 && (
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
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="muted" className="text-xs">#{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── New Post Modal ──────────────────────────────────── */}
      {showNewPost && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowNewPost(false)}
          />

          {/* Sheet — slides up on mobile, centered on desktop */}
          <div className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-surface border border-border sm:rounded-2xl rounded-t-3xl shadow-2xl w-full sm:max-w-xl sm:mx-auto">

            {/* Handle (mobile only) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-border-light" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-base">Post a Collab Call</h2>
              <button
                onClick={() => setShowNewPost(false)}
                className="text-text-muted hover:text-text p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitPost} className="p-5 space-y-4">
              <Input
                label="Title *"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="e.g. Looking for MUA for editorial shoot"
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-muted">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                >
                  <option value="collab_request">Collab Request — I'm looking for someone</option>
                  <option value="showcase">Showcase — I'm sharing work I'm proud of</option>
                  <option value="advice">Advice — I have a question for the community</option>
                  <option value="general">General — something else</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-muted">Message *</label>
                <textarea
                  name="body"
                  value={form.body}
                  onChange={handleFormChange}
                  placeholder="Tell people what you're looking for, what you bring to the table, and how to connect with you..."
                  rows={4}
                  required
                  className="w-full bg-dark border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Location (optional)"
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  placeholder="e.g. Orlando, FL"
                />
                <Input
                  label="Tags (optional)"
                  name="tags"
                  value={form.tags}
                  onChange={handleFormChange}
                  placeholder="editorial, tfp, paid"
                />
              </div>

              {postError && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {postError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewPost(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 glow-gold"
                  disabled={submitting || !form.title.trim() || !form.body.trim()}
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {submitting ? 'Posting...' : 'Post It'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
