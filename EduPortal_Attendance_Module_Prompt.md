# EduPortal — Attendance Module: Full Implementation Prompt
# Backend + Frontend + Role Logic + UI
# Do not touch any other module. Attendance only.

---

## BUSINESS RULES (read every line before writing a single line of code)

### Attendance Type
- **Daily only** — one attendance session per class-section per calendar day
- One mark per student: Present / Absent / Late / Excused
- Marked by the assigned Class Teacher of that section

### Role Access Matrix

| Role | Can Mark | Can View | Which Classes |
|---|---|---|---|
| Super Admin | ✅ | ✅ | All |
| School Admin | ✅ | ✅ | All |
| Branch Manager | ✅ | ✅ | All branches under them |
| Attendance Substitute | ✅ | ✅ | ALL classes (emergency access) |
| Class Teacher | ✅ | ✅ | ONLY their assigned section |
| Subject Teacher (non-class-teacher) | ❌ | ✅ | Only their own child's class (view only, no sidebar attendance item shown — redirect if accessed directly) |
| Student | ❌ | ✅ | Own record only |
| Parent | ❌ | ✅ | Their child's record only |

### Class Teacher Assignment
- A Staff member has a field `classTeacherOf: Section | null`
- When `classTeacherOf` is set, they see their section in the Attendance marking view
- When `classTeacherOf` is null AND role is `teacher`, they see Attendance as view-only — no "Mark" button anywhere

### Attendance Substitute
- A permanent special Staff account with role `attendance_substitute`
- Created by Admin from Staff management
- Sees ALL sections in the attendance marking view
- Exists for when the class teacher is absent — Admin activates them verbally, no system toggle needed
- This role gets late-marking alerts for ALL classes

### Late Marking Flag
- Each school has a configured `attendanceDeadlineTime` (e.g. "09:30") set in Settings
- If attendance is submitted AFTER this time:
  - `isLate: true` is stored on the AttendanceSession
  - An in-app notification is created for: School Admin, Branch Manager, Attendance Substitute
  - The notification says: "⚠️ [Teacher Name] marked [Grade X Section Y] attendance late at [time]"
  - Students are NOT marked late — their status is whatever the teacher chose
  - The flag is visible in the attendance audit report

### Edit Window
- Class Teacher can edit submitted attendance on the SAME calendar day only
- After midnight, the session is locked for class teachers
- Admin and Branch Manager can unlock any session at any time (with a reason log)
- Edit creates an `AttendanceEdit` audit record: who changed, what changed, when

### Parent Notifications (via FCM)
- Triggered immediately when session is submitted (not on each individual mark, only on final submit)
- Notification sent for students marked: **Absent** or **Late** or **Excused**
- Notification NOT sent for Present (no need to notify)
- Message format:
  - Absent: "📋 Attendance Update — [Student Name] was marked absent today ([Date])."
  - Late: "⏰ Attendance Update — [Student Name] was marked late today ([Date])."
  - Excused: "✅ Attendance Update — [Student Name] has an excused absence today ([Date])."
- Parent must have FCM token stored (from PWA push permission)

### Audit Trail (who marked + how)
Every `AttendanceRecord` stores:
- `markedBy`: Staff ID
- `markedByName`: Staff full name (denormalized for reports)
- `markedMethod`: enum `manual | qr_camera | qr_fixed_device`
- `deviceName`: string | null — populated when `markedMethod = qr_fixed_device` (e.g. "Main Gate Scanner", "Classroom Scanner 2")
- `submittedAt`: exact timestamp

---

## BACKEND — DATABASE CHANGES

Add these fields/models to the Prisma schema. Run `prisma migrate dev` after.

