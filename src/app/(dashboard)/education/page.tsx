'use client'

import { useState } from 'react'
import {
  GraduationCap, BookOpen, Shield, DollarSign,
  Camera, ChevronDown, ChevronUp, Clock, Star,
  Briefcase, FileText, Users, Lightbulb,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = 'all' | 'platform' | 'safety' | 'business' | 'creative'

interface Article {
  id: string
  title: string
  summary: string
  category: Category
  icon: React.ElementType
  readTime: string
  available: boolean
  content?: Section[]
  tag?: string
}

interface Section {
  heading?: string
  body: string
  list?: string[]
}

// ─── Article content ──────────────────────────────────────────────────────────
const ARTICLES: Article[] = [
  {
    id: 'complete-profile',
    title: 'Complete Your Profile and Get Discovered',
    summary: 'A complete profile is your resume, your portfolio, and your first impression — all in one place. Here\'s how to make it work for you.',
    category: 'platform',
    icon: Users,
    readTime: '3 min',
    available: true,
    tag: 'Start Here',
    content: [
      {
        heading: 'Your profile photo matters most',
        body: 'Use a clear, well-lit headshot or a photo of you doing your craft. Avoid group photos, blurry selfies, or logos. People book people — they want to see who they\'re working with.',
      },
      {
        heading: 'Write a bio that works',
        body: 'Your bio should answer three questions in two or three sentences:',
        list: [
          'What do you do? (e.g. "I\'m a portrait and lifestyle photographer based in Orlando")',
          'What\'s your style or specialty? (e.g. "natural light, authentic moments, editorial work")',
          'What are you open to? (e.g. "Available for paid campaigns, collabs, and brand partnerships")',
        ],
      },
      {
        heading: 'Add portfolio images',
        body: 'Upload 5–10 of your best shots. Quality over quantity. If you\'re just starting out, use personal projects, test shoots, or styled collaborations. This is your first impression — make it count.',
      },
      {
        heading: 'Set your location accurately',
        body: 'Campaigns search by city and state. If your location is blank or wrong, you\'ll miss opportunities in your area. You can also enable Creative Radar in Settings to appear on the map for nearby collabs.',
      },
      {
        heading: 'List your specialties',
        body: 'Be specific. "Photography" is broad. "Portrait photography, editorial, golden hour" tells a client or collaborator exactly what to expect. The more specific, the better the match.',
      },
    ],
  },
  {
    id: 'collab-call',
    title: 'Write a Collab Call That Actually Gets Responses',
    summary: 'Most Collab Calls get ignored because they\'re vague. Here\'s exactly how to write one that creatives want to respond to.',
    category: 'platform',
    icon: Briefcase,
    readTime: '4 min',
    available: true,
    content: [
      {
        heading: 'The problem with most Collab Calls',
        body: '"Looking for a photographer for a shoot" tells someone nothing. Who is the shoot for? What style? Where? When? What does the photographer get out of it? Lead with clarity — people respond to specificity.',
      },
      {
        heading: 'The formula that works',
        body: 'Your title should be a one-line pitch. Your body should cover:',
        list: [
          'What the project is (concept, mood, theme)',
          'Who you\'re looking for (role, skill level, vibe)',
          'When and approximately where',
          'What they\'re getting (portfolio images, credit, future paid work, etc.)',
          'How to respond (DM, comment, booking link)',
        ],
      },
      {
        heading: 'Example: before vs after',
        body: 'Before: "Looking for photographer for a fitness shoot in Orlando."\n\nAfter: "Looking for a photographer who loves movement and natural light for a 2-hour fitness editorial in a park in Orlando. Concept is athletic but elevated — think Nike campaign energy. You keep the selects for your portfolio, I handle wardrobe and styling. Targeting a weekend in June."',
      },
      {
        heading: 'Respond fast',
        body: 'When people reply to your Collab Call, respond within a few hours. Creative projects move quickly. Slow responses signal disorganization — and good creatives have options.',
      },
    ],
  },
  {
    id: 'red-flags',
    title: '5 Red Flags to Watch For Before Any Shoot',
    summary: 'Most bad creative experiences are preventable. Learn the warning signs before you show up anywhere.',
    category: 'safety',
    icon: Shield,
    readTime: '5 min',
    available: true,
    tag: 'Safety Essential',
    content: [
      {
        heading: '1. No agreement before the shoot',
        body: 'If someone refuses to sign an agreement or says "we don\'t need paperwork for this," that\'s your first and biggest red flag. Agreements protect both parties. Anyone serious about a legitimate project will have no problem signing.',
      },
      {
        heading: '2. Pressure to skip the virtual meetup',
        body: '"Just come to the location, we can talk there." No. A quick 15-minute Jitsi call first costs nothing. It lets you see who you\'re working with, confirm the project details, and decide if you feel comfortable. If someone resists this, trust that resistance.',
      },
      {
        heading: '3. Location changes at the last minute',
        body: 'The address you agreed to and the address you\'re sent on the day of the shoot should be the same. A sudden location change — especially to somewhere private, isolated, or unfamiliar — is a serious warning sign. You are always allowed to cancel.',
      },
      {
        heading: '4. "We\'ll pay you in exposure"',
        body: 'Exposure doesn\'t pay rent. Free collabs are legitimate — but they should be framed as mutual creative projects, not as a favor to you. If a client is asking for commercial-quality work for free and calling it "exposure," that\'s not a collab — it\'s unpaid labor.',
      },
      {
        heading: '5. Asking you to move communication off-platform',
        body: '"Let\'s just text" or "here\'s my personal number" before you\'ve verified who this person is. Keep conversations on Dotshot until you\'ve confirmed the project is real and the person is legitimate. The platform gives you a record of all communications.',
      },
      {
        heading: 'Trust your instincts',
        body: 'If something feels off — even if you can\'t name it — it\'s okay to decline. Your safety is not worth any booking. Use the Gig Safety check-in before every in-person session: send your location and expected return time to someone you trust.',
      },
    ],
  },
  {
    id: 'agreement-library',
    title: 'How the Agreement Library Protects You',
    summary: 'Most creative disputes happen because expectations were never written down. Here\'s what each agreement does and when to use it.',
    category: 'business',
    icon: FileText,
    readTime: '4 min',
    available: true,
    content: [
      {
        heading: 'Why you need agreements for free collabs too',
        body: 'Paid shoots are obvious — but free collabs are where most creative disputes happen. "I thought I could post the photos." "I thought I owned the copyright." "I thought credit wasn\'t required." None of these conversations should happen after the shoot. Sign before you start.',
      },
      {
        heading: 'Media Release Agreement',
        body: 'The most commonly used agreement. Defines who can use the content, where, for how long, and under what conditions. Sets whether the creative keeps copyright (default — they do) and what rights the client receives.',
        list: [
          'Use for: any shoot where photos or video will be used by someone else',
          'Covers: photo/video rights, exclusivity, portfolio rights, credit',
        ],
      },
      {
        heading: 'Collaboration Agreement',
        body: 'Built for free creative collabs. Defines ownership, posting rights, and credit requirements — the three things that cause the most disputes.',
        list: [
          'Use for: unpaid shoots between two or more creatives',
          'Covers: who owns the content, when each party can post, how to credit each other',
        ],
      },
      {
        heading: 'Minor Release Form',
        body: 'Required any time anyone under 18 is involved — no exceptions. A parent or legal guardian must sign, and must be physically present for the entire shoot.',
        list: [
          'Use for: any project involving a minor',
          'Includes: emergency contact, medical notes, usage consent, on-site presence confirmation',
        ],
      },
      {
        heading: 'Coming soon: Paid Service, NDA, Buyout, Location Release',
        body: 'The full library is being built. The most critical agreements — especially the Buyout Agreement (full copyright transfer) — will be added soon. Never transfer copyright without a dedicated, separately negotiated buyout contract.',
      },
    ],
  },
  {
    id: 'pricing',
    title: 'How to Price Your Creative Work',
    summary: 'From day rates to usage licensing — what to charge and how to justify it.',
    category: 'business',
    icon: DollarSign,
    readTime: '6 min',
    available: false,
  },
  {
    id: 'first-booking',
    title: 'Getting Your First Campaign Booking',
    summary: 'Your profile is set. Now how do you actually get selected for a paid campaign?',
    category: 'platform',
    icon: Star,
    readTime: '5 min',
    available: false,
  },
  {
    id: 'lighting',
    title: 'Lighting Basics Every Photographer Should Know',
    summary: 'Natural light, golden hour, and how to work with any environment you\'re handed.',
    category: 'creative',
    icon: Camera,
    readTime: '7 min',
    available: false,
  },
  {
    id: 'portfolio',
    title: 'Building a Portfolio That Gets You Booked',
    summary: 'What to include, what to leave out, and how to show range without looking scattered.',
    category: 'creative',
    icon: BookOpen,
    readTime: '5 min',
    available: false,
  },
  {
    id: 'client-vetting',
    title: 'How to Vet a Client Before Accepting a Campaign',
    summary: 'What to look for in a campaign listing, what questions to ask, and when to walk away.',
    category: 'safety',
    icon: Shield,
    readTime: '4 min',
    available: false,
  },
  {
    id: 'freelance-business',
    title: 'The Business of Being a Freelance Creative',
    summary: 'Taxes, contracts, insurance, and what to set up before you start getting paid.',
    category: 'business',
    icon: Briefcase,
    readTime: '8 min',
    available: false,
  },
]

const CATEGORIES: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: GraduationCap },
  { id: 'platform', label: 'Platform Guides', icon: BookOpen },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'business', label: 'Business', icon: DollarSign },
  { id: 'creative', label: 'Creative Skills', icon: Camera },
]

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: Article }) {
  const [open, setOpen] = useState(false)
  const Icon = article.icon

  return (
    <div className={cn(
      'bg-surface border rounded-xl transition-all duration-200',
      article.available
        ? 'border-border hover:border-gold/30'
        : 'border-border/50 opacity-60'
    )}>
      <button
        className="w-full text-left p-4 sm:p-5"
        onClick={() => article.available && setOpen(o => !o)}
        disabled={!article.available}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
            article.available
              ? 'bg-gold/10 border border-gold/20'
              : 'bg-border/40 border border-border/40'
          )}>
            <Icon size={16} className={article.available ? 'text-gold' : 'text-text-faint'} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-semibold text-text">{article.title}</span>
              {article.tag && article.available && (
                <span className="text-[10px] bg-gold/15 text-gold rounded px-1.5 py-0.5 font-medium">
                  {article.tag}
                </span>
              )}
              {!article.available && (
                <span className="text-[10px] bg-border/40 text-text-faint rounded px-1.5 py-0.5 flex items-center gap-1">
                  <Clock size={9} /> Coming Soon
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{article.summary}</p>
            {article.available && (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-text-faint">{article.readTime} read</span>
                <span className="text-xs text-gold font-medium">
                  {open ? 'Close ↑' : 'Read →'}
                </span>
              </div>
            )}
          </div>

          {article.available && (
            <div className="flex-shrink-0 ml-1 mt-0.5">
              {open
                ? <ChevronUp size={16} className="text-text-muted" />
                : <ChevronDown size={16} className="text-text-muted" />
              }
            </div>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {open && article.content && (
        <div className="px-4 sm:px-5 pb-5 border-t border-border pt-4">
          <div className="space-y-5">
            {article.content.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h3 className="text-sm font-semibold text-text mb-2">{section.heading}</h3>
                )}
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j} className="text-sm text-text-muted leading-relaxed mb-2">{para}</p>
                ))}
                {section.list && (
                  <ul className="mt-2 space-y-1.5">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text-muted">
                        <span className="text-gold mt-1 flex-shrink-0">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EducationPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filtered = activeCategory === 'all'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory)

  const availableCount = ARTICLES.filter(a => a.available).length

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <GraduationCap size={20} className="text-gold" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dotshot Academy</h1>
          <p className="text-text-muted text-sm">
            Guides, tips, and resources for every creative — from your first collab to your first campaign.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6 pl-1">
        <span className="text-xs text-text-faint">
          <strong className="text-text">{availableCount}</strong> guides available
        </span>
        <span className="text-text-faint text-xs">·</span>
        <span className="text-xs text-text-faint">
          <strong className="text-text">{ARTICLES.length - availableCount}</strong> more coming soon
        </span>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {CATEGORIES.map(({ id, label, icon: CatIcon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0',
              activeCategory === id
                ? 'bg-gold/15 text-gold border border-gold/25'
                : 'bg-surface border border-border text-text-muted hover:text-text hover:border-border-light'
            )}
          >
            <CatIcon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Featured callout — only on All view */}
      {activeCategory === 'all' && (
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-5 flex items-start gap-3">
          <Lightbulb size={18} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text mb-0.5">New to Dotshot?</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Start with <strong className="text-text">Complete Your Profile</strong>, then{' '}
              <strong className="text-text">5 Red Flags to Watch For</strong>. Those two will get you
              oriented and safe before your first shoot.
            </p>
          </div>
        </div>
      )}

      {/* Articles */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={36} className="text-text-faint mx-auto mb-3" />
            <p className="text-sm text-text-muted">No guides in this category yet — check back soon.</p>
          </div>
        ) : (
          filtered.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 bg-surface border border-border rounded-xl p-5 text-center">
        <Badge variant="muted" className="mb-3">Have a question?</Badge>
        <p className="text-sm text-text-muted mb-1">
          Topic not covered? Something you wish we explained better?
        </p>
        <p className="text-xs text-text-faint">
          Post it in the <strong className="text-text">Forum</strong> — your question might become the next guide.
        </p>
      </div>
    </div>
  )
}
