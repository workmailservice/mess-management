-- Attendance is redesigned from a per-meal (breakfast/lunch/dinner) taken/skipped
-- toggle into a single daily tiffin count per customer. Existing rows predate this
-- shape and are dev-only test data, so they're cleared rather than converted.
TRUNCATE TABLE "Attendance";

DROP INDEX "Attendance_customerId_date_mealType_key";

ALTER TABLE "Attendance"
  DROP COLUMN "mealType",
  DROP COLUMN "status",
  ADD COLUMN "count" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "Attendance_customerId_date_key" ON "Attendance"("customerId", "date");

DROP TYPE "MealType";
DROP TYPE "AttendanceStatus";
