/*
  Warnings:

  - You are about to drop the column `email_address` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailAddress]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailAddress` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_address_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_address",
ADD COLUMN     "emailAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_emailAddress_key" ON "users"("emailAddress");
