-- Narrow joinDate to a date-only column (was a full timestamp) for consistency
-- with the other date-only fields (Attendance.date, Expense.date, Income.date).
ALTER TABLE "Customer"
  ALTER COLUMN "joinDate" TYPE DATE USING "joinDate"::date;

ALTER TABLE "Customer"
  ADD COLUMN "advancePaid" DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN "advancePending" DECIMAL(10,2) NOT NULL DEFAULT 0;
