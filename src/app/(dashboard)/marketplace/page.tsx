'use client'

import { useState } from 'react'
import {
  Search, Plus, MapPin, Tag, RefreshCw, ShoppingBag,
  Camera, Filter, Star, CheckCircle, Info,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, timeAgo } from '@/lib/utils'
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
  location: string
  created_at: string
  seller: {
    username: string
    full_name: string
    avatar_url: null
    is_verified: boolean
    rating: number
  }
}

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Sony A7 IV + 24-70mm f/2.8 GM Bundle',
    description: 'Full Sony A7 IV kit in excellent condition. Upgrading to A9 III. Includes original box, two batteries, and charger. Immaculately maintained — treated like new.',
    price: 3800,
    type: 'sell',
    condition: 'like_new',
    category: 'Cameras & Lenses',
    location: 'Orlando, FL',
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    seller: { username: 'marcus_shots', full_name: 'Marcus Patterson', avatar_url: null, is_verified: true, rating: 4.9 },
  },
  {
    id: '2',
    title: 'Profoto B10 Plus Strobe — 2 Pack',
    description: 'Two Profoto B10 Plus heads with batteries, chargers, and a large octobox. Used on 15 professional shoots. Still in original boxes. A serious investment for serious work.',
    price: 2200,
    type: 'sell',
    condition: 'good',
    category: 'Lighting',
    location: 'Miami, FL',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    seller: { username: 'rex_films', full_name: 'Rex Williams', avatar_url: null, is_verified: true, rating: 4.8 },
  },
  {
    id: '3',
    title: '50-Piece Floral Arrangement Set — Campaign Ready',
    description: 'Professional-grade silk and dried flower arrangements used across three editorial campaigns. Roses, pampas, eucalyptus, and tropical leaves. All pieces in excellent display condition — far too good to discard. Perfect for a set designer, photographer, or event team.',
    price: 180,
    type: 'sell',
    condition: 'good',
    category: 'Florals & Botanicals',
    location: 'Orlando, FL',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    seller: { username: 'nia_style', full_name: 'Nia Davis', avatar_url: null, is_verified: false, rating: 4.6 },
  },
  {
    id: '4',
    title: 'Luxury Gold & Ivory Party Décor Collection',
    description: 'Full luxury event décor set: gold arch frame, ivory draping fabric, LED string lights, candle holders, and table centrepieces. Used for one high-end brand activation. Everything is immaculate and packed in labelled storage boxes. A waste to throw out — perfect for another shoot or event team.',
    price: 420,
    type: 'sell',
    condition: 'like_new',
    category: 'Event & Set Décor',
    location: 'Atlanta, GA',
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    seller: { username: 'bella_model', full_name: 'Isabella Rosa', avatar_url: null, is_verified: true, rating: 4.9 },
  },
  {
    id: '5',
    title: 'TRADE: DJI Ronin 4D for Sony FX6',
    description: 'Looking to trade my DJI Ronin 4D (10 professional projects, no issues) for a Sony FX6. Open to small cash difference either way. Serious traders only.',
    price: null,
    type: 'trade',
    condition: 'good',
    category: 'Video Equipment',
    location: 'Orlando, FL',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    seller: { username: 'chen_art', full_name: 'Chen Li', avatar_url: null, is_verified: false, rating: 4.6 },
  },
  {
    id: '6',
    title: 'Editorial Wardrobe Bundle — Sizes S/M (12 Pieces)',
    description: 'Twelve editorial fashion pieces used across three brand campaigns. All dry-cleaned and professionally stored. Includes structured blazers, statement outerwear, and accessories. These are real garments from real shoots — not throwaways. Ideal for a stylist building their kit.',
    price: 350,
    type: 'sell',
    condition: 'good',
    category: 'Costumes & Wardrobe',
    location: 'New York, NY',
    created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    seller: { username: 'sofia_glam', full_name: 'Sofia Morales', avatar_url: null, is_verified: true, rating: 5.0 },
  },
  {
    id: '7',
    title: 'FREE: 9ft White Seamless Backdrop Roll — Half Used',
    description: 'Switched to a portable system. This roll has plenty of useable paper left. Must pick up in Orlando. Free to a working creative — not for resale.',
    price: 0,
    type: 'free',
    condition: 'good',
    category: 'Backdrops & Surfaces',
    location: 'Orlando, FL',
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    seller: { username: 'jayla_hair', full_name: 'Jayla Thompson', avatar_url: null, is_verified: false, rating: 4.7 },
  },
  {
    id: '8',
    title: 'Vintage Furniture Set — Art Direction / Set Design',
    description: 'Curated vintage furniture used on multiple editorial sets: velvet chaise lounge, antique side table, ornate mirror, and two accent chairs. All structurally sound and visually stunning. Selling as a set. These deserve another campaign, not a storage unit.',
    price: 750,
    type: 'sell',
    condition: 'good',
    category: 'Furniture & Props',
    location: 'Los Angeles, CA',
    created_at: new Date(Date.now() - 4 * 24 * 3600000).toISOString(),
    seller: { username: 'rex_films', full_name: 'Rex Williams', avatar_url: null, is_verified: true, rating: 4.8 },
  },
]

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
  free: 'Free',
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [typeFilter, setTypeFilter] = useState<'all' | ListingType>('all')

  const filtered = mockListings.filter((l) => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || l.category === category
    const matchType = typeFilter === 'all' || l.type === typeFilter
    return matchSearch && matchCat && matchType
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">

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
          ['free', 'Free to a Good Home', ShoppingBag],
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

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-text-muted">
        <span>{filtered.length} listings</span>
        <span>·</span>
        <span className="text-green-400">{mockListings.filter(l => l.type === 'free').length} free to a good home</span>
        <span>·</span>
        <span className="text-purple-400">{mockListings.filter(l => l.type === 'trade').length} trade offers</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((listing) => (
          <article key={listing.id} className="bg-surface border border-border rounded-xl overflow-hidden card-hover flex flex-col">

            {/* Image placeholder */}
            <div className="aspect-video bg-surface-2 border-b border-border flex items-center justify-center relative">
              <Camera size={32} className="text-border-light" />
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
                    <span className="text-xs text-text-faint ml-2">to a good home</span>
                  </div>
                ) : listing.type === 'trade' ? (
                  <span className="text-lg font-black text-purple-400">TRADE OFFER</span>
                ) : (
                  <span className="text-xl font-black text-gradient-gold">{formatCurrency(listing.price!)}</span>
                )}
              </div>

              {/* Location + time */}
              <div className="flex items-center justify-between mb-3 text-xs text-text-faint">
                <span className="flex items-center gap-1">
                  <MapPin size={10} /> {listing.location}
                </span>
                <span>{timeAgo(listing.created_at)}</span>
              </div>

              {/* Seller + CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Avatar name={listing.seller.full_name} size="xs" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{listing.seller.full_name.split(' ')[0]}</span>
                      {listing.seller.is_verified && (
                        <CheckCircle size={11} className="text-gold" fill="currentColor" />
                      )}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star size={9} className="text-gold" fill="currentColor" />
                      <span className="text-xs text-text-faint">{listing.seller.rating}</span>
                    </div>
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

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No listings found</p>
          <p className="text-sm">Try a different search or category.</p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-10 bg-gold/5 border border-gold/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold mb-1">Have something with more life in it?</h3>
          <p className="text-sm text-text-muted max-w-md">
            Gear, props, wardrobe, florals, décor — if it served your work and can serve someone else&apos;s,
            list it here. Give it a second campaign.
          </p>
        </div>
        <Button className="flex-shrink-0">
          <Plus size={16} />
          List Your Item
        </Button>
      </div>

    </div>
  )
}
