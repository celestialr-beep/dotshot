'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Map as MapboxMap, Marker } from 'mapbox-gl'
import { Ghost, MapPin, Locate, X, ChevronRight, Eye, AlertCircle } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ROLE_LABELS, ROLE_COLORS, ROLE_GROUPS } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'
import Link from 'next/link'

// ── Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local
// Get a free token at https://mapbox.com (50k map loads/month free)
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

// Default center: Orlando, FL — will fly to user if geolocation granted
const DEFAULT_CENTER: [number, number] = [-81.3789, 28.5383]

type MapCreative = {
  id: string
  username: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  subscription_tier: string | null
  lat: number
  lng: number
}

type SelfProfile = {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  map_visible: boolean
  lat: number | null
  lng: number | null
}

function makeInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function createCreativeMarkerEl(creative: MapCreative): HTMLElement {
  const el = document.createElement('div')
  el.style.cssText = `
    display: flex; flex-direction: column; align-items: center; cursor: pointer;
  `
  el.innerHTML = `
    <div style="
      width:40px; height:40px; border-radius:50%;
      background:rgba(18,18,18,0.92);
      border:2px solid #D4A017;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 0 14px rgba(212,160,23,0.45), 0 2px 8px rgba(0,0,0,0.6);
      font-weight:700; font-size:13px; color:#D4A017;
      font-family:inherit; letter-spacing:0.02em;
      transition:transform 0.15s ease;
    ">
      ${makeInitials(creative.full_name)}
    </div>
    <div style="
      width:6px; height:6px; background:#D4A017;
      border-radius:50%; margin-top:-2px;
      box-shadow:0 2px 4px rgba(0,0,0,0.5);
    "></div>
  `
  el.addEventListener('mouseenter', () => {
    const circle = el.firstElementChild as HTMLElement
    if (circle) circle.style.transform = 'scale(1.12)'
  })
  el.addEventListener('mouseleave', () => {
    const circle = el.firstElementChild as HTMLElement
    if (circle) circle.style.transform = 'scale(1)'
  })
  return el
}

