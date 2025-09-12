# VibeScript Website Builder (Multi‑Modal, Cloudflare‑ready)

Next.js App Router + Tailwind + voice (Web Speech API). Deployed on **Cloudflare Workers** using the **OpenNext Cloudflare adapter**.

## Tech
- Next.js 14/15 (App Router)
- Tailwind CSS
- Web Speech API (voice input/output)
- OpenNext Cloudflare adapter (`@opennextjs/cloudflare`)
- Wrangler 3

## Local Setup
```bash
npm install
npm run dev
```

## Environment variables
Create `.env.local` (local) and Cloudflare secrets later as needed:
```ini
NEXT_PUBLIC_APP_NAME=VibeScript Website Builder
NEXT_PUBLIC_VOICE_ENABLED=false
NEXT_PUBLIC_ANALYTICS_ENABLED=true
VIBESCRIPT_API_KEY=
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
ELEVENLABS_API_KEY=
```

## Cloudflare (OpenNext) scripts
- `npm run preview` – build + local preview in Workers runtime
- `npm run deploy` – build + deploy to Cloudflare Workers
- `npm run upload` – build + upload a new version to Cloudflare

## Notes
- The adapter currently targets the Node runtime; avoid `export const runtime = "edge"`.
- `.open-next` is generated at build and is git‑ignored.

## Project Structure
```
/app
  /api
  layout.tsx
  page.tsx
/components
  MultiModalInterface.tsx
/lib
  voice.ts
/public
  _headers
```

## Deploy via GitHub + Cloudflare
1) Push this repo to GitHub.
2) Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Connect to Git** (Workers).
3) Select your repo.
4) Confirm build uses OpenNext adapter (Cloudflare will run your repo’s `deploy` script or default builder).
5) After first deploy, attach your custom domain (e.g., `vibescript.online`) to the Worker in **Settings → Domains & Routes**.

For Pages (legacy) SSR: you *can* use the Pages Next.js preset, but the recommended path is Workers + OpenNext.

---
🛠 Like for like swap: once the Worker is live, re‑point `vibescript.online` from your existing Pages site to the new Worker.
