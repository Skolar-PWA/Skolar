/*
  Warnings:

  - You are about to drop the column `scannedVia` on the `AttendanceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `classSubjectId` on the `AttendanceSession` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `AttendanceSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sectionId,date]` on the table `AttendanceSession` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[classTeacherOfId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `markedById` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `markedByName` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `markedByName` to the `AttendanceSession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MarkedMethod" AS ENUM ('manual', 'qr_camera', 'qr_fixed_device');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('attendance_late_marking', 'attendance_deadline_digest', 'attendance_absent_student', 'attendance_late_student', 'attendance_excused_student', 'result_published', 'dispute_update');

-- AlterEnum
ALTER TYPE "StaffRole" ADD VALUE 'attendance_substitute';

-- DropForeignKey
ALTER TABLE "AttendanceSession" DROP CONSTRAINT "AttendanceSession_classSubjectId_fkey";

-- DropIndex
DROP INDEX "AttendanceSession_sectionId_classSubjectId_date_key";

-- AlterTable
ALTER TABLE "AttendanceRecord" DROP COLUMN "scannedVia",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deviceName" TEXT,
ADD COLUMN     "markedById" TEXT NOT NULL,
ADD COLUMN     "markedByName" TEXT NOT NULL,
ADD COLUMN     "markedMethod" "MarkedMethod" NOT NULL DEFAULT 'manual',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AttendanceSession" DROP COLUMN "classSubjectId",
DROP COLUMN "type",
ADD COLUMN     "isLate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "lockedById" TEXT,
ADD COLUMN     "markedByName" TEXT NOT NULL,
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "classTeacherOfId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fcmToken" TEXT;

-- DropEnum
DROP TYPE "AttendanceType";

-- CreateTable
CREATE TABLE "AttendanceEdit" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "editedById" TEXT NOT NULL,
    "editedByName" TEXT NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousStatus" "AttendanceStatus" NOT NULL,
    "newStatus" "AttendanceStatus" NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "AttendanceEdit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchSettings" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "attendanceDeadlineTime" TEXT NOT NULL DEFAULT '09:30',
    "attendanceEditWindowEnd" TEXT NOT NULL DEFAULT '23:59',

    CONSTRAINT "BranchSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceDeadlineDigestLog" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "digestDate" DATE NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceDeadlineDigestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BranchSettings_branchId_key" ON "BranchSettings"("branchId");

-- CreateIndex
CREATE INDEX "AttendanceDeadlineDigestLog_digestDate_idx" ON "AttendanceDeadlineDigestLog"("digestDate");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceDeadlineDigestLog_branchId_digestDate_key" ON "AttendanceDeadlineDigestLog"("branchId", "digestDate");

-- CreateIndex
CREATE INDEX "Notification_recipientId_createdAt_idx" ON "Notification"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_branchId_idx" ON "Notification"("branchId");

-- CreateIndex
CREATE INDEX "AttendanceSession_sectionId_idx" ON "AttendanceSession"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSession_sectionId_date_key" ON "AttendanceSession"("sectionId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_classTeacherOfId_key" ON "Staff"("classTeacherOfId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_classTeacherOfId_fkey" FOREIGN KEY ("classTeacherOfId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_lockedById_fkey" FOREIGN KEY ("lockedById") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_markedById_fkey" FOREIGN KEY ("markedById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEdit" ADD CONSTRAINT "AttendanceEdit_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AttendanceSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSettings" ADD CONSTRAINT "BranchSettings_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDeadlineDigestLog" ADD CONSTRAINT "AttendanceDeadlineDigestLog_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
