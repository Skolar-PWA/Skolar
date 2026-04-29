# EduPortal — SURGICAL UI FIX PROMPT
# This is not a suggestion. Apply every rule exactly as written. No interpretation.

---

## PROBLEMS TO FIX (be very specific when searching for these in the codebase)

1. Sidebar is DARK NAVY — make it WHITE
2. Content area has a narrow max-width container — REMOVE IT, content must fill the full available width
3. Cards have no shadow and look flat — add proper shadows
4. Page background is wrong — must be #F8FAFC not white or dark
5. Typography has no hierarchy — fix font weights and sizes
6. Students page is empty void — fix the layout structure
7. Nothing matches the landing page color palette — fix all colors

---

## STEP 1 — GLOBAL CSS VARIABLES
Find your global CSS file (index.css, globals.css, or App.css) and REPLACE all color/spacing variables with exactly these. Do not keep any old variables:

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* Core */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'DM Sans', sans-serif;

  /* Page */
  --bg-page: #F0F4F8;
  --bg-surface: #FFFFFF;
  --bg-input: #F1F5F9;

  /* Sidebar — ALL WHITE */
  --sidebar-width: 240px;
  --sidebar-bg: #FFFFFF;
  --sidebar-border: #E8EDF2;
  --sidebar-text: #64748B;
  --sidebar-text-active: #2563EB;
  --sidebar-text-hover: #1E293B;
  --sidebar-item-active-bg: #EFF6FF;
  --sidebar-item-hover-bg: #F8FAFC;
  --sidebar-active-border: #2563EB;

  /* Topbar */
  --topbar-height: 60px;
  --topbar-bg: #FFFFFF;
  --topbar-border: #E8EDF2;

  /* Brand — match landing page exactly */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-light: #EFF6FF;
  --color-primary-border: #BFDBFE;

  /* Text */
  --text-900: #0F172A;
  --text-700: #334155;
  --text-500: #64748B;
  --text-300: #94A3B8;
  --text-200: #CBD5E1;

  /* Border */
  --border: #E2E8F0;
  --border-light: #F1F5F9;

  /* Status */
  --green: #16A34A;
  --green-bg: #DCFCE7;
  --green-border: #BBF7D0;
  --amber: #D97706;
  --amber-bg: #FEF3C7;
  --amber-border: #FDE68A;
  --red: #DC2626;
  --red-bg: #FEE2E2;
  --red-border: #FECACA;
  --blue: #2563EB;
  --blue-bg: #EFF6FF;
  --blue-border: #BFDBFE;

  /* Shadows — this is what makes cards look premium */
  --shadow-xs:  0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm:  0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md:  0 4px 6px rgba(15, 23, 42, 0.05), 0 2px 4px rgba(15, 23, 42, 0.04);
  --shadow-card: 0 0 0 1px rgba(15,23,42,0.06), 0 2px 8px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.04);
  --shadow-card-hover: 0 0 0 1px rgba(37,99,235,0.12), 0 4px 16px rgba(15,23,42,0.10), 0 12px 32px rgba(15,23,42,0.08);
  --shadow-dropdown: 0 4px 6px rgba(15,23,42,0.05), 0 10px 40px rgba(15,23,42,0.12);

  /* Radius */
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 20px;
  --r-full: 9999px;
}

html, body, #root {
  height: 100%;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-900);
  background: var(--bg-page);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## STEP 2 — APP LAYOUT (THE MOST CRITICAL FIX)

Find your main layout component — the one that wraps sidebar + content. Replace its CSS with this EXACTLY:

```css
/* The outer wrapper */
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-page);
}

/* SIDEBAR */
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  height: 100vh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  position: relative;
  z-index: 50;
}

/* MAIN AREA — fills ALL remaining space */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0; /* critical — prevents flex overflow */
}

/* TOPBAR */
.topbar {
  height: var(--topbar-height);
  min-height: var(--topbar-height);
  background: var(--topbar-bg);
  border-bottom: 1px solid var(--topbar-border);
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 16px;
  flex-shrink: 0;
}

/* PAGE CONTENT — fills remaining height, scrollable */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 28px 32px;
  /* NO max-width. NO margin: 0 auto. Content fills full width always. */
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 100;
    box-shadow: var(--shadow-dropdown);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .main-area {
    width: 100%;
  }
  .page-content {
    padding: 20px 16px;
  }
}
```

**IMPORTANT:** Search your entire codebase for any of these and DELETE them from the page content/main container:
- `max-width: 800px` or any max-width on the page wrapper
- `margin: 0 auto` on the page wrapper
- `width: 60%` or similar on the page wrapper
- Any `container` class that restricts width

