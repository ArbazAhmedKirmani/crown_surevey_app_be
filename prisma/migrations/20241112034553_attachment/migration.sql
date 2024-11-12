/*
  Warnings:

  - Made the column `mimeType` on table `Attachments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attachments" ALTER COLUMN "mimeType" SET NOT NULL;
