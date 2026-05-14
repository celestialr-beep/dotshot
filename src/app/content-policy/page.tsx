import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AlertTriangle } from 'lucide-react'

export default function ContentPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 pt-32 pb-20 w-full">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle size={28} className="text-gold" />
          <h1 className="text-3xl font-bold">Content Policy</h1>
        </div>
        <p className="text-text-muted text-sm mb-10">Last updated: May 2026 · Applies to all users and all content on Dotshot</p>

        <div className="space-y-10 text-sm text-text-muted leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-text mb-3">Our Standard</h2>
            <p>Dotshot is a professional creative platform. All content — profiles, portfolio images, campaign listings, forum posts, marketplace listings, and messages — must meet professional standards. We are building a community where photographers, videographers, artists, and creatives of all backgrounds can thrive safely.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">What Is Always Prohibited</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text">Sexual content of any kind involving Minors (under 18).</strong> Zero tolerance. Immediately reported to the National Center for Missing & Exploited Children (NCMEC) and law enforcement.</li>
              <li>Explicit sexual content of any kind (Dotshot is not an adult platform)</li>
              <li>Hate speech targeting race, gender, religion, sexuality, age, disability, or national origin</li>
              <li>Harassment, threats, or intimidation directed at any user</li>
              <li>Content that impersonates another person or brand</li>
              <li>Spam, fake reviews, or artificial engagement manipulation</li>
              <li>Violent or graphic content not related to professional creative work</li>
              <li>Content that promotes illegal activity</li>
              <li>Watermarked or plagiarized work posted as your own</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">Portfolio & Profile Standards</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Portfolio images must represent your own work or work you were directly involved in creating.</li>
              <li>Images must be properly credited if they involve models or other collaborators who have given consent.</li>
              <li>Artistic nudity is permitted in a professional context (fine art, editorial) where all subjects are adults and have provided consent. No explicit or pornographic content.</li>
              <li>Profile photos must show the account holder — no cartoon avatars or logos as primary profile photos for individual accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">Campaign & Collab Post Standards</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All campaign and collab posts must accurately represent the work, location, compensation, and expectations.</li>
              <li>Campaigns that include Minors must clearly state this and include parental consent requirements.</li>
              <li>No campaigns may request activities that could endanger a creative professional&apos;s safety.</li>
              <li>Campaigns may not offer &quot;exposure only&quot; in place of fair compensation for Pro/Elite-tier posted campaigns.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">Marketplace Standards</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All items must be real, accurately described, and in the condition stated.</li>
              <li>Photos must show the actual item being sold, not stock photos.</li>
              <li>No counterfeit, stolen, or illegally modified equipment.</li>
              <li>Items must be relevant to creative professional use.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">How to Report</h2>
            <p className="mb-3">Every profile, post, campaign, and listing has a Report button. Use it. Reports are reviewed within 24 hours. Safety violations are reviewed immediately.</p>
            <p>You can also email <a href="mailto:safety@dotshot.app" className="text-gold hover:underline">safety@dotshot.app</a> for urgent safety concerns.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-3">Enforcement</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text">Warning:</strong> First-time minor violations</li>
              <li><strong className="text-text">Content removal:</strong> Policy-violating content is removed immediately</li>
              <li><strong className="text-text">Temporary suspension:</strong> Repeated violations or moderate offenses</li>
              <li><strong className="text-text">Permanent ban:</strong> Severe violations, targeting of Minors, or repeated offenses</li>
              <li><strong className="text-text">Law enforcement referral:</strong> Any content or behavior involving Minors sexually, or credible threats of violence</li>
            </ul>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  )
}