The ONLY thing that should have a max-width is the login form. Everything else: full width.

---

## STEP 3 — SIDEBAR RESTYLE

Replace sidebar component styles completely:

```css
/* Logo area */
.sidebar-logo {
  padding: 20px 18px 16px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.sidebar-logo-mark {
  width: 34px;
  height: 34px;
  background: var(--color-primary);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;
}

.sidebar-logo-text {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  color: var(--text-900);
  letter-spacing: -0.2px;
}

/* Nav section */
.sidebar-nav {
  flex: 1;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.nav-section-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-300);
  padding: 12px 10px 4px;
}

/* Nav item */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--r-sm);
  border-left: 3px solid transparent;
  cursor: pointer;
  color: var(--sidebar-text);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
  position: relative;
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--sidebar-item-hover-bg);
  color: var(--sidebar-text-hover);
}

.nav-item.active {
  background: var(--sidebar-item-active-bg);
  color: var(--sidebar-text-active);
  border-left-color: var(--sidebar-active-border);
  font-weight: 600;
}

.nav-item svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  opacity: 0.7;
}

.nav-item.active svg {
  opacity: 1;
  color: var(--sidebar-text-active);
}

.nav-item:hover svg {
  opacity: 1;
}

/* Sidebar bottom */
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--border-light);
  flex-shrink: 0;
}

.sidebar-upgrade {
  background: var(--color-primary-light);
  border: 1px solid var(--color-primary-border);
  border-radius: var(--r-md);
  padding: 14px;
}

.sidebar-upgrade p {
  font-size: 12px;
  font-family: var(--font-body);
  color: var(--text-700);
  line-height: 1.5;
  margin-bottom: 10px;
}

.sidebar-upgrade button {
  width: 100%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--r-sm);
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-body);
  cursor: pointer;
  transition: background 0.15s;
}

.sidebar-upgrade button:hover {
  background: var(--color-primary-hover);
}
```

---

## STEP 4 — TOPBAR RESTYLE

```css
.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-menu-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-500);
  transition: background 0.12s;
}
.topbar-menu-btn:hover { background: var(--bg-input); }

.topbar-branch {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-900);
}

.topbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.online-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: var(--green-bg);
  border: 1px solid var(--green-border);
  border-radius: var(--r-full);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-body);
  color: var(--green);
}

.online-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: blink 2s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

.topbar-avatar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 5px 10px 5px 6px;
  cursor: pointer;
  transition: background 0.12s;
}
.topbar-avatar-btn:hover { background: var(--bg-input); }

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.avatar-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-900);
  font-family: var(--font-body);
}

.topbar-icon-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-500);
  transition: background 0.12s, color 0.12s;
  flex-shrink: 0;
}
.topbar-icon-btn:hover { background: var(--bg-input); color: var(--text-900); }
```

---

## STEP 5 — CARD SYSTEM

Every card in the app must use this:

```css
.card {
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}

.card-header {
  padding: 20px 22px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 15px;
  font-weight: 700;
  color: var(--text-900);
  letter-spacing: -0.1px;
}

.card-subtitle {
  font-size: 12px;
  font-family: var(--font-body);
  color: var(--text-300);
  margin-top: 2px;
}

.card-body {
  padding: 16px 22px 22px;
}
```

---

## STEP 6 — STAT CARDS (DASHBOARD TOP ROW)

The 4 metric cards need a complete rebuild:

```css
/* Grid — full width, 4 columns */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  width: 100%;
  margin-bottom: 22px;
}

@media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .stats-grid { grid-template-columns: 1fr; } }

.stat-card {
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  padding: 22px 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: default;
  min-height: 140px;
}

.stat-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.stat-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.stat-card-label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-300);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-delta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  border-radius: var(--r-full);
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-body);
}
.stat-delta.up   { background: var(--green-bg); color: var(--green); }
.stat-delta.down { background: var(--red-bg);   color: var(--red);   }
.stat-delta.flat { background: var(--bg-input); color: var(--text-300); }

.stat-card-value {
  font-family: var(--font-heading);
  font-size: 34px;
  font-weight: 800;
  color: var(--text-900);
  letter-spacing: -1px;
  line-height: 1;
  margin-bottom: 14px;
}

/* Sparkline fills bottom of card */
.stat-sparkline {
  margin: 0 -22px -16px;
  height: 52px;
}
```

In the React stat card component, update the Recharts sparkline like this:

