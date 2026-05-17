import Link from 'next/link'
import {
  Camera,
  Scissors,
  Sparkles,
  Video,
  ArrowRight,
  Star,
  Shield,
  Globe,
  DollarSign,
  Users,
  CheckCircle,
  Trophy,
  FileText,
  ShoppingBag,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const roles = [
  { icon: Camera, label: 'Photographers' },
  { icon: Video, label: 'Videographers' },
  { icon: Sparkles, label: 'Makeup Artists' },
  { icon: Scissors, label: 'Hairstylists' },
  { icon: Users, label: 'Models & Talent' },
  { icon: Star, label: 'Musicians & DJs' },
  { icon: Globe, label: 'Writers & Directors' },
  { icon: Trophy, label: 'Dancers & Performers' },
]

const features = [
  {
    icon: Users,
    title: 'Free Collab Board',
    description:
      'Post and find free collaboration requests. Reduce production costs by building your dream team without the overhead.',
  },
  {
    icon: DollarSign,
    title: 'Paid Campaigns',
    description:
      'Brands and clients post Crown & Capture sessions. Bid or get selected through our fair-play casting system.',
  },
  {
    icon: Trophy,
    title: 'Top Collaborators',
    description:
      'Your personal network sphere. Your top 20 collaborators are ranked by real project history — the people you create with most rise to the top.',
  },
  {
    icon: FileText,
    title: 'Built-in Contracts',
    description:
      'Legal agreements, IP ownership, and media rights baked right in. Professional paperwork without a lawyer.',
  },
  {
    icon: Star,
    title: 'Portfolio & Reviews',
    description:
      'Showcase your best work. Earn verified reviews from collaborators. Build a reputation that gets you booked.',
  },
  {
    icon: ShoppingBag,
    title: 'Gear Marketplace',
    description:
      'Buy, sell, and trade cameras, lenses, lighting, and supplies — directly between creatives. No middleman.',
  },
  {
    icon: Shield,
    title: 'Secure & Owner-First',
    description:
      'Your data, your work, your rights. Enterprise-grade security with full IP protection from day one.',
  },
]

const pricing = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started and build your network',
    features: [
      'Public profile & portfolio',
      'Collab board access (3 posts/mo)',
      'Browse all campaigns',
      'Basic messaging',
      'Community forum',
    ],
    cta: 'Get Started Free',
    variant: 'outline' as const,
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$6.99',
    period: '/month',
    description: 'For active creators getting booked',
    features: [
      'Everything in Free',
      'Unlimited collab posts',
      'Apply to paid campaigns',
      'Priority profile placement',
      'Top Collaborators network',
      'Analytics dashboard',
      'Verified badge eligibility',
    ],
    cta: 'Start Pro',
    variant: 'primary' as const,
    highlight: true,
  },
  {
    name: 'Elite',
    price: '$14.99',
    period: '/month',
    description: 'For power creators and agencies',
    features: [
      'Everything in Pro',
      'Featured on campaign search',
      'Direct client bookings',
      'Contract templates library',
      'Team management',
      'Early access to new campaigns',
      'Dedicated support',
    ],
    cta: 'Go Elite',
    variant: 'outline' as const,
    highlight: false,
  },
]

