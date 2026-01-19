-- DropForeignKey
ALTER TABLE "public"."ProductDetails" DROP CONSTRAINT "ProductDetails_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProductDetails" ADD CONSTRAINT "ProductDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
