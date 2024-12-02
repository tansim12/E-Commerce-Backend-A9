/*
  Warnings:

  - Added the required column `lastPasswordChange` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastPasswordChange" TIMESTAMP(3) NOT NULL;