```prisma
// Add to Staff model:
classTeacherOf   Section? @relation("ClassTeacher", fields: [classTeacherOfId], references: [id])
classTeacherOfId String?  @unique

// Add to Section model:
classTeacher  Staff?   @relation("ClassTeacher")

// Add attendance_substitute to StaffRole enum:
enum StaffRole {
  admin
  branch_manager
  teacher
  attendance_substitute  // ← ADD THIS
}

// Add to School/Branch settings:
model BranchSettings {
  id                      String   @id @default(uuid())
  branchId                String   @unique
  branch                  Branch   @relation(fields: [branchId], references: [id])
  attendanceDeadlineTime  String   @default("09:30") // "HH:mm" 24h format
  attendanceEditWindowEnd String   @default("23:59") // teachers can edit until this time same day
}

// Update AttendanceSession:
model AttendanceSession {
  id             String            @id @default(uuid())
  sectionId      String
  section        Section           @relation(fields: [sectionId], references: [id])
  date           DateTime          @db.Date
  markedById     String
  markedBy       Staff             @relation(fields: [markedById], references: [id])
  markedByName   String            // denormalized
  submittedAt    DateTime          @default(now())
  isLate         Boolean           @default(false)
  isLocked       Boolean           @default(false)
  lockedById     String?
  lockedAt       DateTime?
  records        AttendanceRecord[]
  edits          AttendanceEdit[]
  @@unique([sectionId, date])
}

// Update AttendanceRecord:
model AttendanceRecord {
  id             String            @id @default(uuid())
  sessionId      String
  session        AttendanceSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  studentId      String
  student        Student           @relation(fields: [studentId], references: [id])
  status         AttendanceStatus  @default(present)
  note           String?
  markedMethod   MarkedMethod      @default(manual)
  deviceName     String?           // only for qr_fixed_device
  @@unique([sessionId, studentId])
}

// Audit log for edits:
model AttendanceEdit {
  id              String            @id @default(uuid())
  sessionId       String
  session         AttendanceSession @relation(fields: [sessionId], references: [id])
  editedById      String
  editedByName    String
  editedAt        DateTime          @default(now())
  previousStatus  AttendanceStatus
  newStatus       AttendanceStatus
  studentId       String
  studentName     String            // denormalized
  reason          String?
}

// Notifications:
model Notification {
  id          String           @id @default(uuid())
  branchId    String
  recipientId String           // userId
  type        NotificationType
  title       String
  body        String
  isRead      Boolean          @default(false)
  createdAt   DateTime         @default(now())
  metadata    Json?            // { sessionId, sectionName, teacherName, etc }
}

enum MarkedMethod {
  manual
  qr_camera
  qr_fixed_device
}

enum NotificationType {
  attendance_late_marking
  attendance_absent_student
  attendance_late_student
  attendance_excused_student
  result_published
  dispute_update
}
```

---

## BACKEND — NESTJS MODULE (src/attendance/)

### Files to create/update:

```
src/attendance/
├── attendance.module.ts
├── attendance.controller.ts
├── attendance.service.ts
├── attendance-qr.service.ts
├── attendance-notify.service.ts
├── dto/
│   ├── create-session.dto.ts
│   ├── submit-session.dto.ts
│   ├── edit-record.dto.ts
│   └── scan-qr.dto.ts
├── guards/
│   └── attendance-access.guard.ts   ← custom guard for role+section access
└── attendance.types.ts
```

### attendance.controller.ts — Endpoints

