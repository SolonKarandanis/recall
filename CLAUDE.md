# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server on port 3000

# Build & Preview
npm run build        # Production build via Vite/Nitro
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Biome linting
npm run format       # Biome formatting
npm run check        # Full Biome check (lint + format)

# Testing
npm run test         # Run Vitest

# Database (Prisma)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio UI
npm run db:seed      # Seed database
```

## Architecture

This is a **TanStack Start** full-stack application (React 19 + Nitro server) for web content scraping and knowledge management ("recall").

### Routing

File-based routing via **TanStack Router** (auto-generated `src/routeTree.gen.ts`). Route files live in `src/routes/`:

- `/` — Public home page with navbar
- `/_auth/login`, `/_auth/signup` — Auth pages
- `/dashboard` — Protected layout with app sidebar; protected by middleware at the router level
- `/dashboard/import` — Single and bulk URL scraping interface
- `/dashboard/items` — Saved items list
- `/api/auth/*` — Better Auth server routes

The `_auth` and `dashboard` prefixes define layout groups. The router context carries a `QueryClient` for SSR-compatible query integration.

### Server Functions (API Layer)

Instead of REST endpoints, the app uses TanStack Start `createServerFn` in `src/data/`. These are type-safe, validated with Zod, and composable with middleware:

- `scrapeUrlFn` — Single URL scrape via Firecrawl
- `mapUrlFn` — Discover URLs on a site (bulk import step 1)
- `bulkScrapeUrlsFn` — **Async generator** streaming progress for bulk scraping
- `getItemsFn`, `getItemById` — Fetch saved items
- `saveSummaryAndGenerateTagsFn` — AI tag generation via OpenRouter (partially implemented)
- `searchWebFn` — Web search via Firecrawl

Function-level auth is enforced by composing `authMiddleware` into server functions. Request-level middleware (`src/middlewares/request.ts`) handles logging and session injection.

### Authentication

**Better Auth** with email/password, Prisma adapter, MySQL storage.

- Server config: `src/lib/auth.ts`
- Client helper: `src/lib/auth-client.ts`
- Route protection: middleware redirects unauthenticated requests from `/dashboard` and `/api/ai` to `/login`
- Session validated per-request via `authFnMiddleware`

### State Management

- **TanStack Query** — all server data fetching, caching, invalidation
- **TanStack Form + Zod** — form state and validation
- **React Context** — theme (dark/light) via `ThemeProvider` in `src/lib/theme.tsx`
- No Redux or Zustand; server functions replace most client-side state needs

### Database

**Prisma ORM** with MySQL/MariaDB. Schema at `prisma/schema.prisma`. Generated client at `src/generated/prisma/`.

Key models:
- `User`, `Session`, `Account`, `Verification` — Better Auth managed
- `SavedItem` — Core content model: URL, title, markdown content, summary, author, tags (JSON), status enum (`PENDING | PROCESSING | COMPLETED | FAILED`)

### UI Components

**Shadcn UI** components in `src/components/ui/` (22 components). Styling uses **Tailwind CSS 4** with dark mode support. Icons via Lucide React. Class variance authority (`cva`) for component variants.

### External APIs

- **Firecrawl** — Scraping, crawling, URL mapping, and web search
- **OpenRouter** — AI tag generation (partially implemented, code commented out)

### Path Aliases

Both `#/*` and `@/*` resolve to `src/*`.

### Key Conventions

- Server functions always validate input with Zod schemas from `src/schemas/`
- Async generators (`async function*`) are used for streaming bulk operations — consumers iterate with `for await`
- Route loaders pre-fetch data before rendering (e.g., dashboard items)
- Biome (not ESLint/Prettier) for linting and formatting; tabs for indentation
