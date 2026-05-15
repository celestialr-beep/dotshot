# DOTSHOT — Master Project Manual
### Build Status · Sprint Plan · Kanban · Feature Roadmap · User Stories
*Generated May 2026 — Living Document*

---

## THE ONE METRIC THAT RULES EVERYTHING

> **Heartbeat Metric:** Repeated Successful Collaborations Between Strangers.
> Strangers connect on Dotshot → collaborate on something real → rate it positively → come back and do it again → refer someone else.
> Every sprint decision is filtered through this question: *Does this increase successful collaborations?*

---

## PART 1 — WHAT'S BEEN BUILT ✅

### Platform (Live at dotshot.vercel.app)
| Feature | Status | Notes |
|---|---|---|
| App deployed on Vercel | ✅ LIVE | Auto-deploys from GitHub |
| Supabase database connected | ✅ LIVE | Schema running |
| Email/password signup + login | ✅ LIVE | Real Supabase auth |
| Profile auto-created on signup | ✅ LIVE | Trigger handles it |
| Dashboard with real user name | ✅ LIVE | Time-based greeting |
| Sidebar with real name/avatar | ✅ LIVE | Pulls from Supabase |
| Sign out | ✅ LIVE | Works |
| My Profile → real profile | ✅ LIVE | Links to /profile/[username] |
| Profile page with real data | ✅ LIVE | Edit button for owner |
| Forgot/reset password | ✅ LIVE | Supabase email reset |
| Campaigns page with filters | ✅ LIVE | Industry tabs + role chips |
| Campaign creation form | ✅ LIVE | Saves to Supabase |
| Marketplace listing with photos | ✅ LIVE | Needs Storage bucket |
| "Pass It Forward" listings | ✅ LIVE | Free gear donations |
| Gig safety check-in system | ✅ LIVE | Timer + panic button |
| Media release & agreement form | ✅ LIVE | IP clause included |
| Terms of Service | ✅ LIVE | Minor protection + safety |
| Privacy Policy | ✅ LIVE | COPPA compliant |
| Content Policy | ✅ LIVE | CSAM reporting built in |
| IP Rights page | ✅ LIVE | Creator owns their work |
| 35 roles across 9 industries | ✅ LIVE | Full expansion done |
| Messaging UI | ✅ BUILT | Mock data — not live yet |
| Google/Facebook OAuth buttons | ✅ BUILT | Needs OAuth app setup |
| Safety schema SQL | ✅ WRITTEN | Needs to be run in Supabase |

---

## PART 2 — WHAT THE PDFs IDENTIFIED AS MISSING ❌

Cross-referenced against all three documents (Founder Guide · Ambassador OS · Brand Workbook).

### 🔴 CRITICAL — Blocking (Must do before any public users)

| Item | Source | Why It Blocks |
|---|---|---|
| **Form LLC / C-Corp** | Founder Guide Pt.1 | No legal entity = personal liability for all transactions |
| **IP Assignment agreements** | Founder Guide Pt.2 | Every contributor (Claude included) must be documented |
| **File trademark** for chosen brand name | Brand Workbook Pt.1 | Copycats move fast once you launch publicly |
| **Choose master brand name** | Brand Workbook Pt.1 | Everything (domain, handles, trademark) depends on this |
| **Register social handles** | Brand Workbook Pt.1 | Must be secured before any public mention |
| **DMCA agent registration** at Copyright.gov | Founder Guide Pt.1 | $6/year, required for safe harbor protection |
| **Run safety SQL** in Supabase | Project status | Panic button data won't save without this |
| **Create dotshot-media storage bucket** | Project status | Photo uploads won't work without this |
| **Report buttons** on every profile/post/listing | Founder Guide Pt.5 | Safety requirement, not a feature |
| **Admin moderation dashboard** | Ambassador OS Sec.12 | No way to manage users/reports without this |

### 🟡 HIGH — Required at Launch

