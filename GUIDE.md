# 📚 Why we use what we use

A plain-English tour of every major tool in this project.
**Read this when you're curious, not urgently.** Your day-to-day is covered in `README.md`.

> Each section answers 3 questions:
> **What is it?** — explained like a friend, no jargon
> **Why did we pick it?** — vs alternatives, in plain words
> **Where is it in our code?** — so you can go look at real examples

---

## Contents

1. [Monorepo (one folder, many apps)](#1-monorepo-one-folder-many-apps)
2. [pnpm (installs our libraries)](#2-pnpm-installs-our-libraries)
3. [pnpm workspaces (share code between apps)](#3-pnpm-workspaces-share-code-between-apps)
4. [Turborepo (runs things in parallel)](#4-turborepo-runs-things-in-parallel)
5. [Docker + docker-compose (database in a box)](#5-docker--docker-compose-database-in-a-box)
6. [TypeScript (JavaScript with safety belts)](#6-typescript-javascript-with-safety-belts)
7. [NestJS (the backend framework)](#7-nestjs-the-backend-framework)
8. [Prisma (talks to the database)](#8-prisma-talks-to-the-database)
9. [PostgreSQL (the database)](#9-postgresql-the-database)
10. [JWT (how login works)](#10-jwt-how-login-works)
11. [Vite (runs the frontend super fast)](#11-vite-runs-the-frontend-super-fast)
12. [React (builds the UI)](#12-react-builds-the-ui)
13. [TanStack Query (loads data from the API)](#13-tanstack-query-loads-data-from-the-api)
14. [Zustand (remembers login info)](#14-zustand-remembers-login-info)
15. [Framer Motion (animations)](#15-framer-motion-animations)
16. [React Hook Form + Zod (forms that don't break)](#16-react-hook-form--zod-forms-that-dont-break)
17. [PWA / Workbox (works offline)](#17-pwa--workbox-works-offline)
18. [Recharts (graphs and charts)](#18-recharts-graphs-and-charts)
19. [tsup (compiles our shared code)](#19-tsup-compiles-our-shared-code)

---

## 1. Monorepo (one folder, many apps)

### What is it?
Instead of making 3 separate GitHub repos for the API, the web app, and the landing page, we put **all 3 in one folder**. That's a "monorepo" (mono = one, repo = repository).

```
Skolar/
├── apps/
│   ├── api/          ← the backend
│   ├── web/          ← the dashboard
│   └── landing/      ← the marketing page
└── packages/
    ├── shared/       ← code shared by all 3
    └── ui/           ← buttons/cards used by web + landing
```

### Why did we pick it?
**The alternative:** 3 separate GitHub repos. Every time you change something shared (like a button or a type), you'd have to update it in all 3 places separately. That's slow and easy to mess up.

**With a monorepo:** Change one file, **everyone uses the new version immediately**. No copy-paste. No syncing.

### Where is it in our code?
Look at the root folder — that's your monorepo. The trick that makes it work is in `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

That tells pnpm "these are all linked together."

---

## 2. pnpm (installs our libraries)

### What is it?
A tool that installs code libraries (like React, NestJS, etc.) into your project. It's an alternative to **npm** (which comes with Node.js) and **yarn**.

When you type `pnpm install`, it reads `package.json` files, downloads all the libraries, and puts them in `node_modules/`.

### Why did we pick it?
vs npm and yarn:

- **Much faster.** pnpm installs are 2-3x quicker.
- **Uses way less disk space.** npm copies the same library into every project separately. If you have 10 projects all using React, that's React downloaded 10 times. pnpm downloads it **once** and shares it (using symlinks — fake shortcuts).
- **Best at monorepos.** Handles our "3 apps sharing packages" setup perfectly. Others struggle.

### Where is it in our code?
- Version is pinned in `package.json` under `"packageManager": "pnpm@9.15.9"` — that way everyone on the team uses the exact same version.
- Lock file is `pnpm-lock.yaml` — it records the exact version of every library. **Never edit this file by hand.** Just commit it when it changes.

---

## 3. pnpm workspaces (share code between apps)

### What is it?
A feature of pnpm that lets multiple apps in a monorepo share code.

In our project:
- `apps/api` imports from `@eduportal/shared` → it gets the code from `packages/shared/`
- `apps/web` imports from `@eduportal/ui` → it gets the code from `packages/ui/`

No npm publishing. No copying files. It just works.

### Why did we pick it?
Because we need to share types, enums, and UI components between our 3 apps. Without workspaces, we'd have to:
- Publish shared packages to a private npm registry (complicated + costs money)
- Or copy-paste code everywhere (terrible)

Workspaces give us "internal libraries for free".

### Where is it in our code?
Any `package.json` that has dependencies like `"@eduportal/shared": "workspace:*"`.

The `workspace:*` bit means "use whatever version is in this monorepo, don't look on the internet."

---

## 4. Turborepo (runs things in parallel)

### What is it?
A tool that runs scripts across all your apps **smartly**.

Without Turbo, if you type `pnpm build`, each app builds one after another — slow.

With Turbo, it:
1. Figures out which apps depend on which (like "api needs shared to build first")
2. Runs everything in the right order
3. Runs things **in parallel** where it can
4. **Caches results** — if nothing changed in an app, it skips rebuilding it

### Why did we pick it?
Speed. `pnpm build` for our whole project takes ~30 seconds cold. With Turbo cache, if nothing changed, it takes **2 seconds** because it just replays the cached output.

Also, it's made by Vercel (trusted company) and works perfectly with pnpm workspaces.

### Where is it in our code?
- Config is in `turbo.json`
- It defines "tasks" like `build`, `dev`, `typecheck`
- Each task can say "I need X to finish first" with `dependsOn: ["^build"]`

When you type `pnpm dev` at the root, Turbo is actually running it. You can see it print:

```
• Packages in scope: @eduportal/api, @eduportal/landing, @eduportal/shared, @eduportal/ui, @eduportal/web
• Running dev in 5 packages
```

---

## 5. Docker + docker-compose (database in a box)

### What is Docker?
Docker is like a tiny, pre-built Linux computer that lives **inside your computer**.

You tell Docker: "I need PostgreSQL," and Docker downloads a ready-to-run PostgreSQL inside a "container" (a sealed box). You don't install PostgreSQL on your actual computer — it lives inside the container.

### Why not install PostgreSQL normally?
- **Installation is painful.** Different steps on Windows, Mac, Linux. Version mismatches. Permissions. Config files. Nightmare.
- **Works the same for everyone.** With Docker, all 4 of us have *exactly* the same PostgreSQL setup. No "works on my machine" problems.
- **Easy to wipe and restart.** Delete the container, create a new one. Fresh database in 30 seconds. Try that with a normal install.

### What is docker-compose?
Docker lets you run one container. `docker-compose` lets you describe **multiple** containers in one YAML file and start them all together.

We use it to run Postgres + Redis with one command (`pnpm db:up`).

### Where is it in our code?
- `docker-compose.yml` at the root — describes our Postgres and Redis containers.
- `pnpm db:up` runs `docker compose up -d` (the `-d` means "in the background").
- `pnpm db:down` stops them.
- Data is saved in a Docker volume called `postgres_data` — so your data survives restarts.

---

## 6. TypeScript (JavaScript with safety belts)

### What is it?
JavaScript, but you say ahead of time what type each variable is:

```ts
// plain JavaScript — no idea what 'age' should be
function isAdult(age) {
  return age >= 18;
}

// TypeScript — tells you 'age' must be a number
function isAdult(age: number): boolean {
  return age >= 18;
}
```

If you pass a string like `"eighteen"` to the TS version, TS stops you **before the code even runs**.

### Why did we pick it?
Real life example: without TS, you call `user.phone` in one place and `user.phoneNumber` in another. Code breaks in production. User sees an error.

With TS: the editor **immediately** underlines the wrong one in red. You fix it before you even save. Saves hours of bug hunting.

### Where is it in our code?
Basically every `.ts` and `.tsx` file. Settings are in `tsconfig.base.json` (the root one that all apps extend from). Run `pnpm typecheck` to check all types across the project.

---

## 7. NestJS (the backend framework)

### What is it?
A framework for building backends with Node.js + TypeScript. Heavily inspired by Angular (if you've used that).

It organizes code into **modules** (a group of related features), **controllers** (handle incoming HTTP requests), and **services** (the actual logic).

Example:

```ts
// students.controller.ts — what happens when someone calls GET /students
@Get()
listStudents() {
  return this.studentsService.findAll();
}

// students.service.ts — the actual logic
findAll() {
  return this.prisma.student.findMany();
}
```

### Why did we pick it?
Alternatives were **Express** (too bare-bones, you'd build everything yourself) and **Fastify** (similar to Express).

NestJS gives us:
- Structure (so 4 devs don't write 4 different styles)
- Built-in dependency injection (fancy way of saying "things that need each other get wired up automatically")
- First-class TypeScript support
- Auto-generated API docs (Swagger, at `/api/docs`)

### Where is it in our code?
All of `apps/api/src/`. Main entry is `main.ts`.

---

## 8. Prisma (talks to the database)

### What is it?
A library that lets you talk to a database by writing **TypeScript** instead of SQL.

```ts
// Instead of: "SELECT * FROM students WHERE grade = 10"
const students = await prisma.student.findMany({
  where: { grade: 10 }
});
```

It also gives you **autocomplete** — your editor shows exactly what fields exist on every table. Can't typo a column name.

### Why did we pick it?
vs raw SQL:
- TypeScript-safe (no typos)
- Autocomplete in editor
- Easy migrations (schema changes tracked in git)

vs other ORMs (TypeORM, Sequelize):
- Much simpler API
- Better TypeScript experience
- The best docs in the business

### Where is it in our code?
- Schema (describes tables): `apps/api/prisma/schema.prisma`
- Migrations (database change history): `apps/api/prisma/migrations/`
- Used in services: `this.prisma.student.findMany(...)`

When you change the schema, run:
```
pnpm prisma:migrate
```

That creates a new migration file AND updates your local database to match.

---

## 9. PostgreSQL (the database)

### What is it?
A database. Stores all our data — students, attendance, fees, etc. — on disk, organized into tables.

### Why did we pick it?
vs MySQL: PostgreSQL is more modern, handles complex queries better, has better JSON support (we use this), and is the industry standard for new projects.

vs MongoDB (NoSQL): Our data is **relational** (students belong to classes, classes belong to schools). SQL databases like Postgres handle relationships natively. MongoDB would be fighting the problem.

### Where is it in our code?
- Runs in Docker (see section 5)
- Schema defined in Prisma (see section 8)
- Data URL in `apps/api/.env` → `DATABASE_URL=postgresql://...`

---

## 10. JWT (how login works)

### What is it?
**JWT = JSON Web Token.** A long string of characters that proves "this user is logged in."

When you log in:
1. Server checks your password
2. Server creates a JWT (a signed token that says "this is user 123, they have role 'admin', valid for 15 minutes")
3. Server sends the JWT to your browser
4. Every future request, your browser sends the JWT back → server knows who you are

### Why did we pick it?
vs server-side sessions (cookies stored in a database):
- No database lookup on every request — the token itself has the info
- Scales better across multiple servers
- Works well with mobile apps (not just browsers)

### Where is it in our code?
- Login endpoint: `apps/api/src/auth/auth.controller.ts`
- Token generation: `auth.service.ts`
- Token verification: `apps/api/src/auth/strategies/jwt.strategy.ts`
- Secrets in `.env`: `JWT_SECRET` and `JWT_REFRESH_SECRET`

---

## 11. Vite (runs the frontend super fast)

### What is it?
A tool that runs your React app while you're developing. When you save a file, the browser **instantly** shows the change — no page reload.

### Why did we pick it?
vs Create React App (the old default): CRA takes 20+ seconds to start. Vite starts in **2 seconds**.

vs Webpack (what CRA uses): Webpack processes ALL files every time. Vite only processes the file you actually opened. Much faster.

Vite is made by the same people who made Vue (different framework, but they know what they're doing).

### Where is it in our code?
- `apps/web/vite.config.ts` — config for the dashboard
- `apps/landing/vite.config.ts` — config for the landing page
- Dev server starts when you type `pnpm dev`

---

## 12. React (builds the UI)

### What is it?
A JavaScript library for building user interfaces. You write **components** (reusable pieces of UI) and React handles turning them into actual HTML on the page.

```tsx
function WelcomeCard({ name }: { name: string }) {
  return <div>Hello, {name}!</div>;
}
```

### Why did we pick it?
Everyone uses it. Your 3 teammates can google any React question and find 10,000 answers. The ecosystem (libraries, tutorials, Stack Overflow) is massive. Hiring future devs is easy because most know React.

vs Vue, Svelte: equally good, smaller community. We picked React for the ecosystem.

### Where is it in our code?
Every `.tsx` file in `apps/web/src/` and `apps/landing/src/`.

---

## 13. TanStack Query (loads data from the API)

### What is it?
Handles "calling the API and showing the result" for you. Handles loading states, caching, refetching, errors — all the annoying parts.

Without TanStack Query:
```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('/api/students')
    .then(r => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

With TanStack Query:
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['students'],
  queryFn: () => fetch('/api/students').then(r => r.json()),
});
```

Plus it **caches** — if you navigate away and come back, it shows the old data instantly while silently refreshing.

### Why did we pick it?
Industry standard for React data fetching. Saves probably 30% of the time you'd spend on "making the API call work properly."

### Where is it in our code?
Any `useQuery` or `useMutation` call in `apps/web/src/pages/`.

---

## 14. Zustand (remembers login info)

### What is it?
A small library for storing "global state" — data that multiple components need to know about, like the logged-in user.

```ts
const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Anywhere in any component:
const user = useAuthStore((s) => s.user);
```

### Why did we pick it?
vs Redux (the old default): Redux is 10x more code for the same result. Boilerplate hell.

vs React Context: Context works but causes performance issues on big apps. Zustand is faster.

Zustand is tiny (~1kb) and dead simple.

### Where is it in our code?
- `apps/web/src/store/auth.ts` — the only store so far
- Used in the app shell and login page to know who's logged in

---

## 15. Framer Motion (animations)

### What is it?
A library that makes smooth animations in React easy. Instead of fighting with CSS `@keyframes`, you write:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Hello
</motion.div>
```

Element fades in + slides up. Done.

### Why did we pick it?
Modern UIs feel cheap without animation. Framer Motion is the best React animation library by a wide margin — easy to use, performant, handles lists/reorders/gestures.

### Where is it in our code?
- Login page entrance animations
- Route transitions (when you change pages)
- Button hover/tap effects
- Many places in `apps/web/src/pages/`

---

## 16. React Hook Form + Zod (forms that don't break)

### What are they?

**React Hook Form** = handles form state (what you typed, when you submitted, validation errors).

**Zod** = defines what shape data should have:

```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
```

Zod validates the form. React Hook Form wires it up to your inputs.

### Why did we pick them?
- Forms are where most bugs hide. These two libraries prevent a whole class of them.
- Zod schemas can be **shared** between frontend and backend — define once, validate everywhere.

### Where is it in our code?
- Login form: `apps/web/src/pages/auth/LoginPage.tsx`
- Any form we add in future

---

## 17. PWA / Workbox (works offline)

### What is a PWA?
**PWA = Progressive Web App.** A fancy name for "a website that behaves like an app":
- Can be installed on your phone home screen
- Has an app icon
- **Works even without internet**

### Why does offline matter for us?
Teachers in Pakistan may have spotty internet. A teacher marking attendance shouldn't lose their work if wifi dies. With offline support, they mark attendance on the phone → it saves locally → syncs to the server when internet returns.

### How does it work?
- **Service Worker** = a background script that runs in the browser even when the page is closed. Can intercept network requests.
- **Workbox** = a Google library that makes service workers easy. Caches files, manages offline sync.
- **IndexedDB** = a database *inside the browser* where we store queued attendance submissions until we're online.

### Where is it in our code?
- `apps/web/vite.config.ts` — PWA plugin config
- `apps/web/src/services/offline/attendanceQueue.ts` — our offline queue
- `apps/web/public/manifest.webmanifest` — app metadata (icon, name, colors)

---

## 18. Recharts (graphs and charts)

### What is it?
A library for making charts in React. Bar charts, line charts, pie charts, etc.

```tsx
<BarChart data={attendanceData}>
  <Bar dataKey="present" fill="#4caf50" />
</BarChart>
```

### Why did we pick it?
vs Chart.js: Recharts is React-native (built specifically for React), easier to customize.

vs D3.js: D3 is more powerful but MUCH more code.

For dashboards, Recharts is the sweet spot.

### Where is it in our code?
- Dashboard page: `apps/web/src/pages/DashboardPage.tsx`
- Any future analytics pages

---

## 19. tsup (compiles our shared code)

### What is it?
A tool that takes our TypeScript code in `packages/shared/src/` and compiles it to regular JavaScript in `packages/shared/dist/`.

### Why do we need it?
The API (NestJS) runs on Node.js. Node.js can't read `.ts` files directly — it needs `.js`. So before the API can use `packages/shared`, we have to compile it.

tsup does this in **under 1 second** (much faster than plain TypeScript compiler). It also produces both **CommonJS** (for Node/NestJS) and **ESM** (for Vite/web/landing) in one step.

### Where is it in our code?
- `packages/shared/tsup.config.ts` — config file
- `packages/shared/package.json` has a `"build": "tsup"` script
- When you run `pnpm dev` at the root, Turbo automatically builds shared first

---

## That's it

Every tool we use, explained. When you hit something weird in the code, come back here, read the section, and you'll understand what's going on.

**Not covered here on purpose:**
- CI/CD — covered briefly in `README.md`
- Deployment — we'll add when we're ready to go live

If a tool ever confuses you, message the team group and say:
> "Can someone explain why we use X?"

Don't suffer in silence. 🙏
