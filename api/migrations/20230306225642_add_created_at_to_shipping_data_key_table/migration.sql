-- AlterTable
ALTER TABLE "ShippingDataKey" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "ShippingDataKey_createdAt_idx" ON "ShippingDataKey"("createdAt");
