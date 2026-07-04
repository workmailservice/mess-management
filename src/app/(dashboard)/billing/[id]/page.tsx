import Link from "next/link";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecordPaymentButton } from "@/features/payments/components/record-payment-button";
import { getInvoiceDetail } from "@/features/billing/services/billing-service";
import { getPaymentSettings } from "@/features/settings/services/settings-service";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import { formatCurrency } from "@/lib/utils";
import { generateUpiQrDataUrl } from "@/lib/upi";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  PARTIAL: "secondary",
  PENDING: "outline",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await hasPermission(PERMISSIONS.billing.view))) {
    redirect("/dashboard");
  }

  const { id } = await params;

  let invoice;
  try {
    invoice = await getInvoiceDetail(id);
  } catch {
    notFound();
  }

  const settings = await getPaymentSettings();
  const balance = Number(invoice.balance);
  const canRecordPayment = balance > 0 && (await hasPermission(PERMISSIONS.payments.record));

  const qrDataUrl = await generateUpiQrDataUrl({
    upiId: settings?.upiId,
    payeeName: settings?.businessName ?? "Mess Management",
    amount: balance,
    note: `Invoice ${invoice.id.slice(-10).toUpperCase()}`,
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="-ml-2" render={<Link href="/billing" />} nativeButton={false}>
          <ArrowLeft className="size-4" />
          Billing
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" render={<a href={`/api/v1/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer" />} nativeButton={false}>
            <Download className="size-4" />
            Download PDF
          </Button>
          {canRecordPayment && <RecordPaymentButton customerId={invoice.customer.id} invoiceId={invoice.id} />}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>
              {invoice.customer.name} — {MONTH_NAMES[invoice.month - 1]} {invoice.year}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{invoice.customer.phone}</p>
          </div>
          <Badge variant={STATUS_VARIANT[invoice.status]}>{invoice.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="ml-auto w-56 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid</span>
              <span>{formatCurrency(invoice.paidTotal)}</span>
            </div>
            <div className="flex justify-between border-t pt-1 font-semibold">
              <span>Balance due</span>
              <span>{formatCurrency(invoice.balance)}</span>
            </div>
          </div>

          {invoice.payments.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium">Payment history</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{new Date(payment.paidAt).toLocaleDateString("en-IN", { timeZone: "UTC" })}</TableCell>
                      <TableCell>{payment.method.replace("_", " ")}</TableCell>
                      <TableCell className="text-muted-foreground">{payment.transactionRef || "—"}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {qrDataUrl && (
            <div className="flex flex-col items-center gap-2 border-t pt-6">
              <Image src={qrDataUrl} alt="UPI payment QR code" width={180} height={180} unoptimized />
              <p className="text-sm text-muted-foreground">Scan to pay {formatCurrency(invoice.balance)} via UPI</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
