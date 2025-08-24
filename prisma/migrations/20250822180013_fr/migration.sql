/*
  Warnings:

  - You are about to drop the column `availabilityId` on the `DaysAvailable` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DaysAvailable" DROP CONSTRAINT "DaysAvailable_availabilityId_fkey";

-- AlterTable
ALTER TABLE "public"."DaysAvailable" DROP COLUMN "availabilityId";
