-- DropForeignKey
ALTER TABLE "Jobs" DROP CONSTRAINT "Jobs_customerId_fkey";

-- AlterTable
ALTER TABLE "Jobs" ALTER COLUMN "customerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
