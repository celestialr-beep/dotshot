'use client'

import { useState } from 'react'
import {
  Camera, FileText, Shield, DollarSign, Lock, FileKey,
  Building, MapPin, UserCheck, Handshake, BookOpen, Gavel,
  ArrowLeft, CheckCircle, Download, AlertTriangle, Clock,
  Baby,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────
type AgreementId =
  | 'media-release' | 'collaboration' | 'minor-release'
  | 'talent-release' | 'paid-service' | 'content-license'
  | 'nda' | 'buyout' | 'location-release' | 'contractor'

interface AgreementDoc {
  id: AgreementId
  icon: React.ElementType
  title: string
  description: string
  available: boolean
  tag?: string
  tagColor?: 'gold' | 'amber'
}

const AGREEMENTS: AgreementDoc[] = [
  {
    id: 'media-release',
    icon: Camera,
    title: 'Media Release Agreement',
    description: 'Photo, video, and likeness rights. Defines how your work can be used, where, and for how long.',
    available: true,
    tag: 'Most Used',
    tagColor: 'gold',
  },
  {
    id: 'collaboration',
    icon: Handshake,
    title: 'Collaboration Agreement',
    description: 'For unpaid creative collabs. Defines expectations, ownership, posting rights, and credit requirements before the shoot.',
    available: true,
    tag: 'Free Collabs',
    tagColor: 'gold',
  },
  {
    id: 'minor-release',
    icon: Shield,
    title: 'Minor Release Form',
    description: 'Required when anyone under 18 is involved. Includes full parent/guardian consent, emergency contact, and on-site presence requirements.',
    available: true,
    tag: 'Required for Minors',
    tagColor: 'amber',
  },
  {
    id: 'talent-release',
    icon: UserCheck,
    title: 'Talent Release Form',
    description: 'For models, actors, performers, and musicians. Protects rights to use image, voice, and likeness commercially.',
    available: false,
  },
  {
    id: 'paid-service',
    icon: DollarSign,
    title: 'Paid Service Agreement',
    description: 'Defines payment terms, deposits, deliverable timelines, revision rounds, and cancellation fees for paid work.',
    available: false,
  },
  {
    id: 'content-license',
    icon: FileKey,
    title: 'Content Licensing Agreement',
    description: 'Specifies where content can be used, for how long, exclusivity windows, and commercial and advertising rights.',
    available: false,
  },
  {
    id: 'nda',
    icon: Lock,
    title: 'Non-Disclosure Agreement (NDA)',
    description: 'Protects unreleased campaigns, celebrity shoots, brand deals, and confidential project details.',
    available: false,
  },
  {
    id: 'buyout',
    icon: Gavel,
    title: 'Buyout Agreement',
    description: 'Full copyright transfer. Ensures creatives are fully compensated before permanently transferring ownership. Never sign without this.',
    available: false,
    tag: 'Critical',
    tagColor: 'amber',
  },
  {
    id: 'location-release',
    icon: MapPin,
    title: 'Location Release',
    description: 'Required for filming on private property, studios, or venues. Protects all parties from property disputes.',
    available: false,
  },
  {
    id: 'contractor',
    icon: Building,
    title: 'Independent Contractor Agreement',
    description: 'Establishes the creative-as-contractor relationship clearly. Protects against worker misclassification liability.',
    available: false,
    tag: 'Platform Legal',
    tagColor: 'gold',
  },
]

const SAFETY_DOCS = [
  'Terms of Service',
  'Privacy Policy',
  'Community Guidelines',
  'DMCA / Copyright Takedown Policy',
  'Child Safety Standards',
  'Harassment & Anti-Exploitation Policy',
  'Creator Verification Standards',
  'Ban & Appeal Procedures',
]

// ─── Shared sub-components ───────────────────────────────────────────────────
function SelectField({
  label, name, value, onChange, options,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-muted">{label}</label>
      <select name={name} value={value} onChange={onChange}
        className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function SectionCard({ title, part, children }: { title: string; part: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <h2 className="font-semibold text-sm flex items-center gap-2">
        <Badge variant="muted">{part}</Badge> {title}
      </h2>
      {children}
    </div>
  )
}

function SignedConfirmation({
  summary, onReset,
}: {
  summary: { label: string; value: string }[]
  onReset: () => void
}) {
  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto text-center py-14">
      <CheckCircle size={52} className="text-green-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Agreement Signed</h1>
      <p className="text-text-muted mb-6 text-sm">
        Both parties have signed. A confirmation copy is saved to your Dotshot account.
      </p>
      <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 text-left mb-6">
        <h2 className="font-semibold mb-3 text-sm">Agreement Summary</h2>
        <div className="space-y-2 text-sm text-text-muted">
          {summary.map(({ label, value }) => value ? (
            <p key={label}><strong className="text-text">{label}:</strong> {value}</p>
          ) : null)}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onReset} variant="outline">Create Another</Button>
        <Button><Download size={15} /> Download PDF</Button>
      </div>
    </div>
  )
}

function SignatureSection({
  fields, onSign, loading, agreed, setAgreed,
}: {
  fields: { name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }[]
  onSign: (e: React.FormEvent) => void
  loading: boolean
  agreed: boolean
  setAgreed: (v: boolean) => void
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <h2 className="font-semibold text-sm flex items-center gap-2">
        <Badge variant="muted">Signatures</Badge> Sign to Finalize
      </h2>
      <p className="text-xs text-text-faint">
        By typing your full legal name below, you confirm you have read and agree to all terms.
      </p>
      {fields.map(f => (
        <Input
          key={f.name} label={f.label} name={f.name}
          placeholder="Full legal name" value={f.value}
          onChange={f.onChange} required
        />
      ))}
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
          className="w-4 h-4 accent-gold mt-0.5 flex-shrink-0" required />
        <span className="text-xs text-text-muted leading-relaxed">
          I confirm all information is accurate, I am authorized to enter this agreement, and I agree to be legally bound by its terms.
        </span>
      </label>
    </div>
  )
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" onClick={onBack}
      className="flex items-center gap-2 text-sm text-text-muted hover:text-text mb-6 -mt-2">
      <ArrowLeft size={15} /> Back to Library
    </button>
  )
}