| Item | Source | Notes |
|---|---|---|
| **Wire real messages** (Supabase realtime) | Project roadmap | Currently mock data |
| **Stripe subscriptions** Pro $6.99 + Elite $14.99 | Brand Workbook Pt.4 | Primary revenue stream |
| **Campaign transaction fee** (10% via Stripe) | Brand Workbook Pt.4 | Primary revenue stream |
| **Marketplace commission** tracking (15-20%) | Brand Workbook Pt.4 | Phase 1 revenue |
| **Referral system** (unique links + Pro credit) | Founder Guide Pt.18 | 20% of signups from referrals by Month 3 |
| **Onboarding improvements** | Ambassador OS Sec.10 | Style tags, personalized feed, "3 things to do" tooltip |
| **Featured Collaborations carousel** | Founder Guide Pt.12 | Dead app prevention |
| **Forum pre-seeding** (10 collab templates) | Ambassador OS Sec.11 | Empty board kills new users |
| **Settings page** | Project status | Currently linked but not built |
| **Business email** | Founder Guide Pt.7 | After name change |
| **KPI tracking dashboard** | Founder Guide Pt.4 | Start tracking from Day 1 |

### 🟢 IMPORTANT — Before Month 3

| Item | Source | Notes |
|---|---|---|
| **Ambassador program** (5 City Connectors in Orlando) | Founder Guide Pt.9 | Recruit personally before public launch |
| **Google OAuth** setup | Project roadmap | Google Cloud Console → Supabase |
| **Facebook OAuth** setup | Project roadmap | Facebook Dev Console → Supabase |
| **User verification badge** (Dotshot Verified) | Founder Guide Pt.14 | Trust signal |
| **Profile boost** optional ($4.99) | Ambassador OS Sec.7 | First monetization test in Week 4 |
| **Brand language** rename in UI | Founder Guide Pt.14 | Crown & Capture, Collab Call, etc. |
| **Mobile bottom navigation** | Founder Guide Pt.15 | Sidebar is hidden on mobile — no nav exists |
| **Data room** (Google Drive structure) | Founder Guide Pt.3 | Investor-ready organization |
| **Long-term vision document** | Founder Guide Pt.20 | North star doc in founder's own voice |
| **Resend email notifications** | Project roadmap | Welcome emails + overdue gig alerts |

### 🔵 PHASE 2 — Months 3–6

| Item | Source | Notes |
|---|---|---|
| **Escrow system** for paid campaigns | Founder Guide Pt.5 | Holds 30% until delivery confirmed |
| **Rating/review system** after collabs | Ambassador OS Sec.8 | Core trust infrastructure |
| **B2B brand tools** (recruiting dashboards) | Brand Workbook Pt.4 | Very high revenue potential |
| **Sponsored Opportunity** ad format | Brand Workbook Pt.5 | Phase 2 ad type |
| **Featured Business Profile** for salons/studios | Brand Workbook Pt.5 | Phase 2 revenue |
| **Creator education** (courses/masterclasses) | Brand Workbook Pt.4 | $29–199 each |
| **Events & experiences** ticketing | Brand Workbook Pt.4 | Local networking events |
| **Portfolio reverse image check** (TinEye API) | Founder Guide Pt.5 | Anti-theft |
| **PostHog or Mixpanel analytics** | Founder Guide Pt.4 | Behavioral event tracking |
| **Supabase analytics** wired to admin | Founder Guide Pt.4 | Database-level KPIs |

---

## PART 3 — NAME CANDIDATES (From Brand Workbook)

The workbook scored 12 name candidates across 5 dimensions (scale, gender neutrality, tech readiness, cultural resonance, global pronunciation). Scores out of 25:

| Name | Origin | Score | Notes |
|---|---|---|---|
| **Kizuna** | Japanese | 23 | Means "bond/connection" — perfect meaning |
| **Limyra** | Haitian | 23 | Haitian roots, strong all-around |
| **Xingora** | Chinese | 23 | Invented, very tech-forward |
| **Orion** | Hebrew | 23 | Strong, universal, already known |
| **Keshera** | Hebrew | 22 | Means "connection" |
| **Kreyora** | Haitian | 22 | Haitian Creole roots |
| Lianova | Fusion | 22 | Strong but less distinctive |
| Zohara | Hebrew | 20 | Too feminine-leaning |
| Renka | Japanese | 20 | Less tech-ready |

**Top 3 Recommended:** Kizuna, Limyra, Orion  
**Action:** Test these with 20+ real creators → check domains + USPTO → file trademark immediately

---

## PART 4 — BRAND LANGUAGE SYSTEM (Apply to UI)

Replace current generic terms with Dotshot's own vocabulary:

