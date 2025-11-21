# EcoPulse

EcoPulse is a full‑stack sustainability dashboard that helps track energy usage, carbon footprint, climate trends, and curated news. It features authentication with Clerk, a responsive UI with Sidebar/Topbar/Footer, and an Express API. Phases 1–7 are complete and stable; Phase 8 (advanced animations) is deferred for performance.

## Tech Stack

- Frontend: React + Vite, React Router, Tailwind CSS, Axios, Clerk
- Backend: Node.js, Express, Mongoose (MongoDB Atlas)
- Auth: Clerk (PK on client, Secret on server if protecting APIs)
- Deployment: Vercel/Netlify (frontend), Render/Heroku (backend)

## Features

- Authentication with Clerk (Sign in, protected routes)
- Dashboard with charts and stats
- Energy and Carbon logs
- Climate trends and news feed
- Responsive Sidebar, Topbar, and Footer with icons
- Dev mock data toggle to run without a DB (USE_MOCKS=1)
- Production‑ready CORS, rate limiting, and security headers (recommended)

## Project Structure

```
EcoPulse/
├─ client/               # React app (Vite)
│  ├─ src/
│  │  ├─ components/     # UI components + layouts (Sidebar, Topbar, Footer)
│  │  ├─ pages/          # Pages (Dashboard, Energy, Carbon, Blog, etc.)
│  │  ├─ api.js          # Axios instance and API helpers
│  │  ├─ App.jsx         # Routes
│  │  ├─ main.jsx        # App bootstrap (ClerkProvider + Router)
│  │  └─ index.css       # Tailwind base/styles
│  ├─ vite.config.js     # Vite dev server + proxy for /api
│  └─ .env               # Vite env (client-side, VITE_* only)
└─ server/               # Express API
   ├─ controllers/       # Route handlers
   ├─ middleware/        # Auth/CORS/security
   ├─ models/            # Mongoose schemas
   ├─ routes/            # Express routers
   ├─ server.js          # App entry (mocks + real routes)
   ├─ package.json
   └─ .env               # Server env (never commit)
```

## Prerequisites

- Node.js 18+ and npm
- Optional: MongoDB Atlas (for real data; not required when using mocks)
- Clerk account (publishable key for client; secret key for server‑side auth if needed)

## Quick Start (Development)

1) Backend (Express)
```bash
cd server
npm install
# .env (development)
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
USE_MOCKS=1
# If using real DB later:
# MONGODB_URI=mongodb+srv://...
# If protecting APIs with Clerk server-side:
# CLERK_SECRET_KEY=sk_test_...
# For CORS in production (optional in dev):
# FRONTEND_ORIGIN=http://localhost:5174
EOF
npm run dev
```

2) Frontend (React + Vite)
```bash
cd ../client
npm install
# .env (development)
cat > .env << 'EOF'
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
# Optional in dev because Vite proxies /api → 3000:
# VITE_API_BASE_URL=
EOF
npm run dev
```

- Open http://localhost:5174/
- Clerk sign‑in appears in Topbar; protected pages work.
- Dashboard, Energy, Carbon, and Blog load mock data (no 500s).

## Environment Variables

Frontend (client/.env or dashboard UI on Vercel/Netlify):
- VITE_CLERK_PUBLISHABLE_KEY: Clerk publishable key
- VITE_API_BASE_URL: https://your-backend.example.com (set in production; leave empty for Vite proxy in dev)

Backend (server/.env or Render/Heroku dashboard):
- PORT: 3000 (Render may override)
- NODE_ENV: development | production
- USE_MOCKS: 1 (dev with mock data) | 0 (real DB)
- MONGODB_URI: MongoDB Atlas connection string (when USE_MOCKS=0)
- CLERK_SECRET_KEY: Clerk secret (only if you enforce auth in server routes)
- FRONTEND_ORIGIN: https://your-frontend-domain (CORS allowlist for production)

## Development Notes

