/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_productId_key" ON "Wishlist"("productId");
