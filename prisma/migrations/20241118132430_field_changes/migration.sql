-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "attachments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "placeholder" TEXT,
ADD COLUMN     "rating" BOOLEAN NOT NULL DEFAULT false;
