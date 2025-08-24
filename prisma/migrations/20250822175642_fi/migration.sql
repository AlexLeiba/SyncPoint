/*
  Warnings:

  - You are about to drop the column `daysAvailableId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `meetingId` on the `Availability` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Availability" DROP CONSTRAINT "Availability_meetingId_fkey";

-- AlterTable
ALTER TABLE "public"."Availability" DROP COLUMN "daysAvailableId",
DROP COLUMN "meetingId";
