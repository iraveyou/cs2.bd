cs2bd — Handoff Notes

Date: 2026-08-02
Prepared by: AI assistant (Copilot CLI runtime in VS Code)

Purpose
-------
This document summarizes the current application state, how to run it locally, important implementation details, known issues, and recommended next steps for the engineering team to continue development and hardening.

High-level status
-----------------
- Frontend: Landing page, marketplace grid, listing detail page, improved card UI with animations. Sign up & sign in UIs present and wired to NextAuth client flows.
- Auth: NextAuth configured (Credentials provider). SessionProvider integrated at app/layout.
- DB: Prisma schema expanded with production-ready models (users, listings, orders, payments, media, audit logs, reviews, conversations, disputes, cms, etc.).
- Payments: Client BuyPanel allows payment proof uploads. /api/payments persists Order, OrderItem, Payment and saves screenshots to public/uploads (dev flow). Reservation TTL implemented (30 minutes) and stock decrement is atomic via transaction.
- Admin: /admin/dashboard and /admin/payments pages implemented. Admin approve/reject endpoints implemented at /api/admin/payments/[id]/approve and /api/admin/payments/[id]/reject.
- Dev utilities: POST /api/dev/seed-admins creates 4 demo admin accounts in dev (disabled in production).
- Docs: docs/architecture folder with folder-structure.md and payment-workflow.md. This HANDOFF.md file added now.

How to run locally
------------------
Prereqs
- Node.js (recommended 18+)
- npm (or pnpm/yarn)
- PostgreSQL database and a DATABASE_URL env var
- Optional: Redis for rate-limiting / caching (REDIS_URL)

Environment variables (minimal)
- DATABASE_URL - Postgres connection string
- NEXTAUTH_SECRET - secret for NextAuth
- NEXTAUTH_URL - base URL (e.g. http://localhost:3001)
- (dev) NODE_ENV=development
- CLOUDINARY_URL or other media provider env vars (not currently mandatory)

Setup and run
1. Install dependencies
   npm install

2. Generate Prisma client
   npm run prepare

3. Run Prisma migrate (create dev migration and apply)
   npx prisma migrate dev --name init

4. (Optional) Seed demo admins via dev endpoint
   curl -X POST http://localhost:3001/api/dev/seed-admins
   - Dev-only; disabled in production. Admin credentials: admin1@underground.test .. admin4@underground.test (password: Password123!)

5. Start dev server
   npm run dev

Notes
- The application writes uploaded screenshots to public/uploads for development. Production should switch to Cloudinary / UploadThing and scan images before persisting.

Key routes and APIs
-------------------
Frontend pages
- /                 - Home
- /marketplace      - Marketplace grid (client component)
- /listing/[slug]   - Listing details (contains BuyPanel)
- /auth/signup      - Sign up form (Buyer or Apply as Seller)
- /auth/signin      - Sign in (Credentials provider)
- /admin/dashboard  - Admin overview
- /admin/payments   - Admin payment verification queue

API routes
- POST /api/auth/signup                - create user (buyer or seller applicant)
- POST /api/auth/[...nextauth]         - NextAuth handler (sign in)
- POST /api/dev/seed-admins            - create 4 demo admin accounts (dev only)
- POST /api/payments                   - submit payment proof; creates Order, OrderItem, Payment; saves screenshot to public/uploads (dev)
- POST /api/admin/payments/[id]/approve- marks payment VERIFIED and order AWAITING_DELIVERY
- POST /api/admin/payments/[id]/reject  - marks payment REJECTED, returns item stock, cancels order

Important files (where to look)
- prisma/schema.prisma                 - current DB schema
- lib/prisma.ts                        - Prisma client wrapper
- lib/auth/nextauth.ts                 - NextAuth options and callbacks
- components/listing/BuyPanel.tsx      - client-side buy UI
- app/api/payments/route.ts            - payments handler (persistence + reservation)
- app/api/admin/payments/[id]/approve/route.ts
- app/api/admin/payments/[id]/reject/route.ts
- app/api/dev/seed-admins/route.ts     - dev seed endpoint
- app/auth/signup/page.tsx             - signup UI (buyer/seller application)
- app/auth/signin/page.tsx             - signin UI
- components/layout/Navbar.tsx         - navbar (uses useSession; Admin link shown for admins)
- components/ui/Card.tsx               - Card component (framer-motion)
- components/listing/ListingCard.tsx   - listing card UI
- app/admin/payments/page.tsx          - admin payments page UI
- docs/architecture/*                   - design docs

Known issues & important caveats
--------------------------------
Security / auth
- Admin APIs and pages must be protected server-side (currently client-only nav hides admin link, but some API endpoints may still accept unauthenticated requests if not server-guarded). Team must enforce server-side RBAC (getServerSession/getSession) on admin pages and API handlers.

Payment flow
- payment.screenshot is saved to public/uploads in dev. Admin UI currently links to screenshotMediaId directly; adjust admin UI to resolve Media.url for correct link.
- Payments are currently created with buyerId = null when submitted anonymously. Update /api/payments to require authentication and set buyerId from session.

Validation and sanitization
- Add Zod validation to /api/auth/signup and /api/payments and client forms (React Hook Form + zodResolver) to prevent malformed data.

Dev-only endpoints
- /api/dev/seed-admins exists for seeding in development. Remove or secure before exposing non-dev environments.

Deploy notes
- Use environment variables for NEXTAUTH_SECRET, DATABASE_URL, CLOUDINARY_*, REDIS_URL, and disable dev endpoints in production.
- For media: switch screenshot handling to Cloudinary / UploadThing; store canonical media URLs in Media table.
- Run prisma migrate deploy in CI/CD and run migrations during deploy.

Recommended next actions for the team (priority)
-----------------------------------------------
1. Enforce server-side RBAC on all admin pages and API endpoints (must-have).
2. Require authentication for payment submission and attach buyerId to Order and Payment (must-have).
3. Replace local upload storage with Cloudinary / UploadThing and add image scanning (high priority).
4. Add Zod validation and client-side form validation across auth and payment flows (high priority).
5. Remove or secure dev-only endpoints (seed admin) and convert seed to migration-based seed script.
6. Add rate-limiting middleware (Redis) for critical endpoints (signup, payments) to prevent abuse.
7. Implement automated tests (unit + E2E for buy flow + admin verification) and a basic GitHub Actions pipeline.
8. Add monitoring (Sentry) and structured logs for production.

Appendix: Quick troubleshooting
------------------------------
- HMR / WebSocket errors: If HMR fails, stop the dev server and restart npm run dev. Ensure the port is free and NEXTAUTH_URL matches.
- Type errors: run npx tsc --noEmit to surface TypeScript issues.
- Prisma client: run npm run prepare (prisma generate) after updating prisma/schema.prisma.

Support
-------
If the team needs me to implement server-side RBAC, fix admin media links, or convert payments to authenticated flows, I can implement those changes on request. Otherwise, this handoff contains the necessary pointers to continue development safely.

-- End of handoff --
