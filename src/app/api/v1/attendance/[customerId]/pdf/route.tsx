import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getCustomerAttendanceReport } from "@/features/attendance/services/attendance-service";
import { getPaymentSettings } from "@/features/settings/services/settings-service";
import { AttendanceReportDocument } from "@/features/attendance/pdf/attendance-report-document";
import { todayMonth } from "@/lib/date";

export async function GET(request: Request, context: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await context.params;
  const { searchParams } = new URL(request.url);
  const fallback = todayMonth();
  const year = Number(searchParams.get("year") ?? fallback.year);
  const month = Number(searchParams.get("month") ?? fallback.month);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid year or month." }, { status: 400 });
  }

  try {
    const report = await getCustomerAttendanceReport(customerId, year, month);
    const settings = await getPaymentSettings();
    const businessName = settings?.businessName ?? "Mess Management";

    const buffer = await renderToBuffer(
      <AttendanceReportDocument report={report} businessName={businessName} />,
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="attendance-${report.customer.name.replace(/\s+/g, "-").toLowerCase()}-${year}-${String(month).padStart(2, "0")}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate PDF.";
    const status = message.includes("permission") ? 403 : message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
