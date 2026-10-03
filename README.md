# Portify AI

An AI-powered portfolio builder. Import a resume, let AI write your content, pick a template, publish a shareable portfolio.

## Structure

```
portify-ai/
├── apps/
│   ├── server/        Express + TypeScript API (auth, portfolios, AI, resume import)
│   └── web/            React + Vite frontend (landing, editor, public portfolio pages)
├── packages/
│   └── shared/         Shared TypeScript types + Zod validation used by both apps
└── package.json        npm workspaces root
```

## Quick start

```bash
npm install
cp apps/server/.env.example apps/server/.env   # fill in MongoDB URI + secrets
npm run build:shared
npm run dev     # runs server on :4000 and web on :5173
```

Without `AI_API_KEY` set, the server automatically uses a built-in mock AI provider so every
AI-assist feature works out of the box with zero external dependencies. Set `AI_API_KEY` in
`apps/server/.env` to switch to OpenAI.

Without `MONGODB_URI` pointing at a reachable database, the server still boots in a degraded
dev mode (useful for exploring the frontend), but auth/portfolio endpoints need a real database
to persist data. A free MongoDB Atlas cluster works well.

## Scripts

- `npm run dev` — run server + web concurrently
- `npm run build` — build shared, server, and web for production
- `npm run typecheck` — typecheck server and web

## Deployment

- **Frontend** (`apps/web`): deploy the Vite build output (`apps/web/dist`) to Vercel, Netlify, or any static host.
- **Backend** (`apps/server`): deploy the `dist/index.js` bundle (built with tsup) to Render, Railway, Fly.io, or a container platform like Google Cloud Run. Set the env vars from `.env.example`.
- **Database**: MongoDB Atlas free tier.

### Deploying the backend to Google Cloud Run (example)

```bash
cd apps/server
npm run build
cat > Dockerfile <<'EOF'
FROM node:18-slim
WORKDIR /app
COPY dist ./dist
COPY package.json ./
RUN npm install --omit=dev
EXPOSE 4000
CMD ["node", "dist/index.js"]
EOF
gcloud run deploy portify-ai-server --source . --region us-central1 --allow-unauthenticated
```
