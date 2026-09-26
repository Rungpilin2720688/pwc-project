# Product Catalogue

A product catalogue built with **Next.js 15 (App Router) + React 19 + TypeScript + PostgreSQL (Prisma)**.

- Product list over **25,000 seeded products** with category / price-range filters and name / price / rating sorting
- Filter, sort and page state lives in the URL, so every view is shareable and restorable
- Product detail page with reviews and a validated review form
- Whole system runs with one command via Docker Compose

## Quick start (Docker)

```bash
docker compose up --build
```

Open <http://localhost:3000>. On first start the `migrate` service applies migrations and seeds 25k products (~10s); later starts skip seeding.

| Variable             | Default | Purpose                              |
| -------------------- | ------- | ------------------------------------ |
| `APP_PORT`           | `3000`  | Host port for the web app            |
| `DB_PORT`            | `5432`  | Host port for Postgres               |
| `SEED_PRODUCT_COUNT` | `25000` | Number of generated products         |

Example if port 3000 is taken: `APP_PORT=3001 docker compose up --build`.
Reset all data: `docker compose down -v`.

## Local development

```bash
cp .env.example .env
docker compose up -d db        # Postgres only
npm install                    # also runs `prisma generate`
npm run db:deploy && npm run db:seed
npm run dev                    # http://localhost:3000
```

| Script              | Description                         |
| ------------------- | ----------------------------------- |
| `npm run test`      | Unit tests (Vitest)                 |
| `npm run typecheck` | `tsc --noEmit`                      |
| `npm run lint`      | ESLint (next/core-web-vitals)       |
| `npm run db:migrate`| Create a new migration during dev   |

## Project structure

```
prisma/
  schema.prisma            # data model + indexes
  migrations/              # versioned SQL (incl. CHECK constraints)
  seed.ts                  # deterministic 25k-product generator
src/
  app/                          # routing only: pages compose feature components
    products/(list)/            # list page + skeleton loading state
    products/[id]/              # detail page
    api/products/...            # REST endpoints
    api/health/                 # liveness + DB check
  components/
    layout/                     # SiteHeader, Container
    ui/                         # design-system primitives: Button, FormField, Input/Select/Textarea,
                                # Badge, EmptyState, RatingStars, Skeleton
  features/                     # business code, grouped by domain
    products/
      query.ts                  # URL <-> typed query (Zod), price-range validation
      repository.ts             # DB access, maps Prisma rows -> domain types
      types.ts                  # domain types used by UI & API
      components/
        ProductCard, ProductGrid, ProductGridSkeleton, ProductImage, ProductDetails, Pagination
        filters/                # ProductFilters = CategoryFilter + SortSelect + PriceRangeFilter
                                # + useProductFilters (URL navigation hook)
    reviews/
      schema.ts                 # validation shared by client & server
      api.ts                    # typed client for the reviews endpoint
      repository.ts             # create review + update aggregates atomically
      components/
        ReviewSection, ReviewList, ReviewItem, ReviewForm
        useReviewForm           # form state, validation and submission
  lib/                          # infrastructure: db client, http helpers, formatting, cn()
```

Conventions:

- `app/` wires things together; `features/<domain>/` owns the logic. A new domain (e.g. carts) is a new folder under `features/` without touching the others.
- `components/ui/` holds generic, domain-agnostic building blocks; feature components compose them.
- Components are presentational; stateful logic lives in hooks (`useProductFilters`, `useReviewForm`) and network calls in `api.ts`, so each piece can be tested and changed on its own.
- Styles are co-located CSS Modules; `globals.css` only defines design tokens (colours, radius, shadows) and a base reset.

## Architecture decisions

**Rendering: React Server Components + URL as state.**
The list page is a Server Component that reads `searchParams`, queries the DB and renders HTML. There is no client-side data store: the URL *is* the state. Filters are a small Client Component that only calls `router.push()` with a new URL. This gives shareable links, working back/forward, SEO-friendly HTML and almost no client JS, without Redux/React Query.

**URL parsing with Zod (`features/products/query.ts`).**
One schema defines the URL contract for both the page and `GET /api/products`. Invalid values (`?sort=hack&page=-1`) fall back to defaults via `.catch()` rather than erroring, and `serializeProductQuery` omits defaults so URLs stay canonical. Round-trip is unit tested.

**Data: PostgreSQL + Prisma.**
Relational data (products ↔ reviews) with real filtering and sorting needs a real database; 20k+ rows in JSON/in-memory would not reflect production. Prisma gives type-safe queries and versioned migrations. Indexes cover every filter/sort path (`category+price`, `price`, `ratingAvg`, `name`), and a secondary `ORDER BY id` keeps pagination stable.

**Denormalised rating.** `ratingAvg` and `reviewCount` live on `Product` so sorting by rating is an indexed column instead of an aggregate over reviews. On review creation both are updated in a single atomic `UPDATE` inside the same transaction as the insert, so concurrent submissions cannot lose updates.

**Pagination: offset (`?page=N`).** Simple, shareable and allows jumping to a page. At 25k rows with indexes it is fast. Keyset (cursor) pagination is the upgrade path if the catalogue grows to millions (see below).

**Review submission: Route Handler + shared schema.**
`POST /api/products/:id/reviews` is a plain REST endpoint so mobile apps or other services can reuse it. The same Zod schema validates on the client (instant feedback, accessible error messages) and on the server (authoritative). Postgres `CHECK` constraints are a last line of defence. After success the client calls `router.refresh()` to re-render server data.

**Layering: route → repository → Prisma.** Routes never touch Prisma directly; repositories return domain types (`price: number`, ISO date strings), so the persistence layer can change without touching UI. Repositories import `server-only` so they cannot leak into client bundles.

**Docker.** Multi-stage build producing a Next.js `standalone` image running as a non-root user. A separate one-shot `migrate` service applies migrations and seeds before the app starts (`depends_on: service_completed_successfully`), keeping the runtime image free of dev tooling.

## API

| Method | Path                           | Description                                      |
| ------ | ------------------------------ | ------------------------------------------------ |
| GET    | `/api/products`                | Paginated list; same query params as the page    |
| GET    | `/api/products/:id/reviews`    | Latest reviews                                   |
| POST   | `/api/products/:id/reviews`    | `{ author, rating, comment }` → `201` / `400` / `404` |
| GET    | `/api/health`                  | `200` if app and DB are reachable                |

## What I would do next

- **Testing:** integration tests for repositories against a throwaway Postgres (Testcontainers), Playwright E2E for the list → detail → review flow, CI pipeline running lint/typecheck/tests/build.
- **Scale:** keyset pagination for very large catalogues, full-text search (`pg_trgm` / Postgres FTS, or a search engine), caching category lists and hot pages.
- **Product:** reviews pagination, normalised `Category` table, real image storage/CDN with `next/image`, i18n, authentication so reviews are tied to users, rate limiting / spam protection on review submission.
- **Ops:** structured logging, error tracking (Sentry), metrics, secrets via environment management instead of compose defaults.