function createSelfMarkerEl(): HTMLElement {
  const el = document.createElement('div')
  el.style.cssText = 'display:flex; flex-direction:column; align-items:center; position:relative;'
  el.innerHTML = `
    <div style="position:relative;">
      <div style="
        width:48px; height:48px; border-radius:50%;
        background:rgba(96,165,250,0.15);
        border:2px solid #60A5FA;
        display:flex; align-items:center; justify-content:center;
        box-shadow:0 0 20px rgba(96,165,250,0.5), 0 2px 10px rgba(0,0,0,0.6);
      ">
        <div style="width:14px; height:14px; border-radius:50%; background:#60A5FA;"></div>
      </div>
      <div style="
        position:absolute; inset:-4px; border-radius:50%;
        border:2px solid rgba(96,165,250,0.4);
        animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
    </div>
    <div style="
      width:6px; height:6px; background:#60A5FA;
      border-radius:50%; margin-top:-2px;
    "></div>
  `
  return el
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const markersRef = useRef<Marker[]>([])
  const selfMarkerRef = useRef<Marker | null>(null)

  const [selfProfile, setSelfProfile] = useState<SelfProfile | null>(null)
  const [ghostMode, setGhostMode] = useState(true)
  const [creatives, setCreatives] = useState<MapCreative[]>([])
  const [selected, setSelected] = useState<MapCreative | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [mapReady, setMapReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // ── Load self profile ──────────────────────────────────────────────────────
  useEffect(() => {
    async function loadSelf() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, map_visible, lat, lng')
        .eq('id', user.id)
        .single()
      if (data) {
        setSelfProfile(data as SelfProfile)
        setGhostMode(!(data as SelfProfile).map_visible)
      }
    }
    loadSelf()
  }, [])

  // ── Load visible creatives ──────────────────────────────────────────────────
  const loadCreatives = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, full_name, role, avatar_url, subscription_tier, lat, lng')
      .eq('map_visible', true)
      .not('lat', 'is', null)
      .not('lng', 'is', null)
    setCreatives((data as MapCreative[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadCreatives() }, [loadCreatives])

  // ── Initialize Mapbox ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !MAPBOX_TOKEN) return

    let mounted = true

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (!mounted || !mapContainer.current) return

      // Import CSS at runtime (safe for SSR)
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css'
      document.head.appendChild(link)

      mapboxgl.accessToken = MAPBOX_TOKEN!

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: DEFAULT_CENTER,
        zoom: 11,
        attributionControl: false,
        logoPosition: 'bottom-right',
      })

      map.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        'bottom-right'
      )

      map.on('load', () => {
        if (mounted) setMapReady(true)
      })

      // Close profile card when clicking map background
      map.on('click', () => setSelected(null))

      mapRef.current = map
    })

    return () => {
      mounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // ── Place/update creative markers ──────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      const map = mapRef.current!

      // Clear old markers
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      const filtered = roleFilter === 'all'
        ? creatives
        : creatives.filter((c) => c.role === roleFilter)

      // Exclude self from creative markers
      const others = selfProfile
        ? filtered.filter((c) => c.id !== selfProfile.id)
        : filtered

      others.forEach((creative) => {
        const el = createCreativeMarkerEl(creative)
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          setSelected(creative)
        })

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([creative.lng, creative.lat])
          .addTo(map)

        markersRef.current.push(marker)
      })
    })
  }, [mapReady, creatives, roleFilter, selfProfile])

  // ── Place/remove self marker ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    // Remove existing self marker first
    if (selfMarkerRef.current) {
      selfMarkerRef.current.remove()
      selfMarkerRef.current = null
    }

    if (ghostMode || !selfProfile?.lat || !selfProfile?.lng) return

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (!mapRef.current) return
      const el = createSelfMarkerEl()
      selfMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([selfProfile.lng!, selfProfile.lat!])
        .addTo(mapRef.current)
    })
  }, [mapReady, ghostMode, selfProfile])

  // ── Ghost Mode toggle ──────────────────────────────────────────────────────
  async function toggleGhostMode() {
    if (!selfProfile || toggling) return
    setToggling(true)
    setLocationError(null)

    const turningOn = ghostMode // was ghost → going visible

    if (turningOn) {
      // Need to enable — get location first
      const getCoords = (): Promise<{ lat: number; lng: number }> =>
        new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser.'))
            return
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              // Round to ~1 km precision for privacy
              resolve({
                lat: Math.round(pos.coords.latitude * 100) / 100,
                lng: Math.round(pos.coords.longitude * 100) / 100,
              })
            },
            (err) => reject(new Error('Location permission denied. Enable it in browser settings.')),
            { timeout: 10000, maximumAge: 300_000 }
          )
        })

      try {
        const coords = selfProfile.lat && selfProfile.lng
          ? { lat: selfProfile.lat, lng: selfProfile.lng }
          : await getCoords()

        await supabase
          .from('profiles')
          .update({ map_visible: true, lat: coords.lat, lng: coords.lng, map_updated_at: new Date().toISOString() })
          .eq('id', selfProfile.id)

        setSelfProfile((p) => p ? { ...p, map_visible: true, ...coords } : p)
        setGhostMode(false)

        // Fly to self
        if (mapRef.current) {
          mapRef.current.flyTo({ center: [coords.lng, coords.lat], zoom: 13, duration: 1500 })
        }

        loadCreatives()
      } catch (err) {
        setLocationError(err instanceof Error ? err.message : 'Could not get location.')
      }
    } else {
      // Going ghost
      await supabase
        .from('profiles')
        .update({ map_visible: false })
        .eq('id', selfProfile.id)

      setSelfProfile((p) => p ? { ...p, map_visible: false } : p)
      setGhostMode(true)
      loadCreatives()
    }

    setToggling(false)
  }

  // ── Locate me button ───────────────────────────────────────────────────────
  function locateMe() {
    if (!mapRef.current) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current!.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 13,
          duration: 1500,
        })
      },
      () => setLocationError('Location permission denied.')
    )
  }

  const visibleCount = creatives.filter(
    (c) => roleFilter === 'all' || c.role === roleFilter
  ).length

  // ── Role chips from top roles (avoid huge list) ────────────────────────────
  const roleChips = ROLE_GROUPS.flatMap((g) => g.roles).slice(0, 10)

  return (
    // Pull out of dashboard padding, fill available height
    <div
      className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 relative overflow-hidden"
      style={{ height: 'calc(100dvh - 60px)', minHeight: 480 }}
    >
      {/* ── Map canvas ───────────────────────────────────────────────────── */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* ── Ping animation (injected style) ──────────────────────────────── */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      {/* ── No token: setup prompt ───────────────────────────────────────── */}
      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark/95 z-30">
          <div className="text-center max-w-sm px-6">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5">
              <MapPin size={28} className="text-gold" />
            </div>
            <h2 className="text-lg font-bold mb-2">Add Your Mapbox Token</h2>
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              The Creative Radar uses Mapbox — the same engine Snapchat uses. It&apos;s free for up to 50,000 map loads/month.
            </p>
            <div className="bg-surface border border-border rounded-xl p-4 text-left mb-5 text-xs">
              <p className="text-text-muted mb-2 font-medium">Add to <code className="text-gold">.env.local</code>:</p>
              <code className="text-gold block">NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here</code>
            </div>
            <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer">
              <Button className="w-full">
                Get Free Token at mapbox.com →
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* ── Top bar: Ghost Mode toggle + Locate ──────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between gap-3 pointer-events-none">

        {/* Ghost Mode toggle */}
        <div className="pointer-events-auto flex flex-col gap-2">
          <button
            onClick={toggleGhostMode}
            disabled={toggling}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-xl backdrop-blur-md border transition-all duration-300 ${
              ghostMode
                ? 'bg-surface/90 border-border text-text-muted hover:border-text-muted'
                : 'bg-gold/20 border-gold/50 text-gold shadow-[0_0_20px_rgba(212,160,23,0.2)]'
            }`}
          >
            {ghostMode ? (
              <Ghost size={16} className="flex-shrink-0 opacity-70" />
            ) : (
              <Eye size={16} className="flex-shrink-0" />
            )}
            {ghostMode ? 'Ghost Mode' : 'On the Map'}
            {toggling && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
            )}
          </button>

          {/* Location error */}
          {locationError && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 max-w-[240px]">
              <AlertCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400 leading-relaxed">{locationError}</p>
            </div>
          )}
        </div>

        {/* Locate me FAB */}
        <div className="pointer-events-auto flex flex-col gap-2">
          <button
            onClick={locateMe}
            className="w-10 h-10 rounded-xl bg-surface/90 backdrop-blur-md border border-border flex items-center justify-center shadow-lg hover:border-text-faint transition-colors"
          >
            <Locate size={16} className="text-text-muted" />
          </button>
        </div>
      </div>

      {/* ── Role filter chips ─────────────────────────────────────────────── */}
      <div className="absolute top-20 left-4 right-16 z-20 pointer-events-none">
        <div className="flex gap-2 overflow-x-auto pb-1 pointer-events-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setRoleFilter('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md shadow-lg transition-all ${
              roleFilter === 'all'
                ? 'bg-gold/20 text-gold border-gold/40'
                : 'bg-surface/85 text-text-muted border-border hover:border-text-faint'
            }`}
          >
            All
          </button>
          {roleChips.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(roleFilter === r ? 'all' : r)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md shadow-lg transition-all whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-gold/20 text-gold border-gold/40'
                  : 'bg-surface/85 text-text-muted border-border hover:border-text-faint'
              }`}
            >
              {ROLE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Live count badge ──────────────────────────────────────────────── */}
      {!loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-lg text-xs text-text-muted whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse flex-shrink-0" />
            {visibleCount} creative{visibleCount !== 1 ? 's' : ''} on the map
          </div>
        </div>
      )}

      {/* ── Ghost Mode info banner (bottom, only when no card) ───────────── */}
      {ghostMode && !selected && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-surface/92 backdrop-blur-xl border border-border rounded-2xl px-4 py-3.5 shadow-xl flex items-start gap-3">
            <Ghost size={18} className="text-text-faint flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text mb-0.5">You&apos;re invisible right now</p>
              <p className="text-xs text-text-muted leading-relaxed">
                Tap <strong className="text-text">Ghost Mode</strong> above to appear on the map.
                We only share your approximate area — never your exact location.
              </p>
            </div>
            <button
              onClick={toggleGhostMode}
              disabled={toggling}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gold/15 border border-gold/30 text-xs text-gold font-medium hover:bg-gold/25 transition-colors"
            >
              Go Live
            </button>
          </div>
        </div>
      )}

      {/* ── Selected creative profile card ────────────────────────────────── */}
      {selected && (
        <>
          {/* Tap-outside dismissal */}
          <div
            className="absolute inset-0 z-20"
            onClick={() => setSelected(null)}
          />

          {/* Card */}
          <div className="absolute bottom-4 left-4 right-4 z-30">
            <div className="bg-surface/96 backdrop-blur-2xl border border-border rounded-2xl p-5 shadow-2xl">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar
                  name={selected.full_name}
                  src={selected.avatar_url}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm leading-tight">{selected.full_name}</h3>
                  <p className="text-xs text-text-muted">@{selected.username}</p>
                  {selected.role && (
                    <Badge className={`${ROLE_COLORS[selected.role]} mt-2 text-xs`}>
                      {ROLE_LABELS[selected.role]}
                    </Badge>
                  )}
                  {selected.subscription_tier === 'elite' && (
                    <Badge variant="gold" className="text-xs ml-1.5">Elite</Badge>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-text-faint hover:text-text transition-colors p-1 -mr-1 -mt-1 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* CTAs */}
              <div className="flex gap-2.5">
                <Link href={`/profile/${selected.username}`} className="flex-1">
                  <Button size="sm" className="w-full gap-1.5">
                    View Profile
                    <ChevronRight size={14} />
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button size="sm" variant="outline">
                    Message
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
