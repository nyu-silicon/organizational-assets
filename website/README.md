# Next Gen Compute — Website

An npm workspaces project with two packages:

- `frontend/`: a minimal static site built with [Vite](https://vite.dev) (plain HTML/CSS/JS)
- `backend/`: a minimal [Express](https://expressjs.com) API, ready to grow

## Getting started

```sh
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001 (requests to `/api/*` from the frontend are proxied there)

## Scripts

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Run frontend and backend together                |
| `npm run dev:frontend` | Run only the frontend dev server                 |
| `npm run dev:backend`  | Run only the API (auto-restarts on changes)      |
| `npm run build`        | Build the frontend to `frontend/dist`            |
| `npm start`            | Serve the API and the built frontend on one port |
| `npm run add-member -w backend -- <email> "<name>"` | Add or update a member (prompts for a password) |

## API

| Route             | Response           |
| ----------------- | ------------------ |
| `GET /api/health` | `{ "status": "ok" }` |
| `POST /api/login` | `{ email, password }` → sets a session cookie |
| `POST /api/logout` | Clears the session cookie |
| `GET /api/dashboard` | Member info and announcements (401 if not signed in) |

Add new routes in `backend/src/index.js`.

## Members

Members live in `backend/data/members.json` (gitignored, passwords hashed with scrypt).
Announcements shown on the dashboard live in `backend/data/announcements.json`.

Sessions are signed with `SESSION_SECRET`, which is required in production.
In development a random secret is used, so sessions reset when the API restarts.

Pages: `/` (home), `/login/`, `/dashboard/`.
