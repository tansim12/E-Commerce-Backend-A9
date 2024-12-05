-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "flashSaleDiscount" INTEGER DEFAULT 0,
ADD COLUMN     "flashSaleEndDate" TIMESTAMP(3),
ADD COLUMN     "flashSaleStartDate" TIMESTAMP(3),
ALTER COLUMN "subCategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "subCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
