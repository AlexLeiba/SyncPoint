/*
  Warnings:

  - Added the required column `userEmail` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userFullName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImage` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "userEmail" TEXT NOT NULL,
ADD COLUMN     "userFullName" TEXT NOT NULL,
ADD COLUMN     "userImage" TEXT NOT NULL;
