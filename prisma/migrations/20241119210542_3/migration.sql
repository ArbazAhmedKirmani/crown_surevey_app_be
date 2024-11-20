/*
  Warnings:

  - You are about to drop the column `jobsId` on the `FloorPlan` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED', 'CANCELED');

-- DropForeignKey
ALTER TABLE "FloorPlan" DROP CONSTRAINT "FloorPlan_jobsId_fkey";

-- AlterTable
ALTER TABLE "FloorPlan" DROP COLUMN "jobsId";

-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "prefix" TEXT;

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "ResponseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "ResponseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FormFieldToResponses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormFieldToResponses_AB_unique" ON "_FormFieldToResponses"("A", "B");

-- CreateIndex
CREATE INDEX "_FormFieldToResponses_B_index" ON "_FormFieldToResponses"("B");

-- AddForeignKey
ALTER TABLE "Responses" ADD CONSTRAINT "Responses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ResponseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormFieldToResponses" ADD CONSTRAINT "_FormFieldToResponses_A_fkey" FOREIGN KEY ("A") REFERENCES "FormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormFieldToResponses" ADD CONSTRAINT "_FormFieldToResponses_B_fkey" FOREIGN KEY ("B") REFERENCES "Responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
