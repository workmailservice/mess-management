import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getInvoiceDetail } from "@/features/billing/services/billing-service";
import { getPaymentSettings } from "@/features/settings/services/settings-service";
import { InvoiceDocument } from "@/features/billing/pdf/invoice-document";
import { generateUpiQrDataUrl } from "@/lib/upi";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const invoice = await getInvoiceDetail(id);
    const settings = await getPaymentSettings();
    const businessName = settings?.businessName ?? "Mess Management";

    const qrDataUrl = await generateUpiQrDataUrl({
      upiId: settings?.upiId,
      payeeName: businessName,
      amount: Number(invoice.balance),
      note: `Invoice ${invoice.id.slice(-10).toUpperCase()}`,
    });

    const buffer = await renderToBuffer(
      <InvoiceDocument invoice={invoice} businessName={businessName} qrDataUrl={qrDataUrl} />,
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${invoice.id.slice(-10)}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate PDF.";
    const status = message.includes("permission") ? 403 : message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
