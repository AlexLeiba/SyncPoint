/*
  Warnings:

  - Added the required column `bookedClerkId` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Meeting" ADD COLUMN     "bookedClerkId" TEXT NOT NULL;
