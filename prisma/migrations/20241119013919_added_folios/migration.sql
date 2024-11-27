-- CreateTable
CREATE TABLE "Folio" (
    "id" SERIAL NOT NULL,
    "folioNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "feeItem" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Folio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folio_email_key" ON "Folio"("email");
