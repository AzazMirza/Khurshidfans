/*
  Warnings:

  - Added the required column `rating` to the `ProductReview` table without a default value. This is not possible if the table is not empty.
  - Made the column `reviewTitle` on table `ProductReview` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reviewDec` on table `ProductReview` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductReview" DROP CONSTRAINT "ProductReview_productId_fkey";

-- AlterTable
ALTER TABLE "ProductReview" DROP COLUMN "rating",
ADD COLUMN     "rating" INTEGER NOT NULL,
ALTER COLUMN "reviewTitle" SET NOT NULL,
ALTER COLUMN "reviewDec" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