const foundingPillars = [
  { value: 'Orlando, FL', label: 'Launching Here First' },
  { value: 'Free', label: 'Always Free to Join' },
  { value: '35+', label: 'Creative Roles Supported' },
  { value: 'Global', label: 'Expansion Roadmap' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 lg:pb-0">
      <Navbar />

      {/* ─── Hero ─────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <Badge variant="gold" className="mb-6 text-xs uppercase tracking-widest">
            Now Live in Orlando, FL
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Where Creative
            <br />
            <span className="text-gradient-gold">Professionals Connect</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Photographers, videographers, musicians, dancers, DJs, writers, makeup artists,
            directors, hosts, and every creative in between — come together for free collabs
            or paid campaigns. Cut production costs. Build your network. Get your work seen worldwide.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/signup">
              <Button size="lg" className="glow-gold min-w-44">
                Join Free Today
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button size="lg" variant="outline" className="min-w-44">
                Browse Campaigns
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {roles.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2"
              >
                <Icon size={15} className="text-gold" />
                <span className="text-sm text-text">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Founding Pillars ─────────────────────────────── */}
      <section className="py-12 border-y border-border bg-surface/50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {foundingPillars.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-gradient-gold">{value}</div>
              <div className="text-sm text-text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Visual Showcase ─────────────────────────────── */}
      {/* Photo IDs: visit unsplash.com, search by role, copy the ID from the URL */}
      <section className="py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="muted" className="mb-4">Inside the Shoot</Badge>
            <h2 className="text-4xl font-bold mb-3">
              Where creative work{' '}
              <span className="text-gradient-gold">actually happens</span>
            </h2>
            <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base">
              35+ creative roles across every discipline. This is the platform built for the
              people behind the lens, in the chair, and on set.
            </p>
          </div>

          {/* Editorial photo grid — 3 col, 2 rows, left card is tall */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ height: 'clamp(360px, 55vw, 560px)' }}>

            {/* Tall left — camera & gear flat-lay, studio-tools vibe */}
            <div className="relative overflow-hidden rounded-2xl row-span-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1713354738889-1c8b05983e75?auto=format&fit=crop&w=700&q=80"
                alt="Photographer — studio vibe"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gold/20 backdrop-blur-sm border border-gold/30 flex items-center justify-center">
                    <Camera size={13} className="text-gold" />
                  </div>
                  <span className="text-sm font-semibold text-white drop-shadow">Photographers</span>
                </div>
              </div>
            </div>

            {/* Top-middle — film director on set, crew, clapboard */}
            <div className="relative overflow-hidden rounded-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1632187956267-3a7b360c557a?auto=format&fit=crop&w=600&q=80"
                alt="Film director on set"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gold/20 backdrop-blur-sm border border-gold/30 flex items-center justify-center">
                    <Globe size={11} className="text-gold" />
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow">Directors</span>
                </div>
              </div>
            </div>

            {/* Top-right — vibrant editorial makeup close-up */}
            <div className="relative overflow-hidden rounded-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?auto=format&fit=crop&w=600&q=80"
                alt="Makeup artist — vibrant editorial look"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gold/20 backdrop-blur-sm border border-gold/30 flex items-center justify-center">
                    <Sparkles size={11} className="text-gold" />
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow">Makeup Artists</span>
                </div>
              </div>
            </div>

            {/* Bottom-middle — Music producer at workstation */}
            <div className="relative overflow-hidden rounded-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80"
                alt="Music producer at workstation"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gold/20 backdrop-blur-sm border border-gold/30 flex items-center justify-center">
                    <Star size={11} className="text-gold" />
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow">Musicians & DJs</span>
                </div>
              </div>
            </div>

            {/* Bottom-right — behind the scenes, studio lighting rig */}
            <div className="relative overflow-hidden rounded-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1663867840932-91b9151c0093?auto=format&fit=crop&w=600&q=80"
                alt="Videographer — behind the scenes"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gold/20 backdrop-blur-sm border border-gold/30 flex items-center justify-center">
                    <Video size={11} className="text-gold" />
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow">Videographers</span>
                </div>
              </div>
            </div>

          </div>

          {/* Caption row */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-text-faint">
            <span>Photos sourced from Unsplash</span>
            <span>·</span>
            <Link href="/signup" className="text-gold hover:underline">
              Create your profile →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="muted" className="mb-4">Platform Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Everything a creative team needs</h2>
            <p className="text-text-muted max-w-xl mx-auto">
              From free collabs to paid campaigns — all the tools to build your creative career in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-surface border border-border rounded-xl p-6 card-hover">
                <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-gold" />
                </div>
                <h3 className="font-semibold text-text mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────── */}
      <section className="py-24 px-4 bg-surface/40 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="muted" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold mb-4">From profile to booked in 3 steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Build Your Profile',
                desc: 'Showcase your portfolio, set your role, location, and rates. Get your verified badge.',
              },
              {
                step: '02',
                title: 'Connect & Collaborate',
                desc: 'Post on the free collab board or apply to paid Crown & Capture campaigns near you.',
              },
              {
                step: '03',
                title: 'Get Paid & Featured',
                desc: 'Complete campaigns, receive payment via Stripe, get featured on our page, and grow your network.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-6xl font-black text-border mb-4 leading-none select-none">{step}</div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────── */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="muted" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold mb-4">Start free. Scale when you&apos;re ready.</h2>
            <p className="text-text-muted max-w-lg mx-auto">
              No credit card required. Upgrade anytime. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map(({ name, price, period, description, features: feats, cta, variant, highlight }) => (
              <div
                key={name}
                className={`relative rounded-2xl p-6 flex flex-col border ${
                  highlight ? 'bg-gold/5 border-gold/40 glow-gold' : 'bg-surface border-border'
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gold" className="text-xs">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-bold text-lg mb-1">{name}</h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-3xl font-black text-gradient-gold">{price}</span>
                    <span className="text-text-muted text-sm mb-1">{period}</span>
                  </div>
                  <p className="text-sm text-text-muted">{description}</p>
                </div>
                <ul className="flex-1 flex flex-col gap-2.5 mb-6">
                  {feats.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={15} className="text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-text-muted">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant={variant} className="w-full">{cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Global expansion ─────────────────────────────── */}
      <section className="py-16 px-4 bg-surface/40 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Globe size={40} className="text-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Starting in Orlando. Going global.</h2>
          <p className="text-text-muted max-w-2xl mx-auto mb-6">
            We&apos;re launching in Orlando, FL and expanding to Miami, New York, Los Angeles, Texas, the Caribbean,
            Europe, Asia, Australia, and beyond. Every creative in every city deserves a seat at the table.
            Be a founding member and shape the platform before the world arrives.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Orlando, FL', 'Miami, FL', 'New York', 'Los Angeles', 'Texas', 'Caribbean', 'Europe', 'Asia', 'Australia', 'And Beyond'].map((city) => (
              <Badge key={city} variant="muted">{city}</Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-5">
            Your next big shoot starts
            <br />
            <span className="text-gradient-gold">with one click.</span>
          </h2>
          <p className="text-text-muted mb-8 text-lg">
            Be a founding member. The network you build today is the reputation you carry forever.
          </p>
          <Link href="/signup">
            <Button size="lg" className="glow-gold-lg">
              Create Your Free Account
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />

      {/* ── Mobile sticky sign-up CTA ── visible on mobile only, always in reach */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-dark/95 backdrop-blur-md border-t border-border safe-area-bottom">
        <Link href="/signup">
          <Button size="lg" className="w-full glow-gold font-semibold tracking-wide">
            Join Free — Be a Founding Member
            <ArrowRight size={18} />
          </Button>
        </Link>
      </div>

    </div>
  )
}
