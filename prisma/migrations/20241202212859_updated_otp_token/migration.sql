-- DropIndex
DROP INDEX "otpToken_userId_key";

-- AlterTable
ALTER TABLE "otpToken" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "otpToken_pkey" PRIMARY KEY ("id");
