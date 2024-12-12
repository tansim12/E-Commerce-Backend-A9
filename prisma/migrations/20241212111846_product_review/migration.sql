-- CreateTable
CREATE TABLE "productReviews" (
    "userId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userMessage" TEXT,
    "shopMessage" TEXT,
    "rating" INTEGER,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "productReviews_pkey" PRIMARY KEY ("userId","paymentId")
);

-- AddForeignKey
ALTER TABLE "productReviews" ADD CONSTRAINT "productReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productReviews" ADD CONSTRAINT "productReviews_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
