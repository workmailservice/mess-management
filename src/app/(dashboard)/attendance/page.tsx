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
          Track breakfast, lunch, and dinner attendance. Everyone defaults to taken — toggle off for a customer who
          skipped a meal.
        </p>
      </div>
      <AttendanceGrid />
    </div>
  );
}
