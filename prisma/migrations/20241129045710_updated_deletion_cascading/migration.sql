-- DropForeignKey
ALTER TABLE "Folio" DROP CONSTRAINT "Folio_folioDataId_fkey";

-- DropForeignKey
ALTER TABLE "FolioItem" DROP CONSTRAINT "FolioItem_folioId_fkey";

-- AddForeignKey
ALTER TABLE "Folio" ADD CONSTRAINT "Folio_folioDataId_fkey" FOREIGN KEY ("folioDataId") REFERENCES "FolioData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolioItem" ADD CONSTRAINT "FolioItem_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "Folio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
