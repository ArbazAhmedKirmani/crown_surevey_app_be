/*
  Warnings:

  - You are about to drop the column `data` on the `Jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "data";

-- CreateTable
CREATE TABLE "JobFields" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "formFieldId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "JobFields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobFields" ADD CONSTRAINT "JobFields_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobFields" ADD CONSTRAINT "JobFields_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