```typescript
// GET /attendance/sections
// Returns sections this user is allowed to mark attendance for
// - Class teacher: only their classTeacherOf section
// - Admin/BranchManager/AttendanceSubstitute: all sections in branch
// - Subject teacher: [] (empty, view only)
// Response includes today's session status for each section

// GET /attendance/sections/:sectionId/session?date=YYYY-MM-DD
// Returns the session for a section on a date, including all records
// If no session exists yet, returns { session: null, students: [...] }
// Students list comes from active enrollments in that section

// POST /attendance/sessions
// Creates or retrieves today's session for a section
// Body: { sectionId: string }
// Guard: only class teacher of that section, admin, branch manager, attendance_substitute

// POST /attendance/sessions/:sessionId/submit
// Final submission of the session
// Body: { records: [{ studentId, status, note?, markedMethod, deviceName? }] }
// Triggers: late-marking check, parent notifications, lock status
// Once submitted, session.submittedAt is set

// PATCH /attendance/sessions/:sessionId/records/:studentId
// Edit a single student's record after submission
// Guard: class teacher only within same calendar day, OR admin/branch_manager anytime
// Creates AttendanceEdit record
// Body: { status, note?, reason? }

// POST /attendance/scan
// QR scan endpoint
// Body: { qrToken: string, sectionId?: string, deviceName?: string }
// Finds student by qrToken
// Finds active/today's session for that student's enrolled section
// Marks them present with markedMethod = qr_camera or qr_fixed_device
// Returns: { student: { name, photoUrl, rollNo }, status: 'marked'|'already_marked'|'no_session'|'not_enrolled' }

// GET /attendance/sections/:sectionId/history?month=YYYY-MM
// Monthly attendance history for a section
// Returns calendar data: { date, sessionId, totalPresent, totalAbsent, isLate, markedByName }

// GET /attendance/students/:studentId?academicYearId=
// Student's full attendance record for the year
// Returns: { totalDays, present, absent, late, excused, percentage, monthlyBreakdown }

// GET /attendance/reports/late-marking?branchId=&from=&to=
// Admin report: all late-marked sessions in a date range
// Includes teacher name, section, time submitted, how many minutes late

// GET /attendance/reports/summary?branchId=&date=YYYY-MM-DD
// Daily summary for admin dashboard
// Returns per-section: { sectionName, totalStudents, present, absent, late, excused, isMarked, markedByName }

// POST /attendance/sessions/:sessionId/unlock
// Admin/Branch Manager only — unlocks a locked session
// Body: { reason: string }
// Logs to AttendanceEdit with reason
```

### attendance.service.ts — Key Logic

```typescript
// isLateMarking(branchId: string, submittedAt: Date): Promise<boolean>
// Fetches BranchSettings.attendanceDeadlineTime
// Compares submittedAt time against deadline
// Returns true if after deadline

// canEditSession(userId, session, role): boolean
// Class teacher: session.date === today AND session.markedById === userId
// Admin/BranchManager: always true
// Others: false

// getSectionsForUser(userId, branchId, role, classTeacherOfId)
// Builds the list of sections this user can mark
// Returns sections with today's session status attached

// After submit — run these in sequence:
// 1. checkAndFlagLateMarking()
// 2. sendParentNotifications()
// 3. lockSessionIfNeeded() — lock after midnight via cron, not immediately

// Cron job: runs at 00:01 every day
// Locks all sessions from previous day
// Any section with no session = creates an "unmarked" record for admin report
```

### attendance-notify.service.ts

```typescript
// sendLateMarkingAlert(session, teacher, branch)
// Creates Notification records for: all admins, branch managers, attendance_substitute of that branch
// Sends FCM push to their registered devices
// Title: "Late Attendance Marking"
// Body: `${teacher.firstName} ${teacher.lastName} marked ${section.class.name} ${section.name} attendance at ${time} (deadline was ${deadline})`

// sendParentNotifications(records, session)
// For each record where status !== 'present':
//   Find parent(s) linked to that student
//   Create Notification record
//   Send FCM push to parent's FCM tokens
//   Batch FCM sends in groups of 500 (FCM limit)
```

---

## FRONTEND — ATTENDANCE MODULE

### Files to create:

