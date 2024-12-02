/*
  Warnings:

  - The primary key for the `shopFollows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `shopFollows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shopFollows" DROP CONSTRAINT "shopFollows_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "shopFollows_pkey" PRIMARY KEY ("userId", "shopId");
