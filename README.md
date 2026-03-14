# Personal Inner Studio (Next.js 14)

This project is a calm personal website for:

- books you are reading
- blog writing
- inner notes
- things you have done

It is intentionally **not** a resume-first template.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Markdown content in `content/blog/*.md`

## Run

```bash
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Build check

```bash
npm run lint
npm run build
```

## Main pages

- `/` Home
- `/about`
- `/books`
- `/blog`
- `/blog/[slug]`
- `/projects` (things done)
- `/write` (quick import entry)
- `/contact`

## Where to edit your real content

- `data/profile.ts` -> your 3-line intro, email, social
- `data/life.ts` -> current books, heart notes, timeline
- `data/projects.ts` -> things done
- `content/blog/*.md` -> blog posts

## Easy text import (for non-technical use)

Open `/write`:

1. Paste your text
2. Select type
3. Copy generated markdown
4. Send it to your assistant (or save as `.md`)

This is the easiest way to keep publishing without touching code.

