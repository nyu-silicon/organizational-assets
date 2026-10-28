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

## API

| Route             | Response           |
| ----------------- | ------------------ |
| `GET /api/health` | `{ "status": "ok" }` |

Add new routes in `backend/src/index.js`.
