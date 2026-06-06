# BachelorsNest Deployment

## Local Development vs Production

You do not need separate branches to keep localhost work separate from production.

Local development and production are separated by environment variables and separate services:

- Local backend uses `backend/.env`.
- Local frontend uses `frontend/.env`.
- Render backend uses Render environment variables.
- Vercel frontend uses Vercel environment variables.
- Localhost does not talk to production unless you put production URLs in local `.env`.

Production will not change from local edits. It changes only when you push code and Render/Vercel deploy that pushed commit.

Never commit real `.env` files. Local env files are ignored:

- `backend/.env`
- `frontend/.env`
- `frontend/.env.local`
- `frontend/.env.development`
- `frontend/.env.production`

Use `.env.development.example` files for localhost and `.env.deployment.example` files as deployment variable templates only.

## Why `render.yaml` Is In The Root

Render Blueprints are normally discovered from the repository root. This root `render.yaml` still deploys only the backend because it has:

```yaml
rootDir: backend
```

It does not build or deploy the React frontend. It only defines:

- the Django backend web service
- the backend Postgres database
- the Redis/Key Value service needed for Django Channels WebSockets

If you do not want to use a Render Blueprint, you can ignore `render.yaml` and create the Render web service manually with root directory `backend`.

## Backend on Render

Use `render.yaml` from the repository root, or create a Python web service with:

- Root directory: `backend`
- Build command: `bash build.sh`
- Start command: `daphne backend.asgi:application -b 0.0.0.0 -p $PORT`
- Health check path: `/health/`

Required backend services:

- Render Postgres, exposed as `DATABASE_URL`
- Render Key Value/Redis, exposed as `REDIS_URL`

The backend intentionally requires `DATABASE_URL` when `DEBUG=False`, so production cannot accidentally fall back to a local database configuration.

Required backend env vars:

- `DEBUG=False`
- `SECRET_KEY`
- `ALLOWED_HOSTS=your-backend.onrender.com`
- `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`
- `CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app`
- `FRONTEND_URL=https://your-frontend.vercel.app`
- `SECURE_SSL_REDIRECT=True`
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_MEDIA_BUCKET`

The backend must run as ASGI through Daphne so HTTP and WebSocket routes are both served.
Use `backend/.env.deployment.example` as the checklist for Render backend variables.

For local backend development, copy:

```bash
cp backend/.env.development.example backend/.env
```

Then adjust local database credentials as needed.

## Why `vercel.json` Is In `frontend`

Vercel should use `frontend` as the project root. When Vercel’s root directory is `frontend`, it reads `frontend/vercel.json`.

That file only configures frontend SPA routing so browser refreshes on routes like `/login` or `/owner/properties` still load `index.html`.

It does not affect Render or the Django backend.

## Frontend on Vercel

Deploy the `frontend` directory as a Vite app.

Production settings:

- Framework preset: Vite
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Production env:

```env
VITE_API_URL=https://your-backend.onrender.com
```

The frontend builds WebSocket URLs from `VITE_API_URL`, using `wss://` automatically when the backend URL is HTTPS.
Use `frontend/.env.deployment.example` as the checklist for Vercel frontend variables.

For local frontend development, keep `frontend/.env` as:

```env
VITE_API_URL=http://localhost:8000
```

## Production Isolation Checklist

- Render production database is used only by the Render production backend.
- Local backend uses a local/dev database.
- Local frontend points to `http://localhost:8000`.
- Vercel production frontend points to the Render production backend.
- Real `.env` files are ignored and never committed.
