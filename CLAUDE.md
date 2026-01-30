# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Anonymous idea submission and voting platform for UAB (University of Alabama at Birmingham). A static single-page application using vanilla JavaScript with Supabase for real-time database functionality.

## Development

No build process required. Serve statically:

```bash
python -m http.server 8000
# or
npx http-server -p 8000
```

Access at http://localhost:8000

## Architecture

```
js/
├── config.js    # Supabase client, voter ID management, profanity filter
├── app.js       # Core logic: idea submission, voting, real-time subscriptions
└── ui.js        # DOM rendering, FLIP animations, notifications
```

**Data flow**: Browser generates voter ID (localStorage) → User submits idea → Profanity check → CAPTCHA validation → Supabase insert → Real-time subscription notifies all clients → UI re-renders with FLIP animations

## Key Technologies

- **Supabase**: PostgreSQL database with real-time subscriptions via WebSocket
- **Cloudflare Turnstile**: CAPTCHA (site key in index.html line 175)
- **Tailwind CSS**: Via CDN with `tw-` prefix to avoid conflicts
- **UAB Brand Colors**: UAB Green (#1A5632), defined in index.html Tailwind config

## Database Schema

Two tables with RLS enabled:
- `ideas`: id, content, created_at, vote_count
- `votes`: id, idea_id, voter_fingerprint, created_at (unique constraint on idea_id + voter_fingerprint)

Vote count is incremented via PostgreSQL trigger on vote insert.

## Credentials Location

- Supabase URL and key: `js/config.js`
- Turnstile site key: `index.html` (line 175)

## Joomla Integration

The `joomla-embed.html` file is a self-contained single-file version for embedding in Joomla. See README.md for four different embedding options.

## UAB Design System

See `SKILL.md` for UAB brand guidelines including:
- Color palette (UAB Green, Dragon's Lair Green, Campus Green, Loyal Yellow, Smoke Gray)
- Typography (Aktiv Grotesk for body, Kulturista for headlines)
- Tailwind utility classes for UAB components
