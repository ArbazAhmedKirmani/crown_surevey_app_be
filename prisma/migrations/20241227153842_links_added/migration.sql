/*
  Warnings:

  - Made the column `mapperName` on table `FormField` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "links" JSONB,
ALTER COLUMN "mapperName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "reference" TEXT;
