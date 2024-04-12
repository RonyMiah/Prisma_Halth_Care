/*
  Warnings:

  - Made the column `instructions` on table `Prescription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Prescription" ALTER COLUMN "instructions" SET NOT NULL,
ALTER COLUMN "followUpDate" DROP NOT NULL;
