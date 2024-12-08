/*
  Warnings:

  - You are about to drop the column `buyQuantity` on the `PaymentAndProduct` table. All the data in the column will be lost.
  - Added the required column `payTotalAmount` to the `PaymentAndProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectQuantity` to the `PaymentAndProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "PaymentAndProduct" DROP COLUMN "buyQuantity",
ADD COLUMN     "payTotalAmount" INTEGER NOT NULL,
ADD COLUMN     "selectQuantity" INTEGER NOT NULL;
