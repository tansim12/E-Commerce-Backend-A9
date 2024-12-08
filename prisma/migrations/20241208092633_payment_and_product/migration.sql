-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'cancel', 'confirm');

-- CreateTable
CREATE TABLE "PaymentAndProduct" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "buyQuantity" INTEGER NOT NULL,
    "isPromoUse" BOOLEAN NOT NULL DEFAULT false,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentAndProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT,
    "txId" TEXT NOT NULL,
    "payment_type" TEXT,
    "approval_code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentAndProduct_paymentId_productId_key" ON "PaymentAndProduct"("paymentId", "productId");

-- AddForeignKey
ALTER TABLE "PaymentAndProduct" ADD CONSTRAINT "PaymentAndProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAndProduct" ADD CONSTRAINT "PaymentAndProduct_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