```tsx
// Green sparkline (Attendance)
<AreaChart data={data} margin={{top:0, right:0, bottom:0, left:0}}>
  <defs>
    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3}/>
      <stop offset="100%" stopColor="#22C55E" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <Area type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={2.5}
        fill="url(#sg)" dot={false} activeDot={false} isAnimationActive={true}/>
</AreaChart>

// Blue sparkline (Students)
// stroke="#3B82F6", gradient id="sb", stopColor="#3B82F6"

// Amber sparkline (Disputes)
// stroke="#F59E0B", gradient id="sa", stopColor="#F59E0B"

// Red sparkline (Fees)
// stroke="#EF4444", gradient id="sr", stopColor="#EF4444"

// Wrap each in:
<ResponsiveContainer width="100%" height="100%">
```

---

## STEP 7 — DASHBOARD GRID

```css
/* Secondary row — 2 cards side by side */
.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 22px;
  width: 100%;
}

@media (max-width: 900px) {
  .dashboard-row { grid-template-columns: 1fr; }
}

/* Chart card — give the chart room to breathe */
.chart-card-body {
  padding: 16px 16px 20px;
  height: 260px;
}
```

---

## STEP 8 — PENDING ACTIONS CARD

```css
.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  background: var(--amber-bg);
  border: 1px solid var(--amber-border);
  border-radius: var(--r-md);
  margin-bottom: 8px;
}

.action-item-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--amber-bg);
  border: 1px solid var(--amber-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--amber);
  flex-shrink: 0;
}

.action-item-text {
  flex: 1;
  min-width: 0;
}

.action-item-title {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: #92400E;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-item-sub {
  font-size: 12px;
  color: #B45309;
  margin-top: 2px;
}

.action-btn {
  font-size: 12px;
  font-weight: 700;
  color: var(--amber);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  white-space: nowrap;
  padding: 4px 0;
}
.action-btn:hover { text-decoration: underline; }
```

---

## STEP 9 — STUDENTS PAGE (and all list pages)

The students page must use the FULL width. Remove any container/wrapper restricting width. Apply this layout:

```css
/* Page header row */
.page-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.page-breadcrumb {
  font-size: 12px;
  color: var(--text-300);
  font-family: var(--font-body);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-breadcrumb a {
  color: var(--text-300);
  text-decoration: none;
  transition: color 0.12s;
}
.page-breadcrumb a:hover { color: var(--color-primary); }

.page-title {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 800;
  color: var(--text-900);
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Toolbar row (search + filters) */
.list-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 240px;
  max-width: 400px;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-300);
  width: 15px;
  height: 15px;
}

.search-box input {
  width: 100%;
  height: 40px;
  padding: 0 14px 0 38px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-size: 14px;
  font-family: var(--font-body);
  color: var(--text-900);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: var(--shadow-xs);
}

.search-box input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
}

.search-box input::placeholder {
  color: var(--text-200);
}

/* The data table card */
.list-card {
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  width: 100%;
}

/* Table inside the card */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  background: var(--bg-input);
  border-bottom: 1px solid var(--border);
}

.data-table thead th {
  padding: 11px 18px;
  text-align: left;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-300);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--border-light);
  transition: background 0.1s;
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: #FAFBFC;
}

.data-table tbody td {
  padding: 14px 18px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-700);
  vertical-align: middle;
}

.data-table tbody td:first-child {
  font-weight: 600;
  color: var(--text-900);
}

/* Student avatar in table */
.student-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.student-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.student-name {
  font-weight: 600;
  color: var(--text-900);
  font-size: 14px;
}

.student-roll {
  font-size: 12px;
  color: var(--text-300);
  margin-top: 1px;
}

/* Pagination */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-surface);
}

.table-count {
  font-size: 13px;
  color: var(--text-300);
  font-family: var(--font-body);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn {
  height: 32px;
  min-width: 32px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--bg-surface);
  font-size: 13px;
  font-family: var(--font-body);
  color: var(--text-700);
  cursor: pointer;
  transition: all 0.12s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:hover { background: var(--bg-input); color: var(--text-900); }
.page-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
```

---

## STEP 10 — EMPTY STATE (when no data)

Replace "No records yet" bare text with this component:

```tsx
function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 24px', gap: 16
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: 'var(--color-primary-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-primary)', fontSize: 28
      }}>
        {icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700,
          color: 'var(--text-900)', marginBottom: 6
        }}>{title}</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 14,
          color: 'var(--text-300)', maxWidth: 280, lineHeight: 1.6
        }}>{description}</div>
      </div>
      {action && (
        <button onClick={action} className="btn btn-primary" style={{ marginTop: 8 }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Usage in Students page:
<EmptyState
  icon="👨‍🎓"
  title="No students yet"
  description="Add your first student or bulk import from an Excel file."
  action={() => setShowAddModal(true)}
  actionLabel="+ Add Student"
/>
```

---

