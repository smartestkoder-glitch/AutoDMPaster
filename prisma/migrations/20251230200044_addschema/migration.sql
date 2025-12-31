-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "parsedm";

-- CreateTable
CREATE TABLE "parsedm"."Pages" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marketMy" INTEGER NOT NULL,

    CONSTRAINT "Pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parsedm"."Slots" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "course" INTEGER NOT NULL,
    "marketPrice" INTEGER NOT NULL,
    "purpose" TEXT,
    "dealer" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "Slots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parsedm"."Slots" ADD CONSTRAINT "Slots_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "parsedm"."Pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
