/*
  Warnings:

  - Added the required column `userClerkEmail` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userClerkName` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Meeting" ADD COLUMN     "userClerkEmail" TEXT NOT NULL,
ADD COLUMN     "userClerkName" TEXT NOT NULL;
