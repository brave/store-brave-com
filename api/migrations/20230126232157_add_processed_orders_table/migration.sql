-- CreateTable
CREATE TABLE "ProcessedOrder" (
    "id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ProcessedOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedOrder_idempotency_key_key" ON "ProcessedOrder"("idempotency_key");
