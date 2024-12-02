/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- AlterTable
ALTER TABLE "userProfiles" ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "gender" "Gender",
ALTER COLUMN "profilePhoto" DROP NOT NULL,
ALTER COLUMN "coverPhoto" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "contactNumber",
DROP COLUMN "gender",
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active',
ALTER COLUMN "isDelete" SET DEFAULT false,
ALTER COLUMN "lastPasswordChange" DROP NOT NULL;
