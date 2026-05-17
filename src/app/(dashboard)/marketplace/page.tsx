'use client'

import { useState, useEffect } from 'react'
import {
  Search, Plus, MapPin, Tag, RefreshCw, ShoppingBag,
  Camera, Filter, Star, CheckCircle, Info, Package,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EarlyAccessBanner } from '@/components/ui/EarlyAccessBanner'
import { formatCurrency, timeAgo } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type ListingType = 'sell' | 'trade' | 'free'
type Condition = 'new' | 'like_new' | 'good' | 'fair'

interface Listing {
  id: string
  title: string
  description: string
  price: number | null
  type: ListingType
  condition: Condition
  category: string
  location: string | null
  images: string[]
  created_at: string
  seller: {
    username: string
    full_name: string
    avatar_url: string | null
    is_verified: boolean
    rating: number
  }
}

const categories = [
  'All',
  'Cameras & Lenses',
  'Lighting',
  'Video Equipment',
  'Audio',
  'Backdrops & Surfaces',
  'Furniture & Props',
  'Costumes & Wardrobe',
  'Florals & Botanicals',
  'Event & Set Décor',
  'Makeup & Hair Supplies',
  'Accessories & Other',
]

const conditionColors: Record<Condition, string> = {
  new: 'bg-green-500/20 text-green-300 border-green-500/30',
  like_new: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  good: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  fair: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

const conditionLabels: Record<Condition, string> = {
  new: 'Brand New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair — Described',
}

const typeColors: Record<ListingType, string> = {
  sell: 'bg-gold/20 text-gold border-gold/30',
  trade: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  free: 'bg-green-500/20 text-green-300 border-green-500/30',
}

const typeLabels: Record<ListingType, string> = {
  sell: 'For Sale',
  trade: 'Trade',
  free: 'Pass It Forward',
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [typeFilter, setTypeFilter] = useState<'all' | ListingType>('all')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadListings() {
      setLoading(true)
      const { data } = await supabase
        .from('marketplace_listings')
        .select('id, title, description, price, type, condition, category, location, images, created_at, seller:profiles!seller_id(username, full_name, avatar_url, is_verified, rating)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(60)

      setListings((data as unknown as Listing[]) ?? [])
      setLoading(false)
    }
    loadListings()
  }, [])

  const filtered = listings.filter((l) => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || l.category === category
    const matchType = typeFilter === 'all' || l.type === typeFilter
    return matchSearch && matchCat && matchType
  })

  const isEmpty = !loading && listings.length === 0

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold mb-1">Creative Marketplace</h1>
          <p className="text-text-muted text-sm max-w-xl">
            Buy, sell, and trade professional creative assets — camera gear, lighting, wardrobe, set props,
            florals, décor, and more. Everything here has value. Nothing here is junk.
          </p>
        </div>
        <Link href="/marketplace/new">
          <Button className="flex-shrink-0">
            <Plus size={16} />
            List an Item
          </Button>
        </Link>
      </div>

      {/* Early access banner */}
      <EarlyAccessBanner
        storageKey="marketplace_early_access_v1"
        headline="The creative gear economy starts here."
        body="Every camera, light, prop, wardrobe piece, and floral arrangement that served a shoot deserves a second campaign. List what you have. Find what you need. No middleman."
      />

      {/* Community standard banner */}
      <div className="bg-gold/5 border border-gold/20 rounded-xl px-4 py-3 flex items-start gap-3 mb-6">
        <Info size={16} className="text-gold flex-shrink-0 mt-0.5" />
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="text-gold font-semibold">Dotshot Standard: </span>
          Every listing must be usable, professionally described, and honestly represented.
          Items should have real creative value for the next person — whether that&apos;s a full camera kit,
          a costume collection, or flowers from a campaign. If it&apos;s not something you&apos;d hand to a
          fellow professional, it doesn&apos;t belong here.
        </p>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {([
          ['all', 'All Listings', null],
          ['sell', 'For Sale', Tag],
          ['trade', 'Trade', RefreshCw],
          ['free', 'Pass It Forward', ShoppingBag],
        ] as const).map(([val, label, Icon]) => (
          <button
            key={val}
            onClick={() => setTypeFilter(val as 'all' | ListingType)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border flex-shrink-0 ${
              typeFilter === val
                ? 'bg-gold/20 text-gold border-gold/30'
                : 'bg-surface border-border text-text-muted hover:text-text'
            }`}
          >
            {Icon && <Icon size={13} />}
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by item name or category..."
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-muted hover:text-text transition-colors">
          <Filter size={15} />
          Filter
        </button>
      </div>

      {/* Category scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm transition-colors border whitespace-nowrap ${
              category === cat
                ? 'bg-gold/20 text-gold border-gold/30'
                : 'bg-surface border-border text-text-muted hover:text-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-border" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-border rounded w-1/4" />
                <div className="h-4 bg-border rounded w-3/4" />
                <div className="h-3 bg-border rounded w-full" />
                <div className="h-3 bg-border rounded w-5/6" />
                <div className="h-6 bg-border rounded w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats bar — only show when there are real listings */}
      {!loading && listings.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-text-muted">
          <span>{filtered.length} listings</span>
          <span>·</span>
          <span className="text-green-400">{listings.filter(l => l.type === 'free').length} pass it forward</span>
          <span>·</span>
          <span className="text-purple-400">{listings.filter(l => l.type === 'trade').length} trade offers</span>
        </div>
      )}

      {/* True empty state — no listings at all yet */}
      {isEmpty && (
        <div className="flex flex-col items-center text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
            <Package size={28} className="text-gold" />
          </div>
          <h2 className="text-lg font-bold mb-2">List the First Item</h2>
          <p className="text-text-muted text-sm max-w-sm mb-3 leading-relaxed">
            Every camera, light, and prop you&apos;ve outgrown has value for the next creative.
            The marketplace opens the moment the first listing goes up — be that person.
          </p>
          <p className="text-xs text-text-faint max-w-xs mb-8 leading-relaxed">
            Gear, wardrobe, props, florals, lighting — if it served your work and can serve
            someone else&apos;s, give it a second campaign.
          </p>
          <Link href="/marketplace/new">
            <Button size="lg" className="glow-gold">
              <Plus size={16} />
              List Your First Item
            </Button>
          </Link>
        </div>
      )}

      {/* Search empty — there are listings but search matches nothing */}
      {!loading && !isEmpty && filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No listings match your search</p>
          <p className="text-sm">Try a different name, category, or listing type.</p>
        </div>
      )}

      {/* Real listings grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((listing) => (
            <article key={listing.id} className="bg-surface border border-border rounded-xl overflow-hidden card-hover flex flex-col">

              {/* Image placeholder / first image */}
              <div className="aspect-video bg-surface-2 border-b border-border flex items-center justify-center relative overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={32} className="text-border-light" />
                )}
                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                  <Badge className={typeColors[listing.type]}>{typeLabels[listing.type]}</Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={conditionColors[listing.condition]}>{conditionLabels[listing.condition]}</Badge>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">

                {/* Category tag */}
                <p className="text-xs text-text-faint mb-1.5">{listing.category}</p>

                <h2 className="font-semibold text-sm mb-2 line-clamp-2 leading-snug">{listing.title}</h2>
                <p className="text-xs text-text-muted line-clamp-3 mb-3 flex-1 leading-relaxed">{listing.description}</p>

                {/* Price */}
                <div className="mb-3">
                  {listing.type === 'free' ? (
                    <div>
                      <span className="text-lg font-black text-green-400">FREE</span>
                      <span className="text-xs text-text-faint ml-2">— pass it forward</span>
                    </div>
                  ) : listing.type === 'trade' ? (
                    <span className="text-lg font-black text-purple-400">TRADE OFFER</span>
                  ) : (
                    <span className="text-xl font-black text-gradient-gold">{formatCurrency(listing.price!)}</span>
                  )}
                </div>

                {/* Location + time */}
                <div className="flex items-center justify-between mb-3 text-xs text-text-faint">
                  {listing.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={10} /> {listing.location}
                    </span>
                  )}
                  <span>{timeAgo(listing.created_at)}</span>
                </div>

                {/* Seller + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Avatar name={listing.seller.full_name} src={listing.seller.avatar_url} size="xs" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">{listing.seller.full_name.split(' ')[0]}</span>
                        {listing.seller.is_verified && (
                          <CheckCircle size={11} className="text-gold" fill="currentColor" />
                        )}
                      </div>
                      {listing.seller.rating > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Star size={9} className="text-gold" fill="currentColor" />
                          <span className="text-xs text-text-faint">{listing.seller.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button size="sm">
                    {listing.type === 'free' ? 'Claim It' : listing.type === 'trade' ? 'Make Offer' : 'Contact Seller'}
                  </Button>
                </div>

              </div>
            </article>
          ))}
        </div>
      )}

      {/* Bottom CTA — always visible */}
      {!loading && (
        <div className="mt-10 bg-gold/5 border border-gold/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold mb-1">Have something with more life in it?</h3>
            <p className="text-sm text-text-muted max-w-md">
              Gear, props, wardrobe, florals, décor — if it served your work and can serve someone else&apos;s,
              list it here. Give it a second campaign.
            </p>
          </div>
          <Link href="/marketplace/new">
            <Button className="flex-shrink-0">
              <Plus size={16} />
              List Your Item
            </Button>
          </Link>
        </div>
      )}

    </div>
  )
}
