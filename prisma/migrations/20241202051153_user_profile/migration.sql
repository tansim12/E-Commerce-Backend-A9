/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "isDelete" BOOLEAN NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "gender" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userProfiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT NOT NULL,
    "coverPhoto" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "userProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userProfiles_email_key" ON "userProfiles"("email");

-- AddForeignKey
ALTER TABLE "userProfiles" ADD CONSTRAINT "userProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
