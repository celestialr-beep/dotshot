import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Lock } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 pt-32 pb-20 w-full">
        <div className="flex items-center gap-3 mb-2">
          <Lock size={28} className="text-gold" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-text-muted text-sm mb-10">Last updated: May 2026 · We do not sell your data. Ever.</p>

        <div className="space-y-10 text-sm text-text-muted leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-text mb-3">1. What We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text">Account info:</strong> Name, email, username, role, location, and profile details you provide.</li>
              <li><strong className="text-text">Content:</strong> Portfolio images, campaign posts, forum posts, marketplace listings, and messages.</li>
              <li><strong className="text-text">Activity:</strong> Pages visited, features used, campaign applications, and collaborations completed.</li>
              <li><strong className="text-text">Device info:</strong> IP address, browser type, and device type for security purposes.</li>
              <li><strong className="text-text">Payment info:</strong> Processed by Stripe. We never see or store your card number.</li>
              <li><strong className="text-text">Location data (optional):</strong> If you use our gig check-in safety feature, we collect your GPS location only during active gig sessions with your explicit permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To operate and improve the Dotshot platform</li>
              <li>To connect you with relevant campaigns and collaborators in your area</li>
              <li>To process payments and hold escrow for campaign transactions</li>
              <li>To send you notifications about activity relevant to your account</li>
              <li>To enforce our Terms of Service and protect user safety</li>
              <li>To comply with legal obligations and law enforcement requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">3. Children&apos;s Privacy (COPPA)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We do not knowingly collect personal information from children under 13.</li>
              <li>For users ages 13–17, we collect only the minimum data necessary and do not use it for advertising.</li>
              <li>Parents or guardians of Minor users may request to review, modify, or delete their child&apos;s data by emailing <a href="mailto:privacy@dotshot.app" className="text-gold hover:underline">privacy@dotshot.app</a>.</li>
              <li>We will never display Minor users&apos; location data publicly.</li>
              <li>Minor users&apos; profile pages do not display their exact age — only their work and role.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">4. What We Never Do</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text">We never sell your data</strong> to third parties, advertisers, or data brokers.</li>
              <li>We never share your private messages with other users.</li>
              <li>We never share your exact location with other users without your explicit opt-in.</li>
              <li>We never use your portfolio content to train AI models without your explicit consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">5. Data Sharing</h2>
            <p className="mb-3">We only share your data with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text">Supabase</strong> — our database and authentication provider</li>
              <li><strong className="text-text">Stripe</strong> — for payment processing</li>
              <li><strong className="text-text">Vercel</strong> — for hosting and delivery</li>
              <li><strong className="text-text">Law enforcement</strong> — when required by valid legal process or when user safety is at risk</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">6. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text">Access:</strong> Request a copy of all data we have about you.</li>
              <li><strong className="text-text">Correction:</strong> Update your profile information at any time in Settings.</li>
              <li><strong className="text-text">Deletion:</strong> Delete your account from Settings. Data is purged within 30 days.</li>
              <li><strong className="text-text">Portability:</strong> Export your portfolio and profile data in JSON format.</li>
              <li><strong className="text-text">Objection:</strong> Opt out of non-essential communications at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">7. Security</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
              <li>Passwords are never stored — we use secure token-based authentication.</li>
              <li>Row-Level Security ensures users can only access data they are authorized to see.</li>
              <li>We conduct regular security reviews and promptly address vulnerabilities.</li>
              <li>Suspicious login activity triggers automatic alerts and temporary account locks.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">8. Contact</h2>
            <p>For privacy questions or data requests: <a href="mailto:privacy@dotshot.app" className="text-gold hover:underline">privacy@dotshot.app</a></p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  )
}
