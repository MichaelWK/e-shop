# GraphQL Shop

An e-commerce demo built with **Next.js (App Router)**, a **GraphQL API** (GraphQL Yoga) and **PostgreSQL** via **Prisma**.

```
Next.js pages ──► GraphQL schema + resolvers ──► Prisma ──► PostgreSQL
                  (also served at /api/graphql)
```

## Tech stack

| Layer     | Choice                                                   |
| --------- | -------------------------------------------------------- |
| Framework | Next.js 16, React 19, TypeScript (strict)                |
| API       | GraphQL Yoga in a route handler, GraphiQL in development |
| Types     | GraphQL Code Generator → typed resolvers                 |
| Database  | PostgreSQL 17 + Prisma ORM                               |
| Styling   | Tailwind CSS 4                                           |
| Testing   | Vitest (resolver tests with a mocked Prisma client)      |
| CI        | GitHub Actions: format, lint, typecheck, test, build     |

## Getting started

Requirements: Node 22+, Docker (for local Postgres).

```bash
cp .env.example .env
npm install          # also generates Prisma client + resolver types
npm run db:up        # start Postgres in Docker
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

- Shop: http://localhost:3000
- GraphiQL: http://localhost:3000/api/graphql

Example query:

```graphql
{
  products(filter: { categorySlug: "audio" }) {
    name
    priceCents
    inStock
    category {
      name
    }
  }
}
```

## Scripts

| Script               | What it does                                 |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start the dev server                         |
| `npm run codegen`    | Regenerate resolver types after schema edits |
| `npm run db:migrate` | Create/apply a Prisma migration              |
| `npm run db:studio`  | Browse the database in Prisma Studio         |
| `npm test`           | Run tests                                    |
| `npm run lint`       | ESLint                                       |
| `npm run typecheck`  | TypeScript                                   |

## Project structure

```
prisma/
  schema.prisma        data model (products, categories, carts, orders)
  seed.ts              demo data
src/
  app/                 pages (Server Components) + /api/graphql route
  graphql/
    typeDefs.ts        GraphQL schema (source of truth)
    resolvers.ts       resolvers, typed by codegen
    schema.ts          executable schema
    execute.ts         in-process execution for Server Components
    __tests__/         resolver tests
  lib/                 Prisma client, helpers, shared types
```

## Workflow

`main` is protected: every change goes through a pull request with green CI.

```bash
git switch -c feat/cart
# ...work, commit...
git push -u origin feat/cart
gh pr create --fill
```

## Roadmap

- [x] Product catalogue: list, filter by category, search, product page
- [ ] Cart (GraphQL mutations, cookie-based guest cart)
- [ ] Authentication (Auth.js)
- [ ] Checkout with Stripe (test mode)
- [ ] Order history
- [ ] Admin: manage products
- [ ] Codegen client preset for typed queries
- [ ] Cursor-based pagination
- [ ] Deploy to Vercel + Neon
