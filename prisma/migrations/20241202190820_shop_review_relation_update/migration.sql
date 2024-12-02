/*
  Warnings:

  - The primary key for the `shopReviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `shopReviews` table. All the data in the column will be lost.
  - The `rating` column on the `shopReviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `details` on table `shopReviews` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "shopReviews_shopId_key";

-- DropIndex
DROP INDEX "shopReviews_userId_key";

-- AlterTable
ALTER TABLE "shopReviews" DROP CONSTRAINT "shopReviews_pkey",
DROP COLUMN "id",
ALTER COLUMN "details" SET NOT NULL,
DROP COLUMN "rating",
ADD COLUMN     "rating" INTEGER,
ADD CONSTRAINT "shopReviews_pkey" PRIMARY KEY ("userId", "shopId");
