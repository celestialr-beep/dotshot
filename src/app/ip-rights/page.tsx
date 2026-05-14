import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FileText } from 'lucide-react'

export default function IPRightsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 pt-32 pb-20 w-full">
        <div className="flex items-center gap-3 mb-2">
          <FileText size={28} className="text-gold" />
          <h1 className="text-3xl font-bold">IP Rights & Creator Ownership</h1>
        </div>
        <p className="text-text-muted text-sm mb-10">Last updated: May 2026 · Your work belongs to you.</p>

        <div className="space-y-10 text-sm text-text-muted leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-text mb-3">The Core Principle</h2>
            <p className="text-base text-text font-medium mb-3">You created it. You own it.</p>
            <p>Dotshot is built on a creator-first foundation. Unlike many platforms that claim broad licenses over your work, we take only the minimum rights necessary to display your content on the platform — and nothing more.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">What You Own</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All photos, videos, designs, and creative work you produce — before, during, and after any campaign on Dotshot</li>
              <li>Your creative process, style, techniques, and methods</li>
              <li>Your brand, name, likeness, and professional identity</li>
              <li>The right to display, license, sell, or withhold your work at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">The Limited License You Give Dotshot</h2>
            <p className="mb-3">By uploading content to your Dotshot profile, you grant Dotshot a:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text">Non-exclusive</strong> — we cannot prevent you from using your own work anywhere else</li>
              <li><strong className="text-text">Royalty-free</strong> — we pay you nothing extra to display it, but we also charge you nothing</li>
              <li><strong className="text-text">Limited</strong> — only for displaying on Dotshot and promoting Dotshot with proper credit to you</li>
              <li><strong className="text-text">Revocable</strong> — remove your content at any time and this license ends</li>
            </ul>
            <p className="mt-3">We will <strong className="text-text">never</strong> license your work to third parties, use it in ads without your consent, or claim ownership of anything you create.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">Campaign Contracts & IP Transfer</h2>
            <p className="mb-3">When you complete a paid campaign on Dotshot:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The campaign contract defines exactly what rights the client receives</li>
              <li>By default, clients receive a <strong className="text-text">usage license</strong> — not full ownership — unless a full buyout is explicitly contracted and compensated</li>
              <li>You retain the right to display campaign work in your portfolio unless a confidentiality clause is agreed upon in the contract</li>
              <li>All Dotshot contracts include an IP clause. Read it before signing.</li>
              <li>Contracts cannot be altered after both parties sign. Disputes are handled through Dotshot&apos;s resolution process.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">Protecting Your Work</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>If you see your work posted by another user without permission, use the Report button immediately.</li>
              <li>For DMCA takedown requests, email <a href="mailto:legal@dotshot.app" className="text-gold hover:underline">legal@dotshot.app</a> with proof of ownership.</li>
              <li>We respond to DMCA notices within 48 hours and remove infringing content promptly.</li>
              <li>Repeat copyright infringers are permanently banned from the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">Model & Subject Rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Photographers and videographers are responsible for obtaining proper model releases from all subjects.</li>
              <li>Dotshot contract templates include model release sections for campaigns involving on-camera talent.</li>
              <li>Uploading images of identifiable people without their consent is a violation of our Content Policy and may constitute a legal violation.</li>
              <li>For campaigns involving Minors, a parent or legal guardian must sign all release forms.</li>
            </ul>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  )
}
