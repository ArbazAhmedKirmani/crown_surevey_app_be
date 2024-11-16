/*
  Warnings:

  - You are about to drop the column `formFieldId` on the `FormField` table. All the data in the column will be lost.
  - You are about to drop the column `formId` on the `FormField` table. All the data in the column will be lost.
  - You are about to drop the column `hasAttachment` on the `FormField` table. All the data in the column will be lost.
  - You are about to drop the column `formFieldId` on the `FormFieldSchema` table. All the data in the column will be lost.
  - Added the required column `formSectionId` to the `FormField` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FormField" DROP CONSTRAINT "FormField_formFieldId_fkey";

-- DropForeignKey
ALTER TABLE "FormField" DROP CONSTRAINT "FormField_formId_fkey";

-- DropForeignKey
ALTER TABLE "FormFieldSchema" DROP CONSTRAINT "FormFieldSchema_formFieldId_fkey";

-- AlterTable
ALTER TABLE "FormField" DROP COLUMN "formFieldId",
DROP COLUMN "formId",
DROP COLUMN "hasAttachment",
ADD COLUMN     "formSectionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FormFieldSchema" DROP COLUMN "formFieldId";

-- CreateTable
CREATE TABLE "FormSections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "formId" INTEGER NOT NULL,
    "formFieldId" TEXT,

    CONSTRAINT "FormSections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormSections" ADD CONSTRAINT "FormSections_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSections" ADD CONSTRAINT "FormSections_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
