import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Shield } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 pt-32 pb-20 w-full">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={28} className="text-gold" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        <p className="text-text-muted text-sm mb-10">Last updated: May 2026 · Effective immediately</p>

        <div className="prose-dotshot space-y-10 text-sm text-text-muted leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-text mb-3">1. Who We Are</h2>
            <p>Dotshot ("we," "us," or "our") is a creative professional networking platform that connects photographers, videographers, makeup artists, hairstylists, models, stylists, art directors, and other creative professionals for collaboration, paid campaigns, and marketplace transactions. By using Dotshot, you agree to these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">2. Age Requirements & Minor Protection</h2>
            <p className="mb-3">Dotshot takes the safety of young creators extremely seriously.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text">You must be at least 13 years old</strong> to create an account. Users under 13 are not permitted.</li>
              <li><strong className="text-text">Users ages 13–17 ("Minors") must have verifiable parental or guardian consent</strong> to use the platform, participate in campaigns, or conduct any paid transactions.</li>
              <li>Minors may only participate in campaigns where a parent or legal guardian has reviewed and approved the campaign details, contract terms, and location.</li>
              <li>No adult user may initiate private, off-platform communication with a Minor through Dotshot's messaging system or any other means for non-professional purposes.</li>
              <li>All gig locations involving Minors must be public, professional venues (studios, event spaces, commercial locations). Private residences are prohibited for campaigns involving Minors unless a parent/guardian is physically present.</li>
              <li>Dotshot reserves the right to immediately terminate accounts found to be targeting, grooming, or inappropriately contacting Minors in any way.</li>
              <li>Violations involving Minors will be reported to appropriate law enforcement authorities without exception.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">3. Account Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must provide accurate, truthful information in your profile and listings.</li>
              <li>One person may not operate multiple accounts to manipulate ratings, reviews, or campaign applications.</li>
              <li>You may not share your account with others or allow others to use your identity on the platform.</li>
              <li>You must promptly notify us of any unauthorized use of your account at support@dotshot.app.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">4. Gig & Campaign Safety</h2>
            <p className="mb-3">Your safety at every gig is a priority. By participating in campaigns or collaborations through Dotshot, you agree to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Always share your gig location and schedule with a trusted person before attending any shoot or session.</li>
              <li>Use Dotshot's built-in check-in/check-out safety feature (available for Pro and Elite members) to log your arrival and departure at all gig locations.</li>
              <li>Meet for the first time in public, well-lit, professional locations.</li>
              <li>Never attend a private location for a first meeting with a new collaborator.</li>
              <li>Report any unsafe, uncomfortable, or threatening behavior immediately through the in-app reporting system.</li>
              <li>Campaign posters must accurately represent the nature, location, duration, and compensation of all work.</li>
              <li>Misrepresenting campaign details to lure creators to a location under false pretenses is a permanent ban offense and will be reported to law enforcement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">5. Intellectual Property Rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text">You own your work.</strong> All creative work you produce — photos, videos, designs — belongs to you unless explicitly transferred in a signed Dotshot contract.</li>
              <li>By uploading portfolio content to Dotshot, you grant us a limited, non-exclusive, royalty-free license to display your work on the platform and in promotional materials for Dotshot only.</li>
              <li>You may revoke this display license at any time by removing content from your profile.</li>
              <li>Campaign clients may not use your creative work beyond the scope defined in the signed contract without additional compensation and your explicit written consent.</li>
              <li>All contracts created through Dotshot automatically include an IP ownership clause. Review all contracts carefully before signing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">6. Payments & Transactions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All paid campaign transactions are processed through Stripe. Dotshot does not store your payment card details.</li>
              <li>Campaign payments are held in escrow until work is marked complete by both parties.</li>
              <li>Dotshot charges a platform fee on paid campaigns (see current rate on the pricing page).</li>
              <li>Marketplace transactions are between buyers and sellers directly. Dotshot is not responsible for the condition, accuracy, or delivery of marketplace items.</li>
              <li>Disputes must be submitted within 7 days of a transaction completing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">7. Prohibited Conduct</h2>
            <p className="mb-3">The following are strictly prohibited and will result in immediate account termination and potential legal action:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Any sexual, romantic, or inappropriate communication directed at Minors</li>
              <li>Harassment, intimidation, or threats of any kind</li>
              <li>Creating fake profiles, fake reviews, or fraudulent campaign postings</li>
              <li>Soliciting or sharing explicit content of any kind</li>
              <li>Using the platform to arrange meetings under false pretenses</li>
              <li>Discriminating against users based on race, gender, age, sexuality, disability, religion, or national origin</li>
              <li>Scraping, copying, or redistributing user data without consent</li>
              <li>Attempting to circumvent platform payments by taking transactions off-platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">8. Reporting & Enforcement</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Every profile and campaign has a "Report" button. Use it. We review all reports within 24 hours.</li>
              <li>Violations involving safety or Minors are escalated immediately — not in 24 hours.</li>
              <li>Dotshot cooperates fully with law enforcement investigations. We will provide account data, messages, and activity logs when required by valid legal process.</li>
              <li>Repeat policy violations result in permanent bans. Severe violations (especially those involving Minors) are reported to authorities regardless of whether the victim requests it.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">9. Termination</h2>
            <p>We reserve the right to suspend or terminate any account at any time for violations of these Terms. You may delete your account at any time from Settings. Upon deletion, your public content is removed within 30 days. Some data may be retained for legal compliance purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">10. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. We will notify you by email and in-app notification before major changes take effect. Continued use of Dotshot after changes are posted constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">11. Contact</h2>
            <p>Questions about these Terms? Contact us at <a href="mailto:legal@dotshot.app" className="text-gold hover:underline">legal@dotshot.app</a> or visit our <Link href="/contact" className="text-gold hover:underline">Contact page</Link>.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  )
}
