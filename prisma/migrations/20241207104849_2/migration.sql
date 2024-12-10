/*
  Warnings:

  - The values [TABLE] on the enum `FormFieldType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FormFieldType_new" AS ENUM ('CHECKBOX', 'RADIO', 'TEXTAREA', 'INPUT', 'FILE', 'TABLE_ELEMENT', 'SENTENCE', 'DATE', 'ACCOMODATION');
ALTER TABLE "FormField" ALTER COLUMN "type" TYPE "FormFieldType_new" USING ("type"::text::"FormFieldType_new");
ALTER TYPE "FormFieldType" RENAME TO "FormFieldType_old";
ALTER TYPE "FormFieldType_new" RENAME TO "FormFieldType";
DROP TYPE "FormFieldType_old";
COMMIT;
