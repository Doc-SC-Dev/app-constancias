-- DropForeignKey
ALTER TABLE "request" DROP CONSTRAINT "request_certificateId_fkey";

-- AlterTable
ALTER TABLE "request" ALTER COLUMN "certificateId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "certificate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