| Current UI Term | Dotshot Brand Term | Where to Apply |
|---|---|---|
| "Paid campaign" | **Crown & Capture Session** | Campaigns page, campaign creation |
| "Free collab post" | **Collab Call** | Forum page header, post button |
| "Your connections" | **Your Circle** | Network/profile page |
| "Top collaborators" | **Top Crew** | Profile page section |
| "Verified profile" | **Dotshot Verified** | Profile badges |
| "Local meetup / event" | **Dotshot Drop** | Events/community features |
| "Featured creator" | **The Spotlight** | Dashboard featured section |
| "Buy/sell gear" | **Second Campaign** | Marketplace page header |
| "Platform quality standard" | **The Dotshot Standard** | Onboarding, community guidelines |

---

## PART 5 — REVENUE STREAMS PHASED

From Brand Workbook Part 4:

### Phase 1 — Build Now (Months 0–3)
1. **Campaign Transaction Fees** — 10% of paid Crown & Capture bookings
2. **Subscription Tiers** — Pro $6.99/mo · Elite $14.99/mo
3. **Marketplace Commission** — 15–20% on gear sales
4. **Local Events** — Networking events with tickets ($25–200)

### Phase 2 — Build at Month 3–6
5. **B2B Brand & Agency Tools** — Brand dashboards and talent sourcing
6. **Creator Education** — Courses and certifications ($29–199 each)
7. **Sponsored Opportunities** — Brands post labeled paid campaigns
8. **Escrow & Contract Services**
9. **Featured Business Profiles**

### Phase 3 — Build at Month 6–12
10. **Premium Editing Suite** — CapCut-style at $4.99/mo
11. **Ethical AI Tools** — AI matching + portfolio optimization $9.99/mo
12. **Community Memberships** — Mastermind circles $29–99/mo
13. **Curated Native Advertising**

### Revenue Never Build
- ❌ Hard paywalls on messaging
- ❌ Algorithmic visibility suppression
- ❌ Selling creator data
- ❌ Flat monthly ambassador retainers

---

## PART 6 — SPRINT PLAN

### ✅ Sprint 0 (Complete) — Foundation
*Story: "As a creative, I can sign up and get to a real dashboard."*
- Platform deployed live
- Real auth working
- Profile auto-created
- Dashboard shows real user data
- All nav works

### 🏃 Sprint 1 (Now) — Safety + Storage + Payments
*Story: "As a creative, I can check in safely to gigs and pay for premium access."*

**Immediate (This Week):**
- [ ] Run `supabase-safety-schema.sql` in Supabase
- [ ] Create `dotshot-media` Storage bucket (Public)
- [ ] Build **Settings page** (`/settings` — currently broken link)
- [ ] Add **Report button** to profiles, posts, and listings
- [ ] Wire **Stripe** — Pro $6.99/mo + Elite $14.99/mo tiers
- [ ] Build **admin moderation dashboard** (`/admin`)

**This Week — UX:**
- [ ] Add **mobile bottom navigation bar** (sidebar is hidden on mobile — users have zero navigation on phones)
- [ ] Improve onboarding: add **style tags step** + **"3 things to do first" tooltip**

### 🏃 Sprint 2 (Next) — Messaging + Referrals + KPIs
*Story: "As a creative, I can message collaborators in real time and invite my network."*
- [ ] Wire **messages** to Supabase realtime (replace mock data)
- [ ] Build **referral system** — unique links, 30-day Pro credit per conversion
- [ ] Build **KPI admin dashboard** — 7 metrics from Ambassador OS
- [ ] Add **Featured Collaborations carousel** to dashboard
- [ ] **Forum seeding** — post the 10 collaboration templates from Ambassador OS

### 🏃 Sprint 3 — Brand Language + Verification + Google/Facebook OAuth
*Story: "As a creative, I can log in with Google and see my platform speak my professional language."*
- [ ] **Rename UI terms** to brand language (Collab Calls, Crown & Capture, etc.)
- [ ] **Google OAuth** — Google Cloud Console setup
- [ ] **Facebook OAuth** — Facebook Developer Console setup
- [ ] **Dotshot Verified badge** system
- [ ] **Profile boost** feature ($4.99 optional)
- [ ] **Resend** email integration (welcome emails + safety alerts)

