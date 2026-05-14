'use client'

import { useState } from 'react'
import { FileText, CheckCircle, Download, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export default function MediaAgreementPage() {
  const [step, setStep] = useState<'form' | 'preview' | 'signed'>('form')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    // Creative info
    creative_name: '',
    creative_role: '',
    creative_email: '',
    // Client / project info
    client_name: '',
    project_name: '',
    shoot_date: '',
    shoot_location: '',
    // Terms
    compensation: '',
    usage_scope: 'social_media',
    exclusivity: 'non_exclusive',
    credit_required: true,
    portfolio_rights: true,
    minor_involved: false,
    guardian_name: '',
    // Signatures
    creative_signature: '',
    client_signature: '',
    agreed: false,
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
    setStep('signed')
  }

  const usageLabels: Record<string, string> = {
    social_media: 'Social media and digital platforms only',
    commercial: 'Commercial use including advertising and print',
    editorial: 'Editorial and press use only',
    internal: 'Internal business use only',
    unlimited: 'Unlimited usage across all media',
  }

  if (step === 'signed') {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-20">
        <CheckCircle size={56} className="text-green-400 mx-auto mb-5" />
        <h1 className="text-2xl font-bold mb-2">Agreement Signed</h1>
        <p className="text-text-muted mb-6">
          Both parties have signed. A copy has been sent to all participants. This agreement is now on file.
        </p>
        <div className="bg-surface border border-border rounded-xl p-5 text-left mb-6">
          <h2 className="font-semibold mb-3 text-sm">Agreement Summary</h2>
          <div className="space-y-2 text-sm text-text-muted">
            <p><strong className="text-text">Project:</strong> {form.project_name}</p>
            <p><strong className="text-text">Creative:</strong> {form.creative_name} ({form.creative_role})</p>
            <p><strong className="text-text">Client:</strong> {form.client_name}</p>
            <p><strong className="text-text">Shoot Date:</strong> {form.shoot_date}</p>
            <p><strong className="text-text">Location:</strong> {form.shoot_location}</p>
            <p><strong className="text-text">Compensation:</strong> {form.compensation || 'Collaboration — no monetary compensation'}</p>
            <p><strong className="text-text">Usage:</strong> {usageLabels[form.usage_scope]}</p>
            <p><strong className="text-text">Portfolio Rights:</strong> {form.portfolio_rights ? 'Creative may display work in portfolio' : 'Confidential — no portfolio use'}</p>
            <p><strong className="text-text">Credit Required:</strong> {form.credit_required ? 'Yes — creative must be credited' : 'No credit required'}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => { setStep('form'); setForm(f => ({ ...f, creative_signature: '', client_signature: '', agreed: false })) }} variant="outline">
            Create Another
          </Button>
          <Button>
            <Download size={15} /> Download PDF
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <FileText size={24} className="text-gold" />
        <h1 className="text-2xl font-bold">Media Release & Agreement</h1>
      </div>
      <p className="text-text-muted text-sm mb-8">
        A binding agreement between the creative professional and the client. All parties must complete and sign before any shoot begins.
      </p>

      <form onSubmit={handleSign} className="space-y-6">

        {/* Creative info */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Badge variant="muted">Part 1</Badge> Creative Professional
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Legal Name" name="creative_name" placeholder="Your full name" value={form.creative_name} onChange={handleChange} required />
            <Input label="Role / Title" name="creative_role" placeholder="e.g. Photographer" value={form.creative_role} onChange={handleChange} required />
          </div>
          <Input label="Email Address" name="creative_email" type="email" placeholder="your@email.com" value={form.creative_email} onChange={handleChange} required />
        </div>

        {/* Client / Project info */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Badge variant="muted">Part 2</Badge> Client & Project
          </h2>
          <Input label="Client Name / Brand" name="client_name" placeholder="Brand or individual hiring" value={form.client_name} onChange={handleChange} required />
          <Input label="Project / Campaign Name" name="project_name" placeholder="e.g. Fall Editorial 2026" value={form.project_name} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Shoot Date" name="shoot_date" type="date" value={form.shoot_date} onChange={handleChange} required />
            <Input label="Shoot Location" name="shoot_location" placeholder="Full address" value={form.shoot_location} onChange={handleChange} required />
          </div>
        </div>

        {/* Terms */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Badge variant="muted">Part 3</Badge> Compensation & Usage Terms
          </h2>

          <Input
            label="Compensation (leave blank if free collab)"
            name="compensation"
            placeholder="e.g. $500 flat fee, or leave blank for collab"
            value={form.compensation}
            onChange={handleChange}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Media Usage Rights Granted to Client</label>
            <select name="usage_scope" value={form.usage_scope} onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors">
              <option value="social_media">Social media and digital platforms only</option>
              <option value="commercial">Commercial use including advertising and print</option>
              <option value="editorial">Editorial and press use only</option>
              <option value="internal">Internal business use only</option>
              <option value="unlimited">Unlimited usage across all media</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Exclusivity</label>
            <select name="exclusivity" value={form.exclusivity} onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors">
              <option value="non_exclusive">Non-exclusive — creative may work with others</option>
              <option value="exclusive_30">Exclusive for 30 days post-delivery</option>
              <option value="exclusive_90">Exclusive for 90 days post-delivery</option>
              <option value="exclusive_1yr">Exclusive for 1 year post-delivery</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="credit_required" checked={form.credit_required} onChange={handleChange}
                className="w-4 h-4 accent-gold" />
              <span className="text-sm text-text-muted">
                <strong className="text-text">Credit required</strong> — client must credit the creative professional when using the work
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="portfolio_rights" checked={form.portfolio_rights} onChange={handleChange}
                className="w-4 h-4 accent-gold" />
              <span className="text-sm text-text-muted">
                <strong className="text-text">Portfolio rights</strong> — creative may display this work in their portfolio and promotional materials
              </span>
            </label>
          </div>
        </div>

        {/* Minor clause */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Badge variant="muted">Part 4</Badge> Minor Involvement
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="minor_involved" checked={form.minor_involved} onChange={handleChange}
              className="w-4 h-4 accent-gold" />
            <span className="text-sm text-text-muted">
              <strong className="text-text">This project involves a Minor (under 18)</strong>
            </span>
          </label>
          {form.minor_involved && (
            <div className="space-y-3">
              <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg p-3">
                <p className="text-xs text-amber-400/90 flex items-start gap-2">
                  <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                  A parent or legal guardian must sign this agreement. The guardian must be physically present at the shoot location for the entire session.
                </p>
              </div>
              <Input
                label="Parent / Guardian Full Legal Name"
                name="guardian_name"
                placeholder="Guardian's full name"
                value={form.guardian_name}
                onChange={handleChange}
                required={form.minor_involved}
              />
            </div>
          )}
        </div>

        {/* IP clause — always present */}
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <FileText size={14} className="text-gold" /> Intellectual Property — Standard Clause
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            The creative professional retains full copyright ownership of all work produced. The client receives a limited license as defined above. No full transfer of intellectual property occurs unless explicitly stated and additionally compensated in a separate written buyout agreement. All work delivered remains the intellectual property of the original creator. The client may not sublicense, sell, or transfer the work to third parties without written consent from the creative professional.
          </p>
        </div>

        {/* Signatures */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Badge variant="muted">Part 5</Badge> Signatures
          </h2>
          <p className="text-xs text-text-faint">By typing your full legal name below, you confirm you have read, understood, and agree to all terms in this agreement.</p>

          <Input
            label="Creative Professional — Type your full legal name to sign"
            name="creative_signature"
            placeholder="Your full legal name"
            value={form.creative_signature}
            onChange={handleChange}
            required
          />
          <Input
            label="Client / Brand Representative — Type your full legal name to sign"
            name="client_signature"
            placeholder="Client's full legal name"
            value={form.client_signature}
            onChange={handleChange}
            required
          />
          {form.minor_involved && form.guardian_name && (
            <Input
              label={`Parent/Guardian (${form.guardian_name}) — Type full name to sign`}
              name="guardian_signature"
              placeholder="Guardian's full legal name"
              onChange={handleChange}
              required
            />
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange}
              className="w-4 h-4 accent-gold mt-0.5 flex-shrink-0" required />
            <span className="text-xs text-text-muted leading-relaxed">
              I confirm that all information is accurate, I am authorized to enter this agreement, and I agree to be legally bound by its terms. I understand this constitutes a binding legal agreement.
            </span>
          </label>
        </div>

        <Button type="submit" loading={loading} className="w-full glow-gold" size="lg" disabled={!form.agreed}>
          <FileText size={18} />
          Sign & Finalize Agreement
        </Button>

        <p className="text-xs text-text-faint text-center">
          This agreement is stored securely in your Dotshot account. Both parties receive a confirmation copy.
        </p>
      </form>
    </div>
  )
}