- Vite dev proxy: client/vite.config.js proxies /api → http://localhost:3000 so the client can call /api/* without hardcoding origins during development.
- Mock data: With USE_MOCKS=1, the server will answer:
  - GET /api/energy
  - GET /api/carbon
  - GET /api/climate
  - GET /api/climate/global
  - GET /api/climate/trend
  - GET /api/news

## Build and Preview (Frontend)

```bash
cd client
npm run build
npm run preview
```

## Deployment (Phase 10)

Backend (Render recommended)
- New Web Service → Root directory: server
- Build command: npm install
- Start command: npm start
- Environment variables: NODE_ENV=production, USE_MOCKS=0, MONGODB_URI, CLERK_SECRET_KEY (if needed), FRONTEND_ORIGIN=https://your-frontend-domain
- After deploy, note API base URL (e.g., https://ecopulse-api.onrender.com)

Frontend (Vercel or Netlify)
- Vercel:
  - Root directory: client
  - Build command: npm run build
  - Output directory: dist
  - Env: VITE_API_BASE_URL=https://ecopulse-api.onrender.com, VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
- Netlify:
  - Base directory: client
  - Build command: npm run build
  - Publish directory: dist
  - Add public/_redirects with “/* /index.html 200” for SPA routing (optional but recommended)

CORS
- On the server, set FRONTEND_ORIGIN to your deployed frontend origin and enable CORS accordingly.

HTTPS
- Vercel/Netlify/Render provide TLS automatically.

## API Overview (selected)

- GET /api/energy → { items: [{ _id, date, kwh, source, notes }] }
- GET /api/carbon → { items: [{ _id, date, kgCO2, category, notes }] }
- GET /api/climate → { labels: string[], values: number[] }
- GET /api/climate/global → { labels, values }
- GET /api/climate/trend → { labels, values }
- GET /api/news → { items: [{ id, title, summary, url, date }] }

Additional modules exist for auth, profile, and logs; see server/routes and server/controllers.

## Scripts

Frontend (client):
- npm run dev – Vite dev server
- npm run build – Production build
- npm run preview – Preview built app locally

Backend (server):
- npm run dev – Nodemon dev server
- npm start – Start server

## Known Status

- Phases 1–7: Complete and stable (the “wow” state).
- Phase 8 (animations/theme toggle): Deferred to avoid app hangs; not included in production build.
- Phase 10 (deployment): Supported; see guide above.

To experiment with Phase 8 later, use a separate branch:
```bash
git checkout -b phase-8-experiments
```

## Troubleshooting

- Error: “SignedIn can only be used within the <ClerkProvider />”
  - Ensure client/src/main.jsx wraps <App /> with <ClerkProvider publishableKey={VITE_CLERK_PUBLISHABLE_KEY} />.
  - Confirm VITE_CLERK_PUBLISHABLE_KEY is set.

- 500 errors from /api/*
  - Start the server first. Use USE_MOCKS=1 during development or configure MONGODB_URI and controllers.
  - In production, confirm CORS FRONTEND_ORIGIN matches the deployed frontend URL.

- Tailwind error: “animate-fade-in class does not exist”
  - Remove any @apply animate-fade-in from client/src/index.css (Phase 8 styles are disabled).

- Only Sidebar renders; content blank
  - Ensure Layout uses <Outlet /> and App.jsx nests routes under a Layout route.

- CORS blocked in production
  - Set FRONTEND_ORIGIN on the server to your deployed frontend origin and redeploy.

## Security

- Enable Helmet, CORS allowlist, and rate limiting in production.
- Use least‑privileged MongoDB user, restrict IPs or use VPC peering, require TLS.
- Use live Clerk keys and restrict allowed origins/redirects in Clerk dashboard.

## Contributing

- Fork and create a feature branch
- Follow the existing file structure and code style
- Open a PR with a clear description and testing steps

## License

MIT. Add a LICENSE file to the repository if not present.