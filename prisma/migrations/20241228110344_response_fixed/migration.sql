/*
  Warnings:

  - You are about to drop the `_FormFieldToResponseCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FormFieldToResponseCategory" DROP CONSTRAINT "_FormFieldToResponseCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_FormFieldToResponseCategory" DROP CONSTRAINT "_FormFieldToResponseCategory_B_fkey";

-- AlterTable
ALTER TABLE "ResponseCategory" ADD COLUMN     "formFieldId" TEXT;

-- AlterTable
ALTER TABLE "Responses" ADD COLUMN     "orderNo" INTEGER;

-- DropTable
DROP TABLE "_FormFieldToResponseCategory";

-- AddForeignKey
ALTER TABLE "ResponseCategory" ADD CONSTRAINT "ResponseCategory_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
