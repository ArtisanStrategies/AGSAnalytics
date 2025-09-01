# Product Requirements Document (PRD) for AGS Analytics

## Document Metadata
- **Product Name**: AGS Analytics
- **Version**: 1.0
- **Date**: August 29, 2025
- **Author**: Grok (xAI Assistant), based on Artisan Strategies' requirements
- **Status**: Draft for Development
- **Purpose**: This PRD outlines the complete specifications for forking and customizing OpenPanel (an open-source analytics platform) into AGS Analytics, a branded, niche-focused tool for optimizing self-serve user flows in SaaS products. It is designed to be imported into an IDE (e.g., VS Code) as a Markdown file (.md) for reference during development. Copy the entire content below into a new file named `AGS_Analytics_PRD.md` in your IDE for syntax highlighting, navigation, and collaboration.
- **Dependencies**: Fork of OpenPanel (GitHub: https://github.com/Openpanel-dev/openpanel, License: AGPL-3.0). Assumes access to Docker, Node.js, pnpm for setup.
- **Revision History**:
  - v1.0: Initial draft incorporating OpenPanel features and custom self-serve enhancements.

## 1. Executive Summary
### 1.1 Product Overview
AGS Analytics is a white-labeled, open-source-derived analytics tool tailored for product growth agencies like Artisan Strategies. It specializes in dissecting and optimizing self-serve user flows—specifically registration (Reg), payment, and activation processes—in B2B SaaS products. By forking OpenPanel, we leverage its core event-tracking and visualization capabilities while adding proprietary customizations for niche use cases.

- **Core Value Proposition**: Provide real-time, actionable insights into user drop-offs and bottlenecks in self-serve funnels, enabling 20-40% improvements in activation rates. Positioned as "Artisan's proprietary analytics engine," it serves as a lead-generation tool: Free/low-cost entry hooks users, funneling them into high-ticket agency services (e.g., $5K+ optimization projects).
- **Differentiation from OpenPanel**:
  - Niche Focus: Pre-built templates and dashboards for Reg/Payment/Activation flows (e.g., Stripe integration hooks, form abandonment tracking).
  - Branding: Full re-skin with Artisan Strategies UI/UX (logos, colors: #007BFF primary blue, #FFFFFF white backgrounds).
  - Upsell Integration: In-app CTAs and email automations linking to Artisan services.
  - Compliance: AGPL-3.0 adherence with public forked repo, but enhanced for agency multi-tenancy (client data isolation).
- **Scope**: MVP includes forked OpenPanel features + 5 custom modules. Excludes: Advanced ML predictions (Phase 2).
- **Out of Scope**: Full mobile app; Enterprise SSO beyond OAuth; Non-SaaS verticals (e.g., e-commerce only if tied to SaaS payments).

### 1.2 Business Objectives (Aligned with Dan Kennedy Principles)
- **Monetization**: Generate $100K+ ARR in Year 1 via tiered subscriptions ($0 Free, $5 Growth, $49 Pro, $199+ Enterprise). 20% conversion from tool users to agency clients.
- **Lead Generation**: Use as a "free sample" to acquire 500+ SaaS leads quarterly, demonstrating ROI (e.g., "Spot 25% Reg drop-off in minutes").
- **Scalability**: Self-hostable for low costs; Support 1,000 users with <5% churn via value-driven upsells.
- **Ownership**: Fork ensures control; Public repo builds community while custom IP (templates) differentiates.
- **Success Metrics**:
  - Adoption: 1,000 sign-ups in first 3 months.
  - Engagement: 70% retention after Week 1; Avg. 5 dashboards/user.
  - Revenue: $2.5K/month from $5 tier; 15% upsell to services.
  - ROI: Track via internal instance: 30% increase in Artisan client pipeline.

## 2. Target Audience and User Personas
### 2.1 Target Users
- **Primary**: Bootstrapped SaaS founders/product managers (under $10M ARR) struggling with self-serve churn. Pain points: High Reg abandonment (40%+), Payment failures (15-20%), Low activation (post-sign-up engagement <30%).
- **Secondary**: Growth agencies/consultants reselling white-labeled versions; Internal use by Artisan team for client audits.
- **User Scale**: 100-500 active users initially; Multi-tenant support for agency clients (isolated projects).
- **Personas**:
  - **Persona 1: Indie Founder (Alex, 32, Solo SaaS Builder)**: Tech-savvy but time-poor. Needs quick setup for Reg flow tracking. Enters via free tier; Upsells to Pro for A/B testing.
  - **Persona 2: Product Manager (Jordan, 28, Mid-Size SaaS)**: Data-driven, focuses on Payment/Activation metrics. Uses Growth tier; Converts to agency via in-app audit offers.
  - **Persona 3: Agency Consultant (Taylor, 35, Artisan Partner)**: Customizes for clients; Enterprise tier for white-labeling.

### 2.2 User Journeys
- **Onboarding**: 5-min install via SDK snippet (JS/React). Auto-tracks basic events; Guides to first dashboard.
- **Core Workflow**: Embed SDK → Track events (e.g., 'reg_start', 'payment_fail') → View funnel → Export/Alert → Upsell prompt.
- **Exit Paths**: Free users hit limits → Upgrade nudge; All users see "Optimize with Artisan" CTA.

## 3. Functional Requirements
### 3.1 Core Features (Inherited from OpenPanel Fork)
Based on OpenPanel (as of Aug 2025): Real-time event analytics, funnels, retention. Customize via code in `apps/` directory.

- **Event Tracking**:
  - Capture custom events (e.g., 'user_registration_start', 'payment_initiated', 'activation_complete') with properties (e.g., device, timestamp, user_id).
  - SDK Support: JS, React, Next.js, Vue, Astro, React Native, Express. Add Artisan-specific: Pre-configured snippets for Stripe (payment events), Auth0 (Reg flows).
  - Real-time: Pub/Sub via Redis for live updates; Notifications (e.g., email via Resend) for thresholds (e.g., >10% drop-off).

- **Analytics and Visualizations**:
  - Funnels: Multi-step (e.g., Reg: Email → Password → Verify; Payment: Cart → Card → Confirm).
  - Retention: Cohort analysis for activation (e.g., Day 1-7 engagement post-Reg).
  - Charts: Line/bar/pie/area/histogram/map/cohort. Export CSV/PDF.
  - Filtering: By properties (e.g., filter Reg drop-offs by referrer source).

- **Dashboards**:
  - Unlimited per user; Drag-drop UI (Shadcn/Tailwind).
  - Pre-built: Forked defaults + Custom (see below).

- **API and Integrations**:
  - tRPC for frontend API; Fastify for event ingestion.
  - Track API: POST /track with JSON payload.
  - Integrations: OAuth (Arctic/Oslo); Add Zapier webhook for upsells.

### 3.2 Custom Features (Artisan-Specific Enhancements)
Implement in forked repo: New modules in `/apps/dashboard` and `/api`.

- **Self-Serve Flow Templates (High Priority)**:
  - **Reg Flow Template**: Pre-built funnel for sign-up sequence (Step 1: Landing → Email Input; Step 2: Password; Step 3: Verify Email). Metrics: Abandonment rate, Time-to-complete. Custom event: 'reg_abandon' on form exit.
  - **Payment Flow Template**: Integrates Stripe events (e.g., 'checkout.session.completed', 'payment_intent.payment_failed'). Metrics: Success rate, Failure reasons (e.g., card decline). Visualization: Bar chart of failure types.
  - **Activation Flow Template**: Post-Reg tracking (e.g., 'first_login', 'feature_usage'). Metrics: Activation rate (users completing 3+ actions in 24h). Cohort: Retention by activation speed.
  - Implementation: Add to `/components/templates/`; Auto-load on project creation. Use ClickHouse queries for event storage.

- **Upsell and Lead-Gen Hooks**:
  - In-App CTAs: After funnel view, show "Detected 25% drop-off? Get a free Artisan audit" → Calendly link.
  - Email Automation: BullMQ queue for sequences (Day 1: Welcome; Day 7: Insights report with upsell).
  - Service Bundle: Pro tier includes 1x 30-min consultation API call.

- **Multi-Tenancy for Agency**:
  - Project Isolation: Postgres schemas per client; Redis keys prefixed by user_id.
  - White-Label Mode: Enterprise users toggle branding (hide Artisan logo, add theirs).

- **A/B Testing Module (MVP Extension)**:
  - Track variants (e.g., Reg form A vs. B). Metrics: Conversion lift. Integrate with SDK: `track('ab_test', {variant: 'A'})`.

- **User Stories** (As a [user], I want [feature] so that [benefit]):
  - As an Indie Founder, I want one-click SDK install for Reg tracking so that I can spot drop-offs without dev help.
  - As a Product Manager, I want Payment failure alerts so that I can fix issues in real-time.
  - As an Agency Consultant, I want exportable reports with Artisan watermark so that I can demo to clients.
  - As any user, I want AGPL-compliant source access link so that I trust the tool's openness.

### 3.3 Data Model
- **Events Table (ClickHouse)**: id, timestamp, event_name, properties (JSON), user_id, project_id.
- **Users Table (Postgres)**: id, email, subscription_tier, created_at.
- **Projects Table (Postgres)**: id, name, user_id, sdk_key (for isolation).
- Custom: Add `flow_type` enum (reg, payment, activation) to properties.

## 4. Non-Functional Requirements
### 4.1 Performance
- Latency: <2s for event ingestion; <5s for dashboard loads (up to 100K events).
- Scalability: Handle 1M events/month per instance; Horizontal scale via Docker Compose.
- Uptime: 99.5% (self-hosted on VPS like DigitalOcean $10/month).

### 4.2 Security and Compliance
- Auth: Oslo for JWT; OAuth2 for integrations.
- Data Privacy: GDPR-compliant, cookieless tracking (per OpenPanel). Client data encrypted at rest (Postgres).
- AGPL Compliance: Public GitHub repo with full source; Attribution to OpenPanel in footer.
- Vulnerabilities: Scan with npm audit; No known issues from OpenPanel repo (19 contributors, active as of 2025).

### 4.3 Usability and Accessibility
- UI: Responsive (mobile-first), Tailwind/Shadcn. Dark mode toggle.
- Accessibility: WCAG 2.1 AA (alt texts, keyboard nav).
- Localization: English only (MVP); i18n ready.

### 4.4 Reliability and Monitoring
- Error Handling: BullMQ retries for queues; Logging via console.
- Monitoring: Integrate Sentry (add to stack); Track tool's own metrics (meta!).

## 5. Technical Specifications
### 5.1 Stack (Forked from OpenPanel)
- **Frontend**: Next.js (dashboard), Tailwind CSS, Shadcn UI.
- **Backend**: Fastify (event API), tRPC (queries), Node.js.
- **Database**: Postgres (metadata), ClickHouse (events), Redis (cache/pub-sub).
- **Queue**: BullMQ for jobs (e.g., emails).
- **Deployment**: Docker Compose for self-hosting. Add: `docker-compose.yml` with Artisan env vars (e.g., DB_URL, STRIPE_KEY).
- **Setup Instructions** (In Repo README):
  1. Fork repo: `git clone https://github.com/ArtisanStrategies/ags-analytics` (public for AGPL).
  2. Hosts: Add `127.0.0.1 ags.local api.ags.local` to /etc/hosts.
  3. Install: `pnpm install`.
  4. Dev: `pnpm dock:up && pnpm codegen && pnpm migrate:deploy && pnpm dev`.
  5. Custom: Edit `/apps/dashboard/components/templates/` for self-serve modules.
- **Custom Code Snippets** (To Implement):
  - SDK Example for Reg: 
    ```javascript
    import { track } from '@artisan/ags-analytics-sdk';
    track('reg_start', { step: 'email', userAgent: navigator.userAgent });
    ```
  - Funnel Query (tRPC): Extend `/server/api/routers/funnels.ts` with flow_type filter.

### 5.2 Integrations
- Payments: Stripe webhooks for event auto-tracking.
- Upsells: Calendly API; Resend for emails.
- Analytics: Self-track via embedded instance.

## 6. Assumptions, Dependencies, and Risks
### 6.1 Assumptions
- OpenPanel repo stable (no breaking changes post-fork; last active 2025 confirms maturity).
- Dev resources: 1-2 weeks for MVP customizations (or freelance ~$1K).
- Legal: AGPL allows forking; No IP conflicts with Stripe/etc.

### 6.2 Dependencies
- External: Docker, Node 18+, pnpm, Postgres/ClickHouse/Redis images.
- Internal: Artisan domain for hosting (agsanalytics.artisanstrategies.com); Stripe account for billing.

### 6.3 Risks and Mitigations
- Risk: AGPL source sharing exposes customs → Mitigation: Keep sensitive upsell logic client-side; Use as lead-gen, not core IP.
- Risk: OpenPanel updates → Mitigation: Merge upstream quarterly via `git merge upstream`.
- Risk: Low adoption → Mitigation: Launch on Product Hunt; Free tier marketing.
- Risk: Tech Debt → Mitigation: Unit tests in `/tests/`; CI/CD with GitHub Actions.

## 7. Roadmap and Timeline
- **Phase 1: MVP (Weeks 1-2, Aug 2025)**: Fork, basic customs (templates), self-host setup. Launch beta to 10 clients.
- **Phase 2: Polish (Weeks 3-4)**: Upsells, A/B module, pricing integration (Stripe).
- **Phase 3: Scale (Month 2+)**: ML insights, mobile SDK enhancements. Public launch.
- **Milestones**: Internal test (Week 1 end); Beta feedback (Week 3); Full release (Sep 2025).

## 8. Appendices
### 8.1 Glossary
- **Self-Serve Flow**: User-driven processes without support (Reg: Sign-up; Payment: Checkout; Activation: Onboarding completion).
- **Event**: Discrete user action (e.g., button click).

### 8.2 References
- OpenPanel Docs: https://openpanel.dev/docs
- Repo: https://github.com/Openpanel-dev/openpanel
- 2025 Updates: Mixpanel Alternatives article (Jul 18, 2025) confirms funnel/retention focus.

This PRD is exhaustive for development—use it as a living document in your IDE. Tag sections with TODOs (e.g., // TODO: Implement Reg template). If changes needed, iterate via feedback!
