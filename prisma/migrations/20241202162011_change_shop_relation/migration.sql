-- DropForeignKey
ALTER TABLE "shopReviews" DROP CONSTRAINT "shopReviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "shops" DROP CONSTRAINT "shops_vendorId_fkey";

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopReviews" ADD CONSTRAINT "shopReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
