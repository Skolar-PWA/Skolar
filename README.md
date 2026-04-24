# Skolar (EduPortal)

A school website for Pakistan. Built by us 4 friends.

---

## 🖥️ How to run it on your computer (first time)

### Step 1: Install these 3 programs

| What | Where | Why |
| --- | --- | --- |
| **Node.js** (version 20 or newer) | https://nodejs.org | Runs JavaScript code |
| **pnpm** | After Node is installed, open terminal and type:<br>`npm install -g pnpm` | A faster way to install code libraries |
| **Docker Desktop** | https://www.docker.com/products/docker-desktop | Runs the database on your computer |

### Step 2: Open Docker Desktop

Just open the Docker app. Wait until it says "Docker Desktop is running" (maybe 1 minute).
Then leave it running in the background.

### Step 3: Open terminal in this folder and run these (one by one)

```
pnpm install
pnpm db:up
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```

What each one does:

- `pnpm install` — downloads all the code libraries we need (only needed first time or when something changes)
- `pnpm db:up` — starts the database
- `pnpm prisma:migrate` — creates the tables in the database
- `pnpm prisma:seed` — adds some fake data so we can test
- `pnpm dev` — starts the website

### Step 4: Open these in your browser

- Main app (dashboard): http://localhost:5173
- Landing page: http://localhost:5174
- Backend API (for testing): http://localhost:4000/api/docs

### Step 5: Log in

On the dashboard login page, use:

- Email: `admin@demo.pk`
- Password: `password123`

---

## 🛑 How to stop everything

1. In the terminal running `pnpm dev`, press **Ctrl + C**
2. Then type: `pnpm db:down` (this stops the database)

---

## 🔁 Every time you want to work (not first time)

Just 2 commands:

```
pnpm db:up
pnpm dev
```

That's it. You don't need to run install / migrate / seed every day.

---

## 📁 What the folders mean

| Folder | What it is |
| --- | --- |
| `apps/api` | The brain (server). Handles login, data, saving stuff. |
| `apps/web` | The dashboard you see after logging in. |
| `apps/landing` | The marketing home page (before login). |
| `packages/shared` | Code used by both the brain and the dashboard. |
| `packages/ui` | Buttons, cards, forms — reusable pieces. |

---

## 👥 Working with your 3 friends using GitHub

Think of GitHub like Google Drive, but for code.

- Everyone has the same folder on their computer
- When you change something, you **upload** it (push)
- When your friends change something, you **download** it (pull)

### Every time you sit down to code:

**Step 1 — Download what your friends changed:**

```
git pull
```

**Step 2 — Do your work, test it.**

**Step 3 — Upload your changes:**

```
git add .
git commit -m "what you did in short"
git push
```

Example of a good commit message:

- `"added login page design"`
- `"fixed button color on dashboard"`
- `"added fees page"`

### ⚠️ One important rule

**Before you start working, always run `git pull` first.**

If you skip this and your friend changed the same file, Git will shout at you with a "merge conflict" — annoying. So always pull first.

### If two people work on the same file

Tell each other in WhatsApp before you start. That's the easiest fix.

---

## 🆘 When something breaks

Try in this order:

1. **Close terminal, open it again.** (fixes 30% of problems)
2. Run these 3 commands:
   ```
   pnpm install
   pnpm db:up
   pnpm dev
   ```
3. **Database looks weird?** Reset it (this wipes data and puts fake data back):
   ```
   pnpm --filter @eduportal/api exec prisma migrate reset
   ```
4. **Still broken?** Copy the FULL error message and paste it in the WhatsApp group. Don't just say "it's not working".

---

## 🤖 CI — the auto-checker robot

Every time someone pushes code to GitHub, a robot automatically:

1. Downloads your code on a fresh computer (GitHub provides it free)
2. Runs `pnpm install`
3. Checks TypeScript has no errors (`pnpm typecheck`)
4. Tries to build everything (`pnpm build`)
5. Shows a **green tick ✅** (good) or **red cross ❌** (broken) next to the commit on GitHub

If it's red, GitHub **emails** whoever pushed. Fix it fast — broken `main` blocks everyone.

**The rules for this robot are in `.github/workflows/ci.yml`** — open that file, every line has a comment. Read it like a recipe.

### Where to see it run

1. Push some code to GitHub
2. On github.com, open your repo
3. Click the **Actions** tab at the top
4. You'll see a list. The newest one is at the top. Click it to see what happened.

A green tick = your code is healthy. A red cross = click it, scroll down, read the error, fix it.

**Takes about 2 minutes per run.** Costs nothing — GitHub gives it free for public repos and generously for private ones.

---

## 🔑 Where secrets live

Two files: `apps/api/.env` and `apps/web/.env`

These are **not** uploaded to GitHub (they have passwords). If a teammate just cloned the repo, they'll need to create these files. Copy from `apps/api/.env.example` and `apps/web/.env.example` — the examples are already in the repo.

---

## 📖 Curious WHY we use these tools?

Open `GUIDE.md` in the project root. It's a relaxed, plain-English explanation of every tool: **pnpm, Turborepo, Docker, Prisma, React, Vite, everything**. Read it when you're curious, not urgently.

That file answers questions like:

- Why one big folder instead of separate repos?
- Why not just use `npm`?
- Why run the database in Docker instead of installing it normally?
- What does Prisma actually do?

No rush to read it — `README.md` (this file) is enough to get work done. `GUIDE.md` is for understanding.

---

That's everything. If you ever feel lost, read this file again. No other docs to worry about.