### 🏃 Sprint 4 — Ambassador Program (Operational, Not Code)
*Story: "As a City Connector, I have a dedicated page, a badge, and clear tools to grow my city."*
- [ ] Identify 5 City Connectors in Orlando (founder outreach using script from Ambassador OS Sec. 6)
- [ ] Set up private ambassador group (WhatsApp/Discord)
- [ ] Build **Ambassador portal** in app (badge display, referral tracker, payout status)
- [ ] **First Collaboration Day** — host real event in Orlando

### 🏃 Sprint 5 — Escrow + Ratings + B2B Tier
*Story: "As a brand, I can post a paid campaign and trust that the creator delivers before payment releases."*
- [ ] **Rating/review system** after project completion
- [ ] **Escrow** logic (30% held until both parties confirm delivery)
- [ ] **B2B tools** — brand dashboard for campaign management

---

## PART 7 — KANBAN BOARD

### 🔴 BLOCKED (Needs Human Action — Not Code)
| Task | What's Needed |
|---|---|
| Run safety SQL | Go to Supabase → SQL Editor → paste file → Run |
| Create storage bucket | Supabase → Storage → New bucket → `dotshot-media` → Public |
| Choose brand name | Pick from top 3 (Kizuna, Limyra, Orion) |
| File trademark | USPTO + attorney ~$500–1K |
| Form LLC | Delaware LLC or Florida LLC |
| Set up Google OAuth | Google Cloud Console |
| Set up Facebook OAuth | Facebook Developer Console |

### 🟡 IN PROGRESS / NEXT UP
| Task | Sprint |
|---|---|
| Settings page | Sprint 1 |
| Report buttons | Sprint 1 |
| Admin dashboard | Sprint 1 |
| Stripe subscriptions | Sprint 1 |
| Mobile navigation | Sprint 1 |
| Real messages | Sprint 2 |
| Referral system | Sprint 2 |
| KPI dashboard | Sprint 2 |
| Featured Collaborations carousel | Sprint 2 |
| Forum seeding | Sprint 2 |

### ✅ DONE
| Task | Completed |
|---|---|
| Live deployment | ✅ |
| Real auth (email/password) | ✅ |
| Profile creation trigger | ✅ |
| Dashboard with real data | ✅ |
| Campaign page + filters | ✅ |
| Campaign creation form | ✅ |
| Marketplace + photo upload UI | ✅ |
| Gig safety + panic button | ✅ |
| Media agreement form | ✅ |
| Terms / Privacy / Content Policy / IP Rights | ✅ |
| Forgot/reset password | ✅ |
| 35 roles across 9 industries | ✅ |

---

## PART 8 — KPI TARGETS (Track Weekly from Day 1)

From Founder Guide Pt.4 + Ambassador OS Sec.8:

| Metric | Month 1 | Month 3 | Month 6 | Red Flag |
|---|---|---|---|---|
| Total Signups | 50+ | 500+ | 2,000+ | — |
| Activation Rate | 40–50% | 55–65% | 65%+ | Below 30% |
| Collaborations/week | 5+ | 20+ | — | Below 2 |
| Time to First Collab | < 7 days | < 3 days | — | Over 14 days |
| 7-Day Retention | 40% | 50% | — | Below 25% |
| 30-Day Retention | 25% | 35% | — | Below 15% |
| Free→Pro Conversion | — | 8% | 15% | — |
| Monthly Churn | < 10% | < 7% | < 5% | — |
| Revenue Signals | 1–3 signals | $2,500 MRR | $22,500 MRR | Zero at 30 days |

**Tools to use (all free):** Google Sheets (manual, Months 0–3) + PostHog free tier + Supabase built-in analytics

---

## PART 9 — AMBASSADOR PROGRAM QUICK GUIDE

*Full detail in DOTSHOT_Ambassador_Launch_Operating_System.pdf*

### 3-Tier Structure
| Tier | Who | What They Do | What They Get |
|---|---|---|---|
| City Connector | Top 2–3 creators per city, known + trusted locally | Host meetups, recruit network, onboard new users | Free Elite sub + City Connector badge + $50–100/event stipend |
| Niche Captain | Top creator in specific role per market | Category-specific opportunities, mentor emerging creators | Free Pro sub + featured placement + referral bonuses |
| Campus Ambassador | Students at photography/beauty/film schools | Recruit classmates, host workshops | Free Pro sub + school-specific page + featured portfolio |

