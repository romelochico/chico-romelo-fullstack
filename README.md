# Chico Romelo — Platform

Full-stack web platform for the Portuguese band Chico Romelo. Combines a public-facing band website with a private admin panel, all in a single Next.js application backed by Supabase.

## What it does

**Public site** — visitors can explore the band's story, browse upcoming and past shows, read news, stream or download releases, view press photos, and send booking or press enquiries through a contact form.

**Admin panel** (`/admin`) — a private, authenticated dashboard where band members manage all dynamic content: events, news posts, releases, press media, and links. Includes a band evaluation system where members rate each show in detail (per-song performance, general vibe, punctuality) and view aggregated scores across the set list.

## Architecture

```
┌──────────────────────────────────────────────────┐
│                  Next.js 14                      │
│                                                  │
│  Public routes          Admin routes (/admin)    │
│  ─────────────          ──────────────────────   │
│  / (home)               /admin/dashboard         │
│  /sobre                 /admin/eventos           │
│  /agenda                /admin/novidades         │
│  /novidades             /admin/releases          │
│  /lancamentos           /admin/contatos          │
│  /imprensa              /admin/media             │
│  /contatos              /admin/avaliacoes        │
│                         /admin/links             │
│                                                  │
│  ┌───────────────┐       ┌──────────────────────┐│
│  │ getStaticProps│       │Edge Middleware       ││
│  │ (ISR, 24h)    │       │Auth + email whitelist││
│  └───────────────┘       └──────────────────────┘│
└──────────────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │       Supabase         │
        │                        │
        │  PostgreSQL (database) │
        │  Auth (email + magic)  │
        │  Storage (media files) │
        └────────────────────────┘
```

**Public pages** use `getStaticProps` with Incremental Static Regeneration (ISR) — pages are pre-built at deploy time and revalidated every 24 hours, so the public site is fast and doesn't hit the database on every visit.

**Admin pages** are fully client-side rendered, protected by Next.js Edge Middleware that checks the Supabase session and an email whitelist on every request before it reaches the page.

**Contact form** submits in parallel to Supabase (for admin inbox) and Formspree (for email delivery).

## Stack

| Layer         | Technology                         |
| ------------- | ---------------------------------- |
| Framework     | Next.js 14 (Pages Router)          |
| UI            | React 18 + styled-components 6     |
| Icons         | Lucide React                       |
| Database      | Supabase (PostgreSQL)              |
| Auth          | Supabase Auth with Edge Middleware |
| Storage       | Supabase Storage                   |
| Form delivery | Formspree                          |
| Deployment    | Vercel                             |

## Running locally

**1. Install dependencies**

```bash
npm install
```

**2. Set up environment variables**

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable                        | Where to find it                             |
| ------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Settings → General                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API                    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase → Settings → API (secret)           |
| `ADMIN_EMAILS`                  | Comma-separated list of allowed admin emails |
| `NEXT_PUBLIC_FORMSPREE_ID`      | Formspree dashboard                          |

**3. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Formulário de contato

O formulário usa [Formspree](https://formspree.io/). O ID é configurado via `NEXT_PUBLIC_FORMSPREE_ID` no `.env.local`.
