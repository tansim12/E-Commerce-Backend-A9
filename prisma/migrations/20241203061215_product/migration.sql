-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "totalBuy" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL,
    "discount" INTEGER,
    "promo" TEXT,
    "isActivePromo" BOOLEAN NOT NULL DEFAULT false,
    "isFlashSaleOffer" BOOLEAN NOT NULL DEFAULT false,
    "shopId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalSubmitRating" INTEGER NOT NULL DEFAULT 0,
    "averageRating" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "isDelete" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_categoryId_key" ON "products"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "products_subCategoryId_key" ON "products"("subCategoryId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "subCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
