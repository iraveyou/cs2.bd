# cs2bd BD — Counter-Strike 2 Marketplace (Bangladesh)

[![CI / CD](https://github.com/underground-bd/cs2-marketplace/actions/workflows/ci.yml/badge.svg)](https://github.com/underground-bd/cs2-marketplace/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-indigo.svg)](https://www.prisma.io/)

cs2bd BD is a high-performance, dark-themed Counter-Strike 2 skin marketplace tailored specifically for Bangladeshi gamers. It features 100% Escrow security, manual bKash & Nagad payment verification, float-value sorting, seller trust scores, and real-time fraud detection.

---

## 🏛️ Clean Architecture & Repository Pattern

The application is structured following Clean Architecture principles with strict separation of concerns:

```
├── lib/
│   ├── repositories/             # Data Access Layer (Repository Pattern)
│   │   ├── listing.repository.ts # Listing CRUD, Float filtering & search
│   │   ├── order.repository.ts   # Order lifecycle & Escrow reservation
│   │   └── payment.repository.ts # Manual bKash/Nagad verification & audit
│   ├── validators/               # Zod Schemas & Input validation
│   ├── auth/                     # NextAuth configurations
│   ├── mail.ts                   # Resend transactional emails
│   ├── notifications.ts          # WebPush & Browser notifications
│   └── prisma.ts                 # Prisma ORM Database Singleton
├── components/                   # Reusable UI & Layout components
├── app/                          # Next.js 15 App Router pages & API routes
├── __tests__/                    # Vitest unit & integration test suites
└── prisma/
    └── schema.prisma             # Normalized relational database schema
```

---

## 🚀 Key Features

- **Soothing Cyberpunk UI**: Sleek dark theme with dark navy backgrounds (`#0a0e17`), soft teal accents (`#2dd4bf`), and clean border radii.
- **Escrow Trade Security**: Payments are held safely in cs2bd Escrow until buyer verifies item receipt on Steam.
- **Manual bKash & Nagad Verification**: Direct Personal Send Money support with admin audit queue, transaction ID deduplication, and screenshot verification.
- **Float & Pattern Inspection**: Direct display of CS2 float values, wear conditions (Factory New, Field-Tested, etc.), and StatTrak™ indicators.
- **Dominant Technical SEO**: Automated Schema.org (Product, Breadcrumbs, Organization), dynamic `sitemap.xml`, `robots.txt`, and RSS feeds.

---

## 🧪 Testing

Unit & integration tests are powered by **Vitest**:

```bash
# Run unit test suite
npm test
```

---

## 🐳 Docker Deployment

A multi-stage `Dockerfile` is provided for production containerization:

```bash
# Build Docker image
docker build -t underground-bd .

# Run Docker container
docker run -p 3000:3000 -e DATABASE_URL="postgresql://..." underground-bd
```

---

## ⚙️ GitHub Actions CI/CD

The workflow in `.github/workflows/ci.yml` automatically executes on every push or pull request to `main`:
1. Installs Node.js & dependencies via `npm ci`
2. Generates Prisma Client (`npx prisma generate`)
3. Runs Vitest unit test suite
4. Builds the production Next.js application

---

## 🔒 Security & Fraud Prevention

- **OWASP Compliance**: Rate-limited payment submissions and input sanitization via Zod.
- **Transaction Deduplication**: Prevents reusing bKash/Nagad TrxIDs across multiple orders.
- **Fine-Grained RBAC**: Role-based access control for Buyers, Sellers, Moderators, and Admins.
