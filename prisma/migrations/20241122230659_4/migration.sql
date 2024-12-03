/*
  Warnings:

  - You are about to drop the `_FormFieldToResponses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FormFieldToResponses" DROP CONSTRAINT "_FormFieldToResponses_A_fkey";

-- DropForeignKey
ALTER TABLE "_FormFieldToResponses" DROP CONSTRAINT "_FormFieldToResponses_B_fkey";

-- DropTable
DROP TABLE "_FormFieldToResponses";

-- CreateTable
CREATE TABLE "_FormFieldToResponseCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormFieldToResponseCategory_AB_unique" ON "_FormFieldToResponseCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_FormFieldToResponseCategory_B_index" ON "_FormFieldToResponseCategory"("B");

-- AddForeignKey
ALTER TABLE "_FormFieldToResponseCategory" ADD CONSTRAINT "_FormFieldToResponseCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "FormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormFieldToResponseCategory" ADD CONSTRAINT "_FormFieldToResponseCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "ResponseCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
