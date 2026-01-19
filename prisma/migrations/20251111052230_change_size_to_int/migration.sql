/*
  Warnings:

  - The `size` column on the `OrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `size` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "size",
ADD COLUMN     "size" INTEGER;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "size" INTEGER;
