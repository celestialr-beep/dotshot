import {
  MapPin, DollarSign, Calendar, Users, CheckCircle,
  Briefcase, FileText, Star, ArrowLeft, Clock
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ROLE_LABELS, ROLE_COLORS, formatCurrency, formatDate } from '@/lib/utils'
import type { UserRole } from '@/types'
import Link from 'next/link'

// Mock data — will be replaced with Supabase fetch by campaign id
const mockCampaign = {
  id: '1',
  title: 'Crown & Capture: LuxSkin Fall Campaign',
  description: `Premium skincare brand seeking a full creative team for a 2-day editorial campaign for their Fall 2026 line. High-end luxury aesthetic with moody autumnal tones.

We're looking for passionate creatives who can bring a cohesive vision to life. The shoot will take place over two days — one indoor studio day and one outdoor golden hour day.

All selected creatives will receive full payment within 5 business days of campaign completion via Stripe. Media usage rights will be outlined in the Dotshot contract agreement.`,
  location: 'Orlando, FL',
  city: 'Orlando',
  budget_min: 800,
  budget_max: 1200,
  roles_needed: ['photographer', 'makeup_artist', 'hairstylist', 'model'] as UserRole[],
  start_date: '2026-06-15',
  end_date: '2026-06-16',
  status: 'open' as const,
  is_featured: true,
  application_count: 23,
  deliverables: [
    'Minimum 50 edited high-resolution images',
    '3–5 short-form video clips (15–30s)',
    'BTS content for social media',
    'All raw files delivered within 14 days',
  ],
  requirements: [
    'Minimum 2 years professional experience',
    'Portfolio demonstrating luxury/fashion aesthetic',
    'Available both days (June 15–16)',
    'Equipment and tools are your responsibility',
    'Must sign Dotshot media agreement',
  ],
  client: {
    username: 'luxskin_brand',
    full_name: 'LuxSkin Official',
    avatar_url: null,
    is_verified: true,
    completed_projects: 12,
    rating: 4.8,
  },
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaign = { ...mockCampaign, id }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/campaigns" className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-6">
        <ArrowLeft size={16} />
        Back to Campaigns
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Header card */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {campaign.is_featured && (
                <Badge variant="gold">
                  <Star size={9} fill="currentColor" /> Featured Campaign
                </Badge>
              )}
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Open</Badge>
              <span className="text-xs text-text-faint ml-auto">{campaign.application_count} applicants</span>
            </div>

            <h1 className="text-xl font-bold mb-3">{campaign.title}</h1>

            <div className="flex flex-wrap gap-4 mb-4">
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <MapPin size={14} className="text-gold" /> {campaign.location}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <DollarSign size={14} className="text-gold" />
                {formatCurrency(campaign.budget_min)} – {formatCurrency(campaign.budget_max)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <Calendar size={14} className="text-gold" />
                {formatDate(campaign.start_date)} – {formatDate(campaign.end_date!)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <Clock size={14} className="text-gold" />
                2 days
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              <span className="text-xs text-text-faint flex items-center gap-1 mr-1">
                <Users size={11} /> Roles needed:
              </span>
              {campaign.roles_needed.map((role) => (
                <Badge key={role} className={ROLE_COLORS[role]}>
                  {ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>

            <div className="border-t border-border pt-4 prose-sm">
              {campaign.description.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm text-text-muted leading-relaxed mb-3 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={16} className="text-gold" />
              <h2 className="font-semibold">Deliverables</h2>
            </div>
            <ul className="flex flex-col gap-2">
              {campaign.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-text-muted">
                  <CheckCircle size={14} className="text-gold mt-0.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-gold" />
              <h2 className="font-semibold">Requirements</h2>
            </div>
            <ul className="flex flex-col gap-2">
              {campaign.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-border-light mt-1.5 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal note */}
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex gap-3">
            <FileText size={16} className="text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Dotshot Media Agreement Required</p>
              <p className="text-xs text-text-muted leading-relaxed">
                All selected creatives must sign the Dotshot contract which outlines IP ownership, media usage rights,
                payment terms, and confidentiality. You may exit this agreement at any time — media created under the
                agreement cannot be used commercially without the client&apos;s written consent.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Apply CTA */}
          <div className="bg-surface border border-gold/30 rounded-xl p-5 sticky top-6">
            <div className="text-2xl font-black text-gradient-gold mb-1">
              {formatCurrency(campaign.budget_min)}–{formatCurrency(campaign.budget_max)}
            </div>
            <p className="text-xs text-text-muted mb-4">Per selected role. Paid via Stripe on completion.</p>

            <Button className="w-full mb-2 glow-gold">Apply for This Campaign</Button>
            <Button variant="outline" className="w-full text-sm">Save for Later</Button>

            <p className="text-xs text-text-faint text-center mt-3 leading-relaxed">
              Pro plan required to apply. <Link href="/signup" className="text-gold hover:underline">Upgrade to Pro →</Link>
            </p>
          </div>

          {/* Client */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-semibold text-sm mb-3">About the Client</h2>
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={campaign.client.full_name} size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{campaign.client.full_name}</span>
                  {campaign.client.is_verified && <CheckCircle size={13} className="text-gold" fill="currentColor" />}
                </div>
                <span className="text-xs text-text-muted">@{campaign.client.username}</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <div className="font-bold">{campaign.client.completed_projects}</div>
                <div className="text-xs text-text-muted">Campaigns</div>
              </div>
              <div>
                <div className="font-bold flex items-center gap-1">
                  <Star size={12} className="text-gold" fill="currentColor" />
                  {campaign.client.rating}
                </div>
                <div className="text-xs text-text-muted">Rating</div>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-xs text-text-muted text-center">Know someone perfect for this? Share it.</p>
            <Button variant="secondary" size="sm" className="w-full mt-2">Share Campaign</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
