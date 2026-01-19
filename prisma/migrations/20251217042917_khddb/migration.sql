-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "email" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "shippingMethod" TEXT;

-- CreateTable
CREATE TABLE "Theme" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "pr" TEXT NOT NULL,
    "se" TEXT NOT NULL,
    "tx" TEXT NOT NULL,
    "bg" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);
