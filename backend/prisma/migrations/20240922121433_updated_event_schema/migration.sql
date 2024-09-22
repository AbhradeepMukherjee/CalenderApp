/*
  Warnings:

  - Added the required column `endDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Event_startTime_idx";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "recurrence" BOOLEAN,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Event_startDate_endDate_idx" ON "Event"("startDate", "endDate");