// ─── Library View ─────────────────────────────────────────────────────────────
function LibraryView({ onSelect }: { onSelect: (id: AgreementId) => void }) {
  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <BookOpen size={20} className="text-gold" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Creator & Client Legal Library</h1>
          <p className="text-text-muted text-sm">Professional agreements — ready before every shoot.</p>
        </div>
      </div>

      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-8">
        <p className="text-xs text-text-muted leading-relaxed">
          <strong className="text-gold">Protect yourself before every collab — paid or free.</strong>{' '}
          Agreements define who owns the photos, who can post, what credit is required, and what happens
          if plans change. This prevents 90% of creative disputes. Use one before every shoot.
        </p>
      </div>

      {/* Essential Creator Agreements */}
      <h2 className="text-sm font-semibold mb-1 text-text">Essential Creator Agreements</h2>
      <p className="text-xs text-text-muted mb-4">Tap any available agreement to open and sign with your collaborator.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {AGREEMENTS.map(({ id, icon: Icon, title, description, available, tag, tagColor }) => (
          <button
            key={id}
            onClick={() => available && onSelect(id)}
            disabled={!available}
            className={cn(
              'text-left p-4 rounded-xl border transition-all duration-200 group w-full',
              available
                ? 'bg-surface border-border hover:border-gold/40 hover:bg-gold/5 cursor-pointer active:scale-[0.98]'
                : 'bg-surface/50 border-border/50 cursor-not-allowed opacity-60'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                available
                  ? 'bg-gold/10 border border-gold/20 group-hover:bg-gold/20'
                  : 'bg-border/50 border border-border/50'
              )}>
                <Icon size={16} className={available ? 'text-gold' : 'text-text-faint'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-text">{title}</span>
                  {tag && available && (
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-medium',
                      tagColor === 'amber'
                        ? 'bg-amber-400/15 text-amber-400'
                        : 'bg-gold/15 text-gold'
                    )}>
                      {tag}
                    </span>
                  )}
                  {!available && (
                    <span className="text-[10px] text-text-faint bg-border/40 rounded px-1.5 py-0.5 flex items-center gap-1">
                      <Clock size={9} /> Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{description}</p>
              </div>
            </div>
            {available && (
              <div className="mt-3 flex justify-end">
                <span className="text-xs text-gold font-medium group-hover:underline">
                  Open Agreement →
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Platform Safety & Policy Documents */}
      <h2 className="text-sm font-semibold mb-1 text-text">Platform Safety & Policy Documents</h2>
      <p className="text-xs text-text-muted mb-4">
        These govern how the platform operates and protect all users — creators, clients, and collaborators.
      </p>

      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-4">
        {SAFETY_DOCS.map((title, i) => (
          <div key={title} className={cn(
            'flex items-center gap-3 px-4 py-3',
            i < SAFETY_DOCS.length - 1 && 'border-b border-border'
          )}>
            <FileText size={14} className="text-text-faint flex-shrink-0" />
            <span className="text-sm text-text-muted flex-1">{title}</span>
            <span className="text-[10px] text-text-faint bg-border/40 rounded px-1.5 py-0.5 flex items-center gap-1 flex-shrink-0">
              <Clock size={9} /> Coming Soon
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-faint leading-relaxed">
        Our Privacy Policy will be honest and plain-language — stating what data we collect and how it&apos;s used,
        without making promises we can&apos;t guarantee as the platform grows. You&apos;ll always be notified of any changes.
      </p>
    </div>
  )
}

// ─── Media Release Form ───────────────────────────────────────────────────────
function MediaReleaseForm({ onBack }: { onBack: () => void }) {
  const [signed, setSigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    creative_name: '', creative_role: '', creative_email: '',
    client_name: '', project_name: '', shoot_date: '', shoot_location: '',
    compensation: '', usage_scope: 'social_media', exclusivity: 'non_exclusive',
    credit_required: true, portfolio_rights: true,
    minor_involved: false, guardian_name: '',
    creative_signature: '', client_signature: '', agreed: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement
    const value = target.type === 'checkbox' ? target.checked : target.value
    setForm(prev => ({ ...prev, [e.target.name]: value }))
  }

  async function handleSign(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSigned(true)
  }

  if (signed) return (
    <SignedConfirmation
      summary={[
        { label: 'Project', value: form.project_name },
        { label: 'Creative', value: `${form.creative_name} (${form.creative_role})` },
        { label: 'Client', value: form.client_name },
        { label: 'Shoot Date', value: form.shoot_date },
        { label: 'Location', value: form.shoot_location },
        { label: 'Compensation', value: form.compensation || 'Collaboration — no monetary compensation' },
      ]}
      onReset={() => { setSigned(false); setForm(f => ({ ...f, creative_signature: '', client_signature: '', agreed: false })) }}
    />
  )

  return (
    <form onSubmit={handleSign} className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      <BackLink onBack={onBack} />

      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center flex-shrink-0">
          <Camera size={20} className="text-gold" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Media Release Agreement</h1>
          <p className="text-text-muted text-sm">Photo, video, and likeness rights between creative and client.</p>
        </div>
      </div>

      <SectionCard title="Creative Professional" part="Part 1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Full Legal Name" name="creative_name" placeholder="Your full name" value={form.creative_name} onChange={handleChange} required />
          <Input label="Role / Title" name="creative_role" placeholder="e.g. Photographer" value={form.creative_role} onChange={handleChange} required />
        </div>
        <Input label="Email Address" name="creative_email" type="email" placeholder="your@email.com" value={form.creative_email} onChange={handleChange} required />
      </SectionCard>

      <SectionCard title="Client & Project" part="Part 2">
        <Input label="Client Name / Brand" name="client_name" placeholder="Brand or individual hiring" value={form.client_name} onChange={handleChange} required />
        <Input label="Project / Campaign Name" name="project_name" placeholder="e.g. Fall Editorial 2026" value={form.project_name} onChange={handleChange} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Shoot Date" name="shoot_date" type="date" value={form.shoot_date} onChange={handleChange} required />
          <Input label="Shoot Location" name="shoot_location" placeholder="Full address" value={form.shoot_location} onChange={handleChange} required />
        </div>
      </SectionCard>

      <SectionCard title="Compensation & Usage Terms" part="Part 3">
        <Input
          label="Compensation (leave blank for free collab)"
          name="compensation" placeholder="e.g. $500 flat fee"
          value={form.compensation} onChange={handleChange}
        />
        <SelectField label="Media Usage Rights Granted to Client" name="usage_scope" value={form.usage_scope} onChange={handleChange}
          options={[
            { value: 'social_media', label: 'Social media and digital platforms only' },
            { value: 'commercial', label: 'Commercial use including advertising and print' },
            { value: 'editorial', label: 'Editorial and press use only' },
            { value: 'internal', label: 'Internal business use only' },
            { value: 'unlimited', label: 'Unlimited usage across all media' },
          ]}
        />
        <SelectField label="Exclusivity" name="exclusivity" value={form.exclusivity} onChange={handleChange}
          options={[
            { value: 'non_exclusive', label: 'Non-exclusive — creative may work with others' },
            { value: 'exclusive_30', label: 'Exclusive for 30 days post-delivery' },
            { value: 'exclusive_90', label: 'Exclusive for 90 days post-delivery' },
            { value: 'exclusive_1yr', label: 'Exclusive for 1 year post-delivery' },
          ]}
        />
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="credit_required" checked={form.credit_required} onChange={handleChange} className="w-4 h-4 accent-gold" />
            <span className="text-sm text-text-muted"><strong className="text-text">Credit required</strong> — client must credit the creative when using the work</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="portfolio_rights" checked={form.portfolio_rights} onChange={handleChange} className="w-4 h-4 accent-gold" />
            <span className="text-sm text-text-muted"><strong className="text-text">Portfolio rights</strong> — creative may display this work in their portfolio</span>
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Minor Involvement" part="Part 4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="minor_involved" checked={form.minor_involved} onChange={handleChange} className="w-4 h-4 accent-gold" />
          <span className="text-sm text-text-muted"><strong className="text-text">This project involves a Minor (under 18)</strong></span>
        </label>
        {form.minor_involved && (
          <div className="space-y-3">
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg p-3">
              <p className="text-xs text-amber-400/90 flex items-start gap-2">
                <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                A legal parent or guardian must sign. For full minor protection, use the dedicated{' '}
                <strong>Minor Release Form</strong> from the library — it includes emergency contacts,
                medical notes, and comprehensive consent fields.
              </p>
            </div>
            <Input label="Parent / Guardian Full Legal Name" name="guardian_name" placeholder="Guardian's full legal name"
              value={form.guardian_name} onChange={handleChange} required={form.minor_involved} />
          </div>
        )}
      </SectionCard>

      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 sm:p-5">
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <FileText size={14} className="text-gold" /> Intellectual Property — Standard Clause
        </h2>
        <p className="text-xs text-text-muted leading-relaxed">
          The creative professional retains full copyright ownership of all work produced. The client receives a
          limited license as defined above. No full transfer of intellectual property occurs unless explicitly
          stated in a separate written buyout agreement. The client may not sublicense, sell, or transfer
          the work to third parties without written consent from the creative professional.
        </p>
      </div>

      <SignatureSection
        fields={[
          { name: 'creative_signature', label: 'Creative Professional — Type your full legal name to sign', value: form.creative_signature, onChange: handleChange },
          { name: 'client_signature', label: 'Client / Brand Representative — Type full legal name to sign', value: form.client_signature, onChange: handleChange },
          ...(form.minor_involved && form.guardian_name
            ? [{ name: 'guardian_signature', label: `Parent/Guardian (${form.guardian_name}) — Type full name to sign`, value: '', onChange: handleChange }]
            : []),
        ]}
        onSign={handleSign} loading={loading}
        agreed={form.agreed} setAgreed={(v) => setForm(f => ({ ...f, agreed: v }))}
      />

      <Button type="submit" loading={loading} className="w-full glow-gold" size="lg" disabled={!form.agreed}>
        <FileText size={18} /> Sign & Finalize Agreement
      </Button>
      <p className="text-xs text-text-faint text-center">
        Stored securely in your Dotshot account. Both parties receive a confirmation copy.
      </p>
    </form>
  )
}

// ─── Collaboration Agreement Form ─────────────────────────────────────────────
function CollaborationForm({ onBack }: { onBack: () => void }) {
  const [signed, setSigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    creative_a_name: '', creative_a_role: '', creative_a_email: '',
    creative_b_name: '', creative_b_role: '', creative_b_email: '',
    project_name: '', shoot_date: '', shoot_location: '', project_description: '',
    ip_ownership: 'photographer_retains',
    posting_rights: 'both_immediate',
    credit_format: 'handle_tag',
    cancellation: 'notice_24h',
    additional_notes: '',
    sig_a: '', sig_b: '', agreed: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement
    const value = target.type === 'checkbox' ? target.checked : target.value
    setForm(prev => ({ ...prev, [e.target.name]: value }))
  }

  async function handleSign(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSigned(true)
  }

  if (signed) return (
    <SignedConfirmation
      summary={[
        { label: 'Project', value: form.project_name },
        { label: 'Party A', value: `${form.creative_a_name} (${form.creative_a_role})` },
        { label: 'Party B', value: `${form.creative_b_name} (${form.creative_b_role})` },
        { label: 'Shoot Date', value: form.shoot_date },
        { label: 'Location', value: form.shoot_location },
      ]}
      onReset={() => { setSigned(false); setForm(f => ({ ...f, sig_a: '', sig_b: '', agreed: false })) }}
    />
  )

  return (
    <form onSubmit={handleSign} className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      <BackLink onBack={onBack} />

      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center flex-shrink-0">
          <Handshake size={20} className="text-gold" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Collaboration Agreement</h1>
          <p className="text-text-muted text-sm">For unpaid creative collabs. Define ownership, credit, and posting rights before the shoot.</p>
        </div>
      </div>

      <SectionCard title="Creative Party A — Lead / Photographer" part="Part 1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Full Legal Name" name="creative_a_name" placeholder="Full name" value={form.creative_a_name} onChange={handleChange} required />
          <Input label="Role" name="creative_a_role" placeholder="e.g. Photographer" value={form.creative_a_role} onChange={handleChange} required />
        </div>
        <Input label="Email" name="creative_a_email" type="email" value={form.creative_a_email} onChange={handleChange} required />
      </SectionCard>

      <SectionCard title="Creative Party B — Model / Co-Creator" part="Part 2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Full Legal Name" name="creative_b_name" placeholder="Full name" value={form.creative_b_name} onChange={handleChange} required />
          <Input label="Role" name="creative_b_role" placeholder="e.g. Model" value={form.creative_b_role} onChange={handleChange} required />
        </div>
        <Input label="Email" name="creative_b_email" type="email" value={form.creative_b_email} onChange={handleChange} required />
      </SectionCard>

      <SectionCard title="Project Details" part="Part 3">
        <Input label="Project Name" name="project_name" placeholder="e.g. Summer Lifestyle Shoot" value={form.project_name} onChange={handleChange} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Shoot Date" name="shoot_date" type="date" value={form.shoot_date} onChange={handleChange} required />
          <Input label="Location" name="shoot_location" placeholder="Address or area" value={form.shoot_location} onChange={handleChange} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted">Project Description</label>
          <textarea name="project_description" value={form.project_description} onChange={handleChange}
            placeholder="Concept, mood, deliverables expected (e.g. 10 edited photos)..."
            rows={3}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
          />
        </div>
      </SectionCard>

      <SectionCard title="Ownership, Posting & Credit" part="Part 4">
        <SelectField label="Who owns the content produced?" name="ip_ownership" value={form.ip_ownership} onChange={handleChange}
          options={[
            { value: 'photographer_retains', label: 'Photographer retains copyright — Party B gets usage license' },
            { value: 'shared_equally', label: 'Both parties share copyright equally' },
            { value: 'joint_consent', label: 'Joint ownership — neither may license without both consenting' },
          ]}
        />
        <SelectField label="Posting Rights" name="posting_rights" value={form.posting_rights} onChange={handleChange}
          options={[
            { value: 'both_immediate', label: 'Both parties may post immediately with credit' },
            { value: 'hold_48h', label: '48-hour hold — courtesy window before either party posts' },
            { value: 'mutual_approval', label: 'Mutual approval required before any post goes live' },
          ]}
        />
        <SelectField label="Credit Requirements" name="credit_format" value={form.credit_format} onChange={handleChange}
          options={[
            { value: 'handle_tag', label: 'Social handle tag required in every post' },
            { value: 'name_caption', label: 'Full name credited in caption' },
            { value: 'no_requirement', label: 'No formal credit requirement (not recommended)' },
          ]}
        />
        <SelectField label="Cancellation Policy" name="cancellation" value={form.cancellation} onChange={handleChange}
          options={[
            { value: 'notice_24h', label: '24-hour advance notice required to cancel' },
            { value: 'notice_48h', label: '48-hour advance notice required to cancel' },
            { value: 'anytime', label: 'Either party may cancel at any time before shoot start' },
          ]}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted">Additional Terms or Notes (optional)</label>
          <textarea name="additional_notes" value={form.additional_notes} onChange={handleChange}
            placeholder="Specific expectations, number of edited deliverables, style requirements, etc."
            rows={3}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
          />
        </div>
      </SectionCard>

      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 sm:p-5">
        <p className="text-xs text-text-muted leading-relaxed">
          <strong className="text-gold">No-compensation agreement.</strong> If payment is involved, use the
          Paid Service Agreement from the library. Either party may use this document as evidence in a dispute.
          Both parties agree to treat each other professionally and honor all terms defined above.
        </p>
      </div>

      <SignatureSection
        fields={[
          { name: 'sig_a', label: `${form.creative_a_role || 'Party A'} — Type your full legal name to sign`, value: form.sig_a, onChange: handleChange },
          { name: 'sig_b', label: `${form.creative_b_role || 'Party B'} — Type your full legal name to sign`, value: form.sig_b, onChange: handleChange },
        ]}
        onSign={handleSign} loading={loading}
        agreed={form.agreed} setAgreed={(v) => setForm(f => ({ ...f, agreed: v }))}
      />

      <Button type="submit" loading={loading} className="w-full glow-gold" size="lg" disabled={!form.agreed}>
        <Handshake size={18} /> Sign Collaboration Agreement
      </Button>
      <p className="text-xs text-text-faint text-center">
        Stored securely. Both parties receive a confirmation copy.
      </p>
    </form>
  )
}

// ─── Minor Release Form ───────────────────────────────────────────────────────
function MinorReleaseForm({ onBack }: { onBack: () => void }) {
  const [signed, setSigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    minor_name: '', minor_dob: '', minor_role: '',
    guardian_name: '', guardian_relationship: 'mother',
    guardian_phone: '', guardian_email: '',
    emergency_name: '', emergency_phone: '', emergency_relationship: '',
    project_name: '', shoot_date: '', shoot_location: '', shoot_duration: '',
    creative_name: '', creative_email: '',
    consent_social: false, consent_portfolio: false, consent_commercial: false,
    medical_notes: '',
    guardian_signature: '', creative_signature: '', agreed: false,
    confirm_legal_guardian: false, guardian_will_be_present: false, confirm_revoke_right: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement
    const value = target.type === 'checkbox' ? target.checked : target.value
    setForm(prev => ({ ...prev, [e.target.name]: value }))
  }

  const ageDisplay = form.minor_dob ? (() => {
    const age = Math.floor((Date.now() - new Date(form.minor_dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    return { age, label: `${age} years old`, isMinor: age < 18 }
  })() : null

  async function handleSign(e: React.FormEvent) {
    e.preventDefault()
    if (!form.confirm_legal_guardian || !form.guardian_will_be_present) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSigned(true)
  }

  if (signed) return (
    <SignedConfirmation
      summary={[
        { label: 'Minor', value: `${form.minor_name}${ageDisplay ? ` (${ageDisplay.label})` : ''}` },
        { label: 'Role', value: form.minor_role },
        { label: 'Guardian', value: `${form.guardian_name} (${form.guardian_relationship})` },
        { label: 'Project', value: form.project_name },
        { label: 'Shoot Date', value: form.shoot_date },
        { label: 'Location', value: form.shoot_location },
        { label: 'Creative', value: form.creative_name },
      ]}
      onReset={() => { setSigned(false); setForm(f => ({ ...f, guardian_signature: '', creative_signature: '', agreed: false })) }}
    />
  )

  const canSign = form.agreed && form.confirm_legal_guardian && form.guardian_will_be_present

  return (
    <form onSubmit={handleSign} className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      <BackLink onBack={onBack} />

      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
          <Shield size={20} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Minor Release Form</h1>
          <p className="text-text-muted text-sm">Required when anyone under 18 participates. Legal parent or guardian must complete and sign.</p>
        </div>
      </div>

      {/* Mandatory warning */}
      <div className="bg-amber-400/5 border border-amber-400/30 rounded-xl p-4">
        <p className="text-sm text-amber-400 font-semibold flex items-center gap-2 mb-2">
          <AlertTriangle size={15} /> Legal Requirement — Read Before Proceeding
        </p>
        <ul className="text-xs text-amber-300/80 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>A <strong>legal parent or court-appointed guardian</strong> must complete and sign — not the minor</li>
          <li>The parent/guardian must be <strong>physically present for the entire shoot</strong>, no exceptions</li>
          <li>Emergency contact must be a <strong>different person</strong> from the parent/guardian</li>
          <li>This form must be signed and on file <strong>before any photography or filming begins</strong></li>
        </ul>
      </div>

      <SectionCard title="Minor's Information" part="Part 1">
        <Input label="Minor's Full Legal Name" name="minor_name" placeholder="Minor's full legal name"
          value={form.minor_name} onChange={handleChange} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Input label="Date of Birth" name="minor_dob" type="date"
              value={form.minor_dob} onChange={handleChange} required />
            {ageDisplay && (
              <p className={cn('text-xs mt-1.5 font-medium', ageDisplay.isMinor ? 'text-amber-400' : 'text-red-400')}>
                {ageDisplay.isMinor
                  ? `✓ ${ageDisplay.label} — Minor Release applies`
                  : `⚠ ${ageDisplay.label} — This person is 18+. Use a standard agreement.`}
              </p>
            )}
          </div>
          <Input label="Minor's Role in Production" name="minor_role" placeholder="e.g. Child Model, Young Performer"
            value={form.minor_role} onChange={handleChange} required />
        </div>
      </SectionCard>

      <SectionCard title="Parent / Legal Guardian" part="Part 2">
        <div className="bg-surface-2 border border-border rounded-lg p-3">
          <p className="text-xs text-text-muted">
            Must be the <strong className="text-text">legal parent or court-appointed guardian.</strong>{' '}
            A relative, family friend, or informal caretaker does not qualify.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Guardian's Full Legal Name" name="guardian_name" placeholder="Full legal name"
            value={form.guardian_name} onChange={handleChange} required />
          <SelectField label="Relationship to Minor" name="guardian_relationship" value={form.guardian_relationship}
            onChange={handleChange}
            options={[
              { value: 'mother', label: 'Mother' },
              { value: 'father', label: 'Father' },
              { value: 'legal_guardian', label: 'Legal Guardian (court-appointed)' },
              { value: 'other', label: 'Other (specify in notes)' },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Guardian's Phone Number" name="guardian_phone" type="tel" placeholder="+1 (555) 000-0000"
            value={form.guardian_phone} onChange={handleChange} required />
          <Input label="Guardian's Email" name="guardian_email" type="email" placeholder="guardian@email.com"
            value={form.guardian_email} onChange={handleChange} required />
        </div>
        <div className="space-y-3 pt-1">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="confirm_legal_guardian" checked={form.confirm_legal_guardian}
              onChange={handleChange} className="w-4 h-4 accent-gold mt-0.5 flex-shrink-0" required />
            <span className="text-sm text-text-muted">
              <strong className="text-text">I confirm I am the legal parent or court-appointed guardian</strong>{' '}
              of {form.minor_name || 'the minor named above'}.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="guardian_will_be_present" checked={form.guardian_will_be_present}
              onChange={handleChange} className="w-4 h-4 accent-gold mt-0.5 flex-shrink-0" required />
            <span className="text-sm text-text-muted">
              <strong className="text-text">I will be physically present for the entire production session</strong>{' '}
              and will not leave the minor unsupervised at any time.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="confirm_revoke_right" checked={form.confirm_revoke_right}
              onChange={handleChange} className="w-4 h-4 accent-gold mt-0.5 flex-shrink-0" />
            <span className="text-sm text-text-muted">
              I understand I may revoke this consent in writing at any time before content is published or distributed.
            </span>
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Emergency Contact" part="Part 3">
        <p className="text-xs text-text-muted">Must be a <strong className="text-text">different person</strong> from the parent/guardian above.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Emergency Contact Name" name="emergency_name" placeholder="Full name"
            value={form.emergency_name} onChange={handleChange} required />
          <Input label="Phone Number" name="emergency_phone" type="tel" placeholder="+1 (555) 000-0000"
            value={form.emergency_phone} onChange={handleChange} required />
        </div>
        <Input label="Relationship to Minor" name="emergency_relationship"
          placeholder="e.g. Aunt, Grandparent, Family Friend"
          value={form.emergency_relationship} onChange={handleChange} required />
      </SectionCard>

      <SectionCard title="Production Details" part="Part 4">
        <Input label="Project / Campaign Name" name="project_name" placeholder="e.g. Back to School Campaign"
          value={form.project_name} onChange={handleChange} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Shoot Date" name="shoot_date" type="date" value={form.shoot_date} onChange={handleChange} required />
          <Input label="Estimated Duration" name="shoot_duration" placeholder="e.g. 2 hours, Half-day"
            value={form.shoot_duration} onChange={handleChange} required />
        </div>
        <Input label="Shoot Location (Full Address)" name="shoot_location" placeholder="Complete address"
          value={form.shoot_location} onChange={handleChange} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Creative Professional / Photographer" name="creative_name" placeholder="Name"
            value={form.creative_name} onChange={handleChange} required />
          <Input label="Creative's Email" name="creative_email" type="email"
            value={form.creative_email} onChange={handleChange} required />
        </div>
      </SectionCard>

      <SectionCard title="Usage Consent" part="Part 5">
        <p className="text-xs text-text-muted">Check all uses you, as parent/guardian, consent to for the minor&apos;s image and likeness:</p>
        <div className="space-y-3">
          {[
            { name: 'consent_social', label: 'Social media and digital platforms' },
            { name: 'consent_portfolio', label: 'Portfolio and promotional materials' },
            { name: 'consent_commercial', label: 'Commercial use (advertising, print, licensed content)' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name={name}
                checked={form[name as keyof typeof form] as boolean}
                onChange={handleChange} className="w-4 h-4 accent-gold" />
              <span className="text-sm text-text-muted">{label}</span>
            </label>
          ))}
        </div>
        {!form.consent_social && !form.consent_portfolio && !form.consent_commercial && (
          <p className="text-xs text-amber-400 mt-1">
            ⚠ No usage selected — content may only be used for the specific pre-agreed purposes stated in writing.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Medical & Safety Information" part="Part 6">
        <p className="text-xs text-text-muted">
          Optional but recommended. Note allergies, medical conditions, or restrictions that could affect participation.
        </p>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted">Medical Notes</label>
          <textarea name="medical_notes" value={form.medical_notes} onChange={handleChange}
            placeholder="Allergies, medications, conditions, dietary restrictions — or 'None known' if none apply..."
            rows={3}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
          />
        </div>
      </SectionCard>

      <SignatureSection
        fields={[
          { name: 'guardian_signature', label: `Parent/Guardian (${form.guardian_name || '...'}) — Type full legal name to sign`, value: form.guardian_signature, onChange: handleChange },
          { name: 'creative_signature', label: 'Creative Professional — Type full legal name to sign', value: form.creative_signature, onChange: handleChange },
        ]}
        onSign={handleSign} loading={loading}
        agreed={form.agreed} setAgreed={(v) => setForm(f => ({ ...f, agreed: v }))}
      />

      {!form.guardian_will_be_present && form.confirm_legal_guardian && (
        <div className="bg-red-400/5 border border-red-400/30 rounded-xl p-4">
          <p className="text-xs text-red-400 flex items-start gap-2">
            <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
            Guardian must confirm on-site presence before this agreement can be finalized.
          </p>
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg" disabled={!canSign}>
        <Baby size={18} /> Sign Minor Release Form
      </Button>
      <p className="text-xs text-text-faint text-center">
        Stored securely. Guardian, creative professional, and platform each receive a copy.
      </p>
    </form>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AgreementsPage() {
  const [view, setView] = useState<'library' | AgreementId>('library')

  if (view === 'library') return <LibraryView onSelect={setView} />
  if (view === 'media-release') return <MediaReleaseForm onBack={() => setView('library')} />
  if (view === 'collaboration') return <CollaborationForm onBack={() => setView('library')} />
  if (view === 'minor-release') return <MinorReleaseForm onBack={() => setView('library')} />

  // Agreements not yet built — shows placeholder
  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <button onClick={() => setView('library')}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text mb-6">
        <ArrowLeft size={15} /> Back to Library
      </button>
      <div className="text-center py-16">
        <Clock size={48} className="text-text-faint mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-text-muted text-sm max-w-xs mx-auto">
          This agreement template is being drafted. Check back soon — we&apos;re building out the full legal library.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setView('library')}>
          Back to Library
        </Button>
      </div>
    </div>
  )
}
