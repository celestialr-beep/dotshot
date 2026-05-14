'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Camera, X, ArrowLeft, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const categories = [
  'Cameras & Lenses',
  'Lighting',
  'Video Equipment',
  'Costumes & Wardrobe',
  'Florals & Botanicals',
  'Event & Set Décor',
  'Furniture & Props',
  'Backdrops & Surfaces',
  'Makeup & Hair Supplies',
  'Accessories & Other',
]

export default function NewListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listingType, setListingType] = useState<'sell' | 'trade' | 'free'>('sell')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: categories[0],
    condition: 'good',
    location: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 6) {
      setError('Maximum 6 photos per listing.')
      return
    }
    setImages(prev => [...prev, ...files])
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  function removeImage(i: number) {
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setLoading(false); return }

    // Upload images to Supabase Storage
    const uploadedUrls: string[] = []
    for (const file of images) {
      const ext = file.name.split('.').pop()
      const path = `marketplace/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('dotshot-media')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadError) {
        setError('Image upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('dotshot-media').getPublicUrl(path)
      uploadedUrls.push(urlData.publicUrl)
    }

    // Insert listing — using profiles table link via seller_id
    // We store in forum_posts table with category='marketplace' for now
    // until a dedicated marketplace_listings table is added
    const { error: insertError } = await supabase.from('forum_posts').insert({
      author_id: user.id,
      title: form.title,
      body: JSON.stringify({
        description: form.description,
        price: listingType === 'free' ? 0 : parseFloat(form.price) || 0,
        listing_type: listingType,
        category: form.category,
        condition: form.condition,
        location: form.location,
        images: uploadedUrls,
      }),
      category: 'general',
      tags: ['marketplace', form.category, listingType],
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/marketplace')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/marketplace" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Post a Listing</h1>
          <p className="text-text-muted text-sm">Give your gear a second campaign</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Listing type */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Listing Type</h2>
          <div className="flex gap-2">
            {(['sell', 'trade', 'free'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setListingType(type)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all capitalize ${
                  listingType === type
                    ? 'bg-gold/15 border-gold/40 text-gold'
                    : 'bg-surface border-border text-text-muted hover:border-border-light'
                }`}
              >
                {type === 'sell' ? 'Sell' : type === 'trade' ? 'Trade' : 'Pass It Forward'}
              </button>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Camera size={16} className="text-gold" /> Photos
            <span className="text-xs text-text-faint font-normal ml-1">(up to 6, required)</span>
          </h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-dark/80 rounded-full flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
            {previews.length < 6 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-text-faint hover:border-gold/40 hover:text-gold transition-colors"
              >
                <Camera size={20} />
                <span className="text-xs">Add Photo</span>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImages}
          />
          <p className="text-xs text-text-faint">Photos must show the actual item. No stock images.</p>
        </div>

        {/* Details */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><ShoppingBag size={16} className="text-gold" /> Item Details</h2>

          <Input
            label="Title"
            name="title"
            placeholder="e.g. Canon EOS R5 — excellent condition"
            value={form.title}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Description</label>
            <textarea
              name="description"
              placeholder="Describe the item honestly — age, condition, any wear, what's included, why you're selling..."
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">Condition</label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
              >
                <option value="new">Like New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="for_parts">For Parts</option>
              </select>
            </div>
          </div>

          {listingType === 'sell' && (
            <Input
              label="Price ($)"
              name="price"
              type="number"
              placeholder="150"
              icon={<DollarSign size={14} />}
              value={form.price}
              onChange={handleChange}
              required
            />
          )}

          <Input
            label="Your Location"
            name="location"
            placeholder="Orlando, FL"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Standards reminder */}
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
          <p className="text-xs text-text-muted leading-relaxed">
            <strong className="text-gold">Dotshot Standard:</strong> Every listing must be usable, professionally described, and honestly represented. No counterfeits. No stock photos. Photos must show the actual item.
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3">
          <Button type="submit" loading={loading} className="flex-1">Post Listing</Button>
          <Link href="/marketplace">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
