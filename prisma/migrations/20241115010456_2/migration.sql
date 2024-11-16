/*
  Warnings:

  - You are about to drop the column `formFieldId` on the `FormSections` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FormSections" DROP CONSTRAINT "FormSections_formFieldId_fkey";

-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "prefix" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "FormSections" DROP COLUMN "formFieldId",
ADD COLUMN     "description" TEXT;

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_formSectionId_fkey" FOREIGN KEY ("formSectionId") REFERENCES "FormSections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