### Compensation Trigger (Pay Only on Real Outcomes)
- Verified signup (profile + portfolio): $3–5
- Activated creator (messages or joins collab in 7 days): $8–15
- First collaboration created: +$10 bonus
- First booking completed: +$20 bonus
- 30-day retained user: +$5 bonus
- Collaboration facilitated: $10–25
- Both parties complete project: +$15 bonus

**Monthly cap:** $300–500/mo founding cohort

### Outreach Script (Word-for-word from Ambassador OS Sec. 6)
> "Hey [Name], I came across your work [specific reference] and wanted to reach out. I'm building a collaboration ecosystem for creatives in Orlando — a more structured way to find reliable collaborators, organize shoots, and grow professionally beyond just Instagram DMs. I'm inviting a small, intentional group of founding creators to help shape it from the inside... No cost. No commitment right now. Would you be open to a 15-minute call this week?"

---

## PART 10 — 30-DAY CITY LAUNCH (ORLANDO)

From Ambassador OS Sec. 7:

| Week | Focus | Target |
|---|---|---|
| Week 1 | Seed the network — recruit 5–10 ambassadors, pre-seed forum | Ambassador group active, forum has 10+ posts |
| Week 2 | First Collaboration Day — real event, document it | 5–15 creators, real work produced |
| Week 3 | Expand to 50–100 users, second Collaboration Day | 15–25 collabs initiated |
| Week 4 | First monetization test — boosts, subscriptions, business outreach | 1+ revenue signal, 30-day KPI review |

**Month 1 Success Condition:** 50–100 active users · 20+ real collabs completed · 5–10 ambassador-facilitated projects · At least 1 monetization signal

---

## PART 11 — LEGAL CHECKLIST

From Founder Guide Pt.1–2:

| Item | Priority | Est. Cost | Status |
|---|---|---|---|
| Form LLC (Delaware or Florida) | CRITICAL | $90–300 + $500–1K attorney | OPEN |
| Operating Agreement | CRITICAL | $500–1.5K | OPEN |
| IP Assignment from all developers | CRITICAL | $200–500 | OPEN |
| Trademark filing (Classes 9, 42, 45) | CRITICAL | $500–1K | OPEN |
| DMCA Agent at Copyright.gov | CRITICAL | $6/year | OPEN |
| Terms of Service | ✅ DONE | $0 (self-drafted) | LIVE |
| Privacy Policy | ✅ DONE | $0 (self-drafted) | LIVE |
| Community Guidelines | ✅ DONE | $0 | LIVE |
| Content Policy | ✅ DONE | $0 | LIVE |
| Platform Liability Disclaimer | ✅ DONE | $0 | LIVE |

**Total remaining pre-launch legal cost estimate: $1,300–$3,800**

---

## PART 12 — DATA ROOM STRUCTURE

Build this in Google Drive. Investors will ask for it:

```
Dotshot Data Room/
├── 01_Company/         LLC filing, EIN, registered agent
├── 02_Legal/           TOS, privacy, IP assignments, DMCA
├── 03_Branding/        Logo SVG/PNG, colors, fonts, brand guide
├── 04_Product/         Screenshots, feature list, tech stack, demo video
├── 05_Financials/      P&L, burn rate, revenue projections
├── 06_Pitch/           Investor deck, one-pager, this manual
├── 07_Market_Research/ TAM/SAM/SOM, competitor map, creator economy data
├── 08_Metrics/         KPI dashboard exports (weekly)
├── 09_Roadmap/         Phase 1-4 plan, technical roadmap
├── 10_Partnerships/    LOIs, partnership tracker, brand outreach
├── 11_Team/            Founder bio, advisor agreements, org chart
└── 12_Press/           Press coverage, testimonials, case studies
```

---

## PART 13 — THE THREE THINGS THAT MATTER THIS WEEK

From Brand Workbook closing page + Founder Guide closing:

1. **Choose the master brand name** (Kizuna, Limyra, or Orion — pick one)
2. **Run the safety SQL + create the storage bucket** (30 minutes, zero cost)
3. **Wire Stripe** — get Pro/Elite subscriptions live

Everything else follows these three.

---

*Last updated: May 2026 | Project: Dotshot (name change pending) | Founder: Ruth Celestin*
*This document should be updated weekly as sprints close.*
