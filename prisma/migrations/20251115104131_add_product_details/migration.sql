-- CreateTable
CREATE TABLE "ProductDetails" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "motor" TEXT,
    "blades" TEXT,
    "speedLevels" TEXT,
    "remote" TEXT,
    "timer" TEXT,
    "oscillation" TEXT,
    "noiseLevel" TEXT,
    "dimensions" TEXT,
    "warranty" TEXT,
    "motorType" TEXT,
    "height" TEXT,
    "bladeDiameter" TEXT,
    "baseeDiameter" TEXT,
    "weight" TEXT,
    "powerConsumption" TEXT,
    "airFlow" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDetails_productId_key" ON "ProductDetails"("productId");

-- AddForeignKey
ALTER TABLE "ProductDetails" ADD CONSTRAINT "ProductDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
