/*
  Warnings:

  - Added the required column `availabilityId` to the `DaysAvailable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DaysAvailable" ADD COLUMN     "availabilityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."DaysAvailable" ADD CONSTRAINT "DaysAvailable_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "public"."Availability"("id") ON DELETE CASCADE ON UPDATE CASCADE;
