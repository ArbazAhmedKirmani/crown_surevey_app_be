/*
  Warnings:

  - You are about to drop the column `color` on the `FormField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormField" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "FormSections" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#bcb495';