```
src/pages/attendance/
├── AttendancePage.tsx          ← section selection grid
├── MarkAttendancePage.tsx      ← the actual marking UI
├── QRScannerPage.tsx           ← camera scanner
├── AttendanceHistoryPage.tsx   ← monthly history for a section
└── components/
    ├── SectionCard.tsx          ← card for each class/section
    ├── StudentAttendanceRow.tsx ← one row in mark attendance
    ├── AttendanceStatusToggle.tsx ← P/A/L/E buttons
    ├── AttendanceSummaryBar.tsx ← bottom sticky bar
    ├── LateMarkingBanner.tsx    ← warning when past deadline
    ├── SessionLockedBanner.tsx  ← when session is locked
    └── AttendanceCalendar.tsx   ← monthly heatmap calendar
```

---

### AttendancePage.tsx — Section Selection

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Home / Attendance                                       │
│  Attendance                          [QR Scanner btn]   │
│  Mark attendance for your class                         │
│                                                          │
│  Tuesday, 28 April 2026              [Filter dropdown]  │
│                                                          │
│  [Search sections...]                                    │
│                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ Grade 6      │ │ Grade 6      │ │ Grade 7      │    │
│  │ Section A    │ │ Section B    │ │ Section A    │    │
│  │ 28 students  │ │ 25 students  │ │ 30 students  │    │
│  │              │ │              │ │              │    │
│  │ ● Marked     │ │ ○ Pending    │ │ ✓ Marked     │    │
│  │ 9:05 AM      │ │              │ │ 8:47 AM      │    │
│  │ [View]       │ │ [Mark today] │ │ [View/Edit]  │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**SectionCard states:**

1. **Pending** (not marked yet, before deadline)
   - White card, blue left border `4px solid #2563EB`
   - Amber badge "Pending"
   - Primary button "Mark Today" — full blue
   - Student count shown

2. **Pending Late** (not marked, AFTER deadline)
   - White card, red left border `4px solid #DC2626`
   - Red badge "Overdue"
   - Red button "Mark Now (Late)"
   - Pulsing red dot animation on the card

3. **Marked** (submitted today)
   - White card, green left border `4px solid #16A34A`
   - Green badge "Marked"
   - Time submitted shown: "Marked at 8:47 AM"
   - "Late" sub-badge if `isLate: true`
   - Button: "View" (for class teacher) or "View / Edit" (for admin)
   - Mini summary: "26 Present · 2 Absent"

4. **Marked Late** (submitted but after deadline)
   - Same as Marked but amber left border + amber "Marked Late" badge

```tsx
// SectionCard.tsx
interface SectionCardProps {
  section: Section;
  session: AttendanceSession | null;
  canMark: boolean;
  isAfterDeadline: boolean;
  onMark: () => void;
  onView: () => void;
}

// Status logic:
const status = !session
  ? isAfterDeadline ? 'overdue' : 'pending'
  : session.isLate ? 'marked_late' : 'marked';
```

**Filters and Search:**

```tsx
// Search: filters section cards by class name or section name in real time
<input placeholder="Search class or section..." />

// Filter dropdown: "All" | "Pending" | "Marked" | "Overdue"
// Grade filter: "All Grades" | "Grade 6" | "Grade 7" | "Grade 8"
```

**Grid layout:**

```css
.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
}
```

**Card CSS:**

```css
.section-card {
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  border-left: 4px solid var(--border); /* overridden by status */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}
.section-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
.section-card.pending      { border-left-color: #2563EB; }
.section-card.overdue      { border-left-color: #DC2626; }
.section-card.marked       { border-left-color: #16A34A; }
.section-card.marked_late  { border-left-color: #D97706; }

.section-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.section-name {
  font-family: var(--font-heading);
  font-size: 17px;
  font-weight: 700;
  color: var(--text-900);
}

.section-sub {
  font-size: 13px;
  color: var(--text-300);
  margin-top: 2px;
}

.section-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-500);
}

.section-card-actions {
  display: flex;
  gap: 8px;
}

/* Overdue pulsing dot */
.overdue-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #DC2626;
  animation: pulse-red 1.5s infinite;
}
@keyframes pulse-red {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}
```

---

### MarkAttendancePage.tsx — The Core Marking UI

