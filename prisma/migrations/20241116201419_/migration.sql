/*
  Warnings:

  - Added the required column `height` to the `FloorPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `FloorPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FloorPlan" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
