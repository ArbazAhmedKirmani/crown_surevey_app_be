-- AlterTable
ALTER TABLE "FormFieldReference" ADD COLUMN     "fieldId" TEXT;

-- AddForeignKey
ALTER TABLE "FormFieldReference" ADD CONSTRAINT "FormFieldReference_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "FormField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