**This is the most important page. Design for speed — teacher must mark 30 students in under 60 seconds.**

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  ← Grade 7 Section A                     Tue 28 Apr    │
│  ─────────────────────────────────────────────────────  │
│  [amber banner if after deadline: "You are marking      │
│   attendance late. An alert will be sent to admin."]    │
│  [green banner if already submitted: "Submitted at      │
│   9:05 AM · You can still edit until midnight"]         │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Quick actions: [✓ Mark all Present] [Select all]      │
│                                                          │
│  [Search student...]                                     │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔵 AK  Ayesha Khan          01  [P][A][L][E]   │   │
│  │ 🔵 BM  Bilal Mahmood        02  [P][A][L][E]   │   │
│  │ 🔵 FA  Fatima Ahmed         03  [P][A][L][E]   │   │
│  │ ...                                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────── STICKY BOTTOM BAR ───────────────────────┐   │
│  │  28 Present  2 Absent  0 Late  0 Excused         │   │
│  │                              [Submit Attendance] │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Student row design:**

```tsx
// StudentAttendanceRow.tsx
// Each row is a full-width flex row

<motion.div
  className={`student-row status-${record.status}`}
  initial={{ opacity: 0, x: -8 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.025 }}
>
  {/* Avatar */}
  <div className="student-avatar-sm">
    {student.photoUrl
      ? <img src={student.photoUrl} alt={student.firstName} />
      : <span>{student.firstName[0]}{student.lastName[0]}</span>
    }
  </div>

  {/* Name + Roll */}
  <div className="student-info">
    <span className="student-fullname">{student.firstName} {student.lastName}</span>
    <span className="student-roll">Roll #{student.rollNo}</span>
  </div>

  {/* Status toggle — 4 buttons */}
  <AttendanceStatusToggle
    value={record.status}
    onChange={(status) => updateRecord(student.id, status)}
    disabled={isLocked && !canOverride}
  />

  {/* Note icon — opens a small popover to add a note */}
  <button className="note-btn" onClick={() => openNotePopover(student.id)}>
    📝
  </button>
</motion.div>
```

**Row CSS:**

```css
.student-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border-light);
  transition: background 0.1s;
}
.student-row:last-child { border-bottom: none; }

/* Row background changes with status */
.student-row.status-present  { background: #fff; }
.student-row.status-absent   { background: #FFF5F5; }
.student-row.status-late     { background: #FFFBEB; }
.student-row.status-excused  { background: #F0F9FF; }

.student-row:hover { filter: brightness(0.985); }

.student-avatar-sm {
  width: 36px;
  height: 36px;
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
  overflow: hidden;
}
.student-avatar-sm img { width: 100%; height: 100%; object-fit: cover; }

.student-info {
  flex: 1;
  min-width: 0;
}

.student-fullname {
  display: block;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-roll {
  display: block;
  font-size: 12px;
  color: var(--text-300);
  margin-top: 1px;
}
```

**AttendanceStatusToggle component:**

```tsx
// AttendanceStatusToggle.tsx
// 4 pill buttons: P / A / L / E
// Minimum tap target 44px height
// Active state is filled, inactive is outline

const statuses = [
  { key: 'present',  label: 'P', color: '#16A34A', bg: '#DCFCE7', border: '#86EFAC' },
  { key: 'absent',   label: 'A', color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5' },
  { key: 'late',     label: 'L', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  { key: 'excused',  label: 'E', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
];
```

```css
.status-toggle {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.status-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  font-family: var(--font-heading);
  cursor: pointer;
  transition: all 0.12s ease;
  border: 1.5px solid var(--border);
  background: var(--bg-surface);
  color: var(--text-300);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Active states */
.status-btn.active-present { background: #DCFCE7; border-color: #86EFAC; color: #16A34A; }
.status-btn.active-absent  { background: #FEE2E2; border-color: #FCA5A5; color: #DC2626; }
.status-btn.active-late    { background: #FEF3C7; border-color: #FDE68A; color: #D97706; }
.status-btn.active-excused { background: #EFF6FF; border-color: #BFDBFE; color: #2563EB; }

/* Hover */
.status-btn:not(.active-present):not(.active-absent):not(.active-late):not(.active-excused):hover {
  background: var(--bg-input);
  color: var(--text-700);
  border-color: var(--text-200);
}

/* Mobile — make bigger */
@media (max-width: 640px) {
  .status-btn { width: 42px; height: 42px; font-size: 13px; }
}
```

**Banners:**

```tsx
// LateMarkingBanner — shown when current time > attendanceDeadlineTime
<motion.div
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
  className="late-banner"
>
  ⚠️ You are marking attendance past the deadline ({deadline}).
  An alert will be sent to the school admin automatically.
</motion.div>

// SessionLockedBanner — shown when session is locked (class teacher after midnight)
<div className="locked-banner">
  🔒 This session was submitted and is now locked.
  Contact your admin to make changes.
</div>
```

```css
.late-banner {
  background: #FEF3C7;
  border: 1px solid #FDE68A;
  border-radius: var(--r-md);
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #92400E;
  font-family: var(--font-body);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.locked-banner {
  background: #F8FAFC;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 12px 16px;
  font-size: 13px;
  color: var(--text-500);
  font-family: var(--font-body);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submitted-banner {
  background: #DCFCE7;
  border: 1px solid #86EFAC;
  border-radius: var(--r-md);
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #14532D;
  font-family: var(--font-body);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

**Sticky bottom bar:**

```css
.attendance-submit-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  z-index: 30;
  box-shadow: 0 -4px 24px rgba(15, 23, 42, 0.06);
}

.attendance-counts {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.count-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
}

.count-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.count-dot.present { background: #16A34A; }
.count-dot.absent  { background: #DC2626; }
.count-dot.late    { background: #D97706; }
.count-dot.excused { background: #2563EB; }
```

**Submit flow:**

```tsx
const handleSubmit = async () => {
  // 1. Show confirmation dialog if any absents
  if (absentCount > 0) {
    const confirmed = await confirm(
      `${absentCount} student(s) will be marked absent. Parents will be notified immediately. Proceed?`
    );
    if (!confirmed) return;
  }

  // 2. Submit
  await submitSession({ sessionId, records, markedMethod: 'manual' });

  // 3. Success animation
  showSuccessToast(`Attendance submitted for ${section.name}`);

  // 4. Navigate back to section list
  navigate('/attendance');
};
```

---

### QRScannerPage.tsx

**Layout:** Full width card with camera feed. Scan line animation sweeps vertically.

```tsx
// On scan success — slide-up student card from bottom
<AnimatePresence>
  {scannedStudent && (
    <motion.div
      className="scan-result-card"
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="scan-avatar">
        {scannedStudent.photoUrl
          ? <img src={scannedStudent.photoUrl} />
          : <span>{scannedStudent.firstName[0]}{scannedStudent.lastName[0]}</span>
        }
      </div>
      <div>
        <div className="scan-name">{scannedStudent.firstName} {scannedStudent.lastName}</div>
        <div className="scan-class">{scannedStudent.className} · Roll #{scannedStudent.rollNo}</div>
      </div>
      <div className={`scan-status ${scanStatus}`}>
        {scanStatus === 'marked' && '✓ Marked Present'}
        {scanStatus === 'already_marked' && '⚡ Already Marked'}
        {scanStatus === 'no_session' && '⚠️ No Active Session'}
      </div>
    </motion.div>
  )}
</AnimatePresence>

// Auto-dismiss after 2.5 seconds then reset for next scan
```

**QR scan record logic:**
- If scanning from PWA camera: `markedMethod = 'qr_camera'`, `deviceName = null`
- If from fixed device API call: `markedMethod = 'qr_fixed_device'`, `deviceName = req.body.deviceName`

---

### Attendance Audit Report (admin view)

Add a tab or sub-page under Attendance for admins:

```
┌─────────────────────────────────────────────────────────┐
│  Attendance Reports              [Date range picker]    │
│                                                          │
│  ┌─ Summary ───────────────────────────────────────┐   │
│  │ Today: 6/6 sections marked  •  94% avg present  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Late Marking Alerts ───────────────────────────┐   │
│  │ Mr. Ahmed · Grade 7A · Marked at 10:23 AM       │   │
│  │ (Deadline was 9:30 AM · 53 minutes late)         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Section Summary Table ─────────────────────────┐   │
│  │ Section  │ Students │ Present │ Absent │ Marked By │ │
│  │ Grade 6A │ 28       │ 26      │ 2      │ Ms. Sara  │ │
│  │ Grade 6B │ 25       │ 25      │ 0      │ Mr. Ali   │ │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─ Audit Log ─────────────────────────────────────┐   │
│  │ Shows: who marked, method (Manual/QR Camera/     │   │
│  │ Scanner Name), timestamp, any edits made         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## STAFF MANAGEMENT UPDATE

When adding/editing a Staff member, add these fields to the form:

```tsx
// Only shown when staff role === 'teacher'
<div className="form-field">
  <label>Class Teacher Assignment</label>
  <select name="classTeacherOfId">
    <option value="">Not a class teacher</option>
    {availableSections.map(section => (
      <option
        key={section.id}
        value={section.id}
        disabled={section.classTeacher && section.classTeacher.id !== staff.id}
      >
        {section.class.name} — {section.name}
        {section.classTeacher && section.classTeacher.id !== staff.id
          ? ` (assigned to ${section.classTeacher.firstName})`
          : ''}
      </option>
    ))}
  </select>
  <p className="field-hint">
    Class teachers can mark daily attendance for their assigned section.
    Each section can only have one class teacher.
  </p>
</div>

// When role === 'attendance_substitute':
// No class teacher assignment needed — they get full access automatically
// Show a blue info box:
<div className="info-box">
  ℹ️ Attendance substitutes have access to mark attendance for all sections.
  Use this role for vice principals or dedicated substitute teachers.
</div>
```

---

## NOTIFICATIONS CENTER (basic implementation)

Add a bell icon to the topbar that shows a red dot when there are unread notifications.

```tsx
// Topbar bell button
<button className="topbar-icon-btn" onClick={() => setNotifOpen(true)}>
  <BellIcon />
  {unreadCount > 0 && (
    <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
  )}
</button>

// Notification dropdown (right-side panel, 380px wide)
// Shows last 20 notifications
// Each: icon (color by type) + title + body + time ago
// "Mark all read" button at top
// Click navigates to relevant page (e.g. late marking → attendance report)
```

```css
.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #DC2626;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  border: 2px solid #fff;
}
```

---

## SUMMARY OF ALL RULES

```
✅ Daily attendance only — one session per section per day
✅ Class teacher → only their section
✅ Attendance substitute → all sections
✅ Subject teacher → view only, no Mark button ever
✅ Admin/Branch Manager → all sections, can unlock anytime
✅ Late marking → flag + notify admin, substitute. Students not affected.
✅ Edit window → class teacher: same day only. Admin: always.
✅ Every edit logged in AttendanceEdit with who, what, when, why
✅ Every record stores markedMethod + deviceName
✅ Parent notified immediately on submit for: absent, late, excused
✅ Present students: no parent notification
✅ Section cards show status clearly: Pending / Overdue / Marked / Marked Late
✅ Default status = Present (teacher only changes exceptions)
✅ Offline support: mark in IndexedDB, sync on reconnect
✅ QR scan returns: student info + status (marked/already_marked/no_session)
✅ Sticky bottom bar always visible while marking
✅ Mobile tap targets minimum 44×44px
```
