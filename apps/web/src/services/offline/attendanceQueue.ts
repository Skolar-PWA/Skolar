import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { MarkAttendanceBody } from '@eduportal/shared';
import { attendanceService } from '../api/attendance.service';

interface QueuedAttendance {
  id: string;
  body: MarkAttendanceBody;
  queuedAt: number;
}

interface EduPortalDB extends DBSchema {
  'attendance-queue': {
    key: string;
    value: QueuedAttendance;
    indexes: { 'by-queuedAt': number };
  };
}

let dbPromise: Promise<IDBPDatabase<EduPortalDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<EduPortalDB>('eduportal', 1, {
      upgrade(db) {
        const store = db.createObjectStore('attendance-queue', { keyPath: 'id' });
        store.createIndex('by-queuedAt', 'queuedAt');
      },
    });
  }
  return dbPromise;
}

export async function queueAttendance(body: MarkAttendanceBody): Promise<string> {
  const db = await getDb();
  const id = `${body.sectionId}-${body.date}-${Date.now()}`;
  await db.put('attendance-queue', { id, body, queuedAt: Date.now() });
  return id;
}

export async function getQueueSize(): Promise<number> {
  const db = await getDb();
  return db.count('attendance-queue');
}

export async function flushQueue(): Promise<{ flushed: number; failed: number }> {
  const db = await getDb();
  const all = await db.getAll('attendance-queue');
  let flushed = 0;
  let failed = 0;
  for (const entry of all) {
    try {
      await attendanceService.markSession(entry.body);
      await db.delete('attendance-queue', entry.id);
      flushed += 1;
    } catch {
      failed += 1;
    }
  }
  return { flushed, failed };
}

export function startQueueAutoFlush() {
  if (typeof window === 'undefined') return;
  const tryFlush = () => {
    if (navigator.onLine) flushQueue().catch(() => undefined);
  };
  window.addEventListener('online', tryFlush);
  setInterval(tryFlush, 30_000);
  tryFlush();
}
