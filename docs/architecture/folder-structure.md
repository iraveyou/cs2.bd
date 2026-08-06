cs2bd — Recommended Folder Structure

Purpose: provide a scalable, modular layout for a large Next.js 15 App Router project using Server Actions, Prisma, and a component library (shadcn).

Top-level layout (recommended)

/ (project root)
- app/                - Next.js App Router routes and layout (server components by default)
  - (marketing)/      - public marketing pages (home, about, blog, docs)
  - marketplace/      - marketplace routes (listings, categories, search)
  - seller/           - seller dashboard routes
  - buyer/            - buyer dashboard routes
  - admin/            - admin dashboard routes
  - api/              - edge/server actions and api routes (if needed)
  - layout.tsx
  - globals.css
- components/         - shared UI components (atoms, molecules)
  - ui/               - shadcn-based primitives and design-system wrappers
  - listing/          - ListingCard, ListingGrid, Filters
  - navbar/, footer/, forms/
- lib/                - low-level utilities (prisma client wrapper, redis, i18n)
  - prisma.ts
  - redis.ts
  - cloudinary.ts
  - uploadthing.ts
- services/           - application services (business logic used by server actions)
  - listings.service.ts
  - orders.service.ts
  - payments.service.ts
  - seo.service.ts
- hooks/               - client hooks (useAuth, useRealtime, useInfiniteListings)
- prisma/              - prisma schema + migrations
- scripts/             - helper scripts (db seed, migrate, start-dev)
- public/              - static assets
- styles/              - tailwind config, design tokens (if not in tailwind.config)
- docs/                - architectural docs and operational runbooks
- docker/              - docker-compose or deployment helpers
- .github/             - GitHub Actions workflows

Guidelines

- Keep server-side business logic inside services/ and call from Server Actions in app/ routes.
- Server components should fetch data via services and server actions; client components stay focused on UI and interactions.
- Use a feature-first layout for app/ (routes grouped by feature) and a layer-separated layout for shared code (services, lib, components).
- Keep shadcn UI primitives in components/ui and expose a small set of design tokens (colors, spacing) from styles/.
- Put admin-only server actions and job queues behind role checks in services/. Protect via RBAC.
- Store secrets in environment variables and reference in lib/* (prisma, redis, cloudinary).

Performance & scalability notes

- Use Redis for short-lived caches, rate limits, and realtime presence counters.
- Use Cloudinary for media with signed uploads and automatic transformations.
- Use Prisma with UUID PKs for distributed safety; use autoincrement order numbers only where human-friendly sequences are helpful.
- Add SQL-level GIN indexes for full-text search on Listing (via raw migrations) and materialized views for aggregated reports.

CI/CD

- GitHub Actions with jobs: test, lint, build, migrate (deploy), and smoke tests.
- Containerize with Docker for prod images and use Vercel for frontend deploys (prisma migrations/runners executed via CI).

Security

- Always validate inputs via Zod on server actions.
- Rate limit critical endpoints (signin, payment submissions).
- Sanitize HTML/markdown when rendering.

This file is a starting point; adjust as the codebase grows.
