/*
  Warnings:

  - A unique constraint covering the columns `[formFieldId,jobId]` on the table `JobFields` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "FormFieldType" ADD VALUE 'ACCOMODATION';

-- CreateIndex
CREATE UNIQUE INDEX "JobFields_formFieldId_jobId_key" ON "JobFields"("formFieldId", "jobId");
