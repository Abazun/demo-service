/*
  Warnings:

  - You are about to drop the column `email` on the `Folio` table. All the data in the column will be lost.
  - You are about to drop the column `fee` on the `Folio` table. All the data in the column will be lost.
  - You are about to drop the column `feeItem` on the `Folio` table. All the data in the column will be lost.
  - Added the required column `name` to the `Folio` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Folio_email_key";

-- AlterTable
ALTER TABLE "Folio" DROP COLUMN "email",
DROP COLUMN "fee",
DROP COLUMN "feeItem",
ADD COLUMN     "folioDataId" INTEGER,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FolioData" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "FolioData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FolioItem" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemFee" MONEY NOT NULL,
    "folioId" INTEGER,

    CONSTRAINT "FolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FolioData_email_key" ON "FolioData"("email");

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_folioDataId_fkey" FOREIGN KEY ("folioDataId") REFERENCES "FolioData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolioItem" ADD CONSTRAINT "FolioItem_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "Folio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
