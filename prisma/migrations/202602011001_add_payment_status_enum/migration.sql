-- 1️⃣ Create enum type if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'PaymentStatus'
    ) THEN
        CREATE TYPE "PaymentStatus" AS ENUM (
            'PENDING',
            'PAID',
            'FAILED',
            'REFUNDED'
        );
    END IF;
END $$;

-- 2️⃣ Add column (nullable first, safe for live DB)
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "paymentStatus" "PaymentStatus";

-- 3️⃣ Backfill existing rows
UPDATE "Order"
SET "paymentStatus" = 'PENDING'
WHERE "paymentStatus" IS NULL;

-- 4️⃣ Set default for new rows
ALTER TABLE "Order"
ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';

-- 5️⃣ Make column NOT NULL (safe now)
ALTER TABLE "Order"
ALTER COLUMN "paymentStatus" SET NOT NULL;
