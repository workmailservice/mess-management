import { redirect } from "next/navigation";
import { AttendanceGrid } from "@/features/attendance/components/attendance-grid";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export default async function AttendancePage() {
  if (!(await hasPermission(PERMISSIONS.attendance.view))) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground">
          Track each customer&apos;s running tiffin count for the month. Click a day to add the tiffins taken that
          day — the cell shows the running total.
        </p>
      </div>
      <AttendanceGrid />
    </div>
  );
}
