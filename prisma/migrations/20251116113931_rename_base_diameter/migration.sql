/*
  Warnings:

  - You are about to drop the column `baseeDiameter` on the `ProductDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductDetails"
RENAME COLUMN "baseeDiameter" TO "baseDiameter";

