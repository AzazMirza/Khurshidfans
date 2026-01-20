ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_orderId_productId_size_color_key"
UNIQUE ("orderId", "productId", "size", "color");
