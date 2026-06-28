# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

YourCodeMate is a coding-education platform for beginners. It is a monorepo split into two independently-installed packages:

- `client/` — React 18 + TypeScript + Vite SPA (port **3000**)
- `server/` — Express 5 + MongoDB (Mongoose) REST API + Socket.IO (port **8080**)

There is no root-level package manager; install and run each package separately. The project uses **pnpm** (`packageManager` pinned in `server/package.json`), but npm/yarn also work.

## Commands

### Server (`cd server`)
- `pnpm install` — install dependencies
- `pnpm start` — run with nodemon (`app.js`, ES modules). There is **no build step** and **no test/lint script** configured.
- Seed scripts are standalone Node entrypoints that connect via `DBURI` and exit, e.g. `node seed_full_data.js`, `node scripts/seedLanguages.js`, `node scripts/seedContests.js`, `node scripts/seedPythonTopics.js`. Run them directly with `node <file>` after env is configured.

### Client (`cd client`)
- `pnpm install` — install dependencies
- `pnpm dev` — Vite dev server on port 3000
- `pnpm build` — `tsc && vite build` (type-check then bundle to `dist/`)
- `pnpm preview` — serve the production build
- `pnpm lint` — ESLint over `ts,tsx` with `--max-warnings 0`

There is no test runner in either package.

## Environment

Server reads (via `dotenv`) a `.env` in `server/`:
- `DBURI` — MongoDB connection string (**required**; process exits if missing, see `utils/dbConnect.js`)
- `JWT_SECRET` — signing secret for auth tokens
- `GROQ_API_KEY` — Groq LLM key (AI mentor, hints, evaluation, interview)
- `PORT` (default 8080), `NODE_ENV`, `ALLOWED_ORIGINS` (comma-separated CORS origins), `FRONTEND_URL` (Socket.IO CORS)
- Also referenced for notifications: nodemailer (`utils/sendEmail.js`) and Twilio (`utils/sendSMS.js`)

Client reads `VITE_API_URL` (defaults to `http://localhost:8080`). Note `client/README.md` shows port 5000 — the actual default is 8080. The `@` import alias maps to `client/src` (configured in both `vite.config.ts` and `tsconfig.json`).

## Architecture

### Server request flow
`app.js` is the single composition root. It builds one `apiRouter`, mounts every feature router onto it, then mounts the whole thing under **`/api`**. So every endpoint is `/api/<feature>/...`. Some routers are mounted with a path prefix (`/api/auth`, `/api/test`, `/api/admin`, etc.) and some are mounted bare onto `apiRouter` (their full paths live inside the route file — e.g. `ideRoutes`, `codingTestRoutes`, `aiMentorRoutes`). When adding an endpoint, check how its router is mounted in `app.js` before assuming the prefix.

The standard layering is **route → controller → Mongoose model**:
- `routes/` — thin Express routers; wire paths + middleware to controller functions
- `controllers/` — all business logic (one controller per feature, ~24 of them)
- `models/` — Mongoose schemas
- `middleware/authMiddleware.js` — `protect` (verifies `Bearer` JWT, loads `req.user` minus password) and `adminOnly` (checks `req.user.isAdmin`). Protected/admin routes apply these in the route file.
- `utils/` — cross-cutting helpers: `dbConnect.js` (auto-connects on import as a side-effect — note it is imported for effect in `app.js`, not called), `groqClient.js` (shared Groq SDK singleton), `sendEmail.js`, `sendSMS.js`

`app.js` also starts an HTTP server wrapping Express and attaches **Socket.IO** for realtime chat/rooms (`join_room` / `leave_room` / `send_message` / `receive_message`) on the **default namespace**. In `NODE_ENV=production` the server additionally serves the built client from `../client/dist` and SPA-falls-back to `index.html` for non-`/api`, non-`/socket.io` paths.

### Realtime collaboration (Yjs)
`app.js` attaches **`y-socket.io`** (`new YSocketIO(io).initialize()`) to the same Socket.IO server. It serves Yjs CRDT documents over **dynamic `/yjs|<room>` namespaces**, fully isolated from the default chat namespace. The client `Collaborate` page (`/collab`, `/collab/:roomId`) uses `SocketIOProvider` + a custom, fully-typed `YjsMonacoBinding` (`client/src/lib/yjsMonacoBinding.ts`) that binds a shared `Y.Text` to the app's existing Monaco instance (from `@monaco-editor/react`'s `onMount`) — no second Monaco copy, no CDN dependency. Awareness carries presence (`user`) and JSON-safe cursor offsets.

**Socket URL gotcha:** `VITE_API_URL` includes the `/api` REST prefix, but Socket.IO/Yjs must connect to the **origin** (no path), or namespaces resolve to `/api/...` and never match. Always derive it via `getServerOrigin()` in `client/src/utils/socket.ts`; the shared reconnecting socket singleton lives there too (`getSocket()` / `disconnectSocket()`).

`utils/dbConnect.js` retries with exponential backoff and does **not** kill the process on a DB error (only on a missing `DBURI`), so realtime features survive a transient DB/Atlas-whitelist outage.

### AI features
AI is powered by **Groq** (not OpenAI, despite both SDKs being in dependencies). All AI controllers import the shared client from `utils/groqClient.js`. Models in use: `llama-3.1-8b-instant` (fast paths) and `llama-3.3-70b-versatile` (evaluation/quality paths). AI surfaces live in `aiMentorController`, `aiController`, `hintController`, `interviewController`.

### Code execution (IDE)
`controllers/ideController.js` (`runCode`) executes user-submitted code in-process by writing a temp file to the OS temp dir and `spawn`-ing a language runtime/compiler (python3, node, ts-node, ruby, swift, g++, rustc, javac), with a 10s timeout. Java is special-cased: the public class name is rewritten to match a generated unique filename. The host running the server must have these toolchains installed for the corresponding languages to work.

### Client structure
`src/utils/api.ts` is the single Axios instance: it sets `baseURL` from `VITE_API_URL`, injects the JWT from `localStorage` on every request, and on `401` only force-redirects to `/login` for critical (`/me`, `/auth`) calls — a `silentFail` request flag suppresses redirects for background calls. `src/services/api.ts` defines typed, per-feature API method groups (`authApi`, `userApi`, `codingTestApi`, `ideApi`, …) built on top of that instance — add new endpoint wrappers here. App-wide state is via React Context (`AuthContext`, `ThemeContext`); server state is via React Query. Routing/pages are under `src/pages/`, guarded by `ProtectedRoute`/`AdminRoute`.

## Conventions

- Server is **ES modules** (`"type": "module"`); use `import`/`export` and include `.js` extensions in relative imports.
- One controller + (usually) one route file per feature; keep business logic in controllers, not routes.
- The `User` model `pre("save")` hashes passwords with bcryptjs — don't double-hash in controllers.
