/*
  Warnings:

  - You are about to drop the `shopFollow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "shopFollow" DROP CONSTRAINT "shopFollow_shopId_fkey";

-- DropForeignKey
ALTER TABLE "shopFollow" DROP CONSTRAINT "shopFollow_userId_fkey";

-- DropTable
DROP TABLE "shopFollow";

-- CreateTable
CREATE TABLE "shopFollows" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "shopFollows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shopFollows_shopId_key" ON "shopFollows"("shopId");

-- AddForeignKey
ALTER TABLE "shopFollows" ADD CONSTRAINT "shopFollows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopFollows" ADD CONSTRAINT "shopFollows_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