## STEP 11 — BUTTON SYSTEM

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 18px;
  height: 38px;
  border-radius: var(--r-sm);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  white-space: nowrap;
  text-decoration: none;
  flex-shrink: 0;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 1px 3px rgba(37,99,235,0.3);
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(37,99,235,0.4);
  transform: translateY(-1px);
}
.btn-primary:active { transform: translateY(0); }

.btn-secondary {
  background: var(--bg-surface);
  color: var(--text-700);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xs);
}
.btn-secondary:hover {
  background: var(--bg-input);
  color: var(--text-900);
  border-color: var(--text-200);
}

.btn-ghost {
  background: transparent;
  color: var(--color-primary);
}
.btn-ghost:hover { background: var(--color-primary-light); }

.btn-danger {
  background: var(--red-bg);
  color: var(--red);
  border: 1px solid var(--red-border);
}
.btn-danger:hover { background: #FECACA; }

.btn-sm {
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
}

.btn-lg {
  height: 44px;
  padding: 0 24px;
  font-size: 15px;
}
```

---

## STEP 12 — BADGE SYSTEM

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: var(--r-full);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.badge-green  { background: var(--green-bg);  color: var(--green);  border: 1px solid var(--green-border); }
.badge-red    { background: var(--red-bg);    color: var(--red);    border: 1px solid var(--red-border);   }
.badge-amber  { background: var(--amber-bg);  color: var(--amber);  border: 1px solid var(--amber-border); }
.badge-blue   { background: var(--blue-bg);   color: var(--blue);   border: 1px solid var(--blue-border);  }
.badge-gray   { background: var(--bg-input);  color: var(--text-500); border: 1px solid var(--border);     }
```

---

## STEP 13 — FRAMER MOTION (apply to every page)

In every page component, wrap the content in:

```tsx
import { motion } from 'framer-motion';

// Page wrapper
<motion.div
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
>

// Stagger grid (stat cards, feature cards etc)
const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
};
const gridItem = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } }
};

// Use on the stat cards grid:
<motion.div className="stats-grid" variants={grid} initial="hidden" animate="show">
  <motion.div variants={gridItem}><StatCard .../></motion.div>
  <motion.div variants={gridItem}><StatCard .../></motion.div>
  ...
</motion.div>

// All card hover:
<motion.div
  className="card"
  whileHover={{ y: -2 }}
  transition={{ duration: 0.18 }}
>

// Button tap:
<motion.button whileTap={{ scale: 0.97 }}>

// Table rows — stagger in:
{rows.map((row, i) => (
  <motion.tr
    key={row.id}
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.04, duration: 0.2 }}
  >
))}
```

---

## STEP 14 — LOGIN PAGE FIX

The login page is actually decent but needs these fixes:

```css
.login-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  overflow: hidden;
}

.login-left {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 48px;
}

.login-form-box {
  width: 100%;
  max-width: 380px; /* Only the login box has max-width, NOT the page */
}

/* Input fields on login */
.login-input {
  width: 100%;
  height: 44px;
  padding: 0 14px 0 40px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  font-size: 14px;
  font-family: var(--font-body);
  background: #fff;
  color: var(--text-900);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.login-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
}

/* Sign in button */
.login-btn {
  width: 100%;
  height: 46px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--r-md);
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
  box-shadow: 0 2px 8px rgba(37,99,235,0.35);
}
.login-btn:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 4px 16px rgba(37,99,235,0.45);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .login-layout { grid-template-columns: 1fr; }
  .login-right { display: none; }
}
```

---

## ABSOLUTE RULES — DO NOT BREAK THESE

```
✅ Sidebar background: #FFFFFF always
✅ Page background: #F0F4F8 always  
✅ All cards: white background + var(--shadow-card)
✅ All content: fills full available width — NO max-width on page wrappers
✅ Font headings: Plus Jakarta Sans always
✅ Font body: DM Sans always
✅ Primary blue: #2563EB (matches landing page)
✅ Every interactive element has a hover state
✅ Every page has a Framer Motion page transition

❌ NO dark sidebar
❌ NO max-width container on dashboard/students/any inner page
❌ NO flat cards without shadow
❌ NO generic system fonts
❌ NO content floating in the center of a giant empty page
❌ NO navy/dark backgrounds inside the app
❌ NO borders without radius
❌ NO abrupt content renders without animation
```

---

## FINAL INSTRUCTION TO CURSOR

Apply every single CSS rule above to the existing components. Do not rewrite logic — only fix styles. The result must feel like the same design quality as the landing page: clean, airy, professional, with consistent blue brand color, white surfaces, soft shadows, and beautiful typography. Every page should feel like you paid a senior product designer to build it.
```
