/*
  Warnings:

  - Added the required column `order` to the `Sentences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sentences" ADD COLUMN     "order" INTEGER NOT NULL;
