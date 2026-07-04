import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import type { getInvoiceDetail } from "@/features/billing/services/billing-service";

type InvoiceDetail = Awaited<ReturnType<typeof getInvoiceDetail>>;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#111827" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  businessName: { fontSize: 18, fontWeight: 700 },
  invoiceTitle: { fontSize: 14, fontWeight: 700, textAlign: "right" },
  muted: { color: "#6b7280" },
  section: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#6b7280" },
  table: { borderTopWidth: 1, borderTopColor: "#e5e7eb", marginTop: 8 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingVertical: 6 },
  tableHeaderRow: { flexDirection: "row", paddingVertical: 6, fontWeight: 700 },
  colDescription: { flex: 3 },
  colAmount: { flex: 1, textAlign: "right" },
  summary: { marginTop: 16, alignSelf: "flex-end", width: 220 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  summaryTotal: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 1, borderTopColor: "#111827", fontWeight: 700 },
  badge: { fontSize: 9, fontWeight: 700, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4 },
  qrSection: { marginTop: 24, alignItems: "center" },
  qrImage: { width: 120, height: 120 },
});

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PAID: { bg: "#dcfce7", text: "#166534" },
  PARTIAL: { bg: "#fef9c3", text: "#854d0e" },
  PENDING: { bg: "#f3f4f6", text: "#374151" },
  OVERDUE: { bg: "#fee2e2", text: "#991b1b" },
  CANCELLED: { bg: "#f3f4f6", text: "#6b7280" },
};

interface InvoicePdfProps {
  invoice: InvoiceDetail;
  businessName: string;
  qrDataUrl: string | null;
}

export function InvoiceDocument({ invoice, businessName, qrDataUrl }: InvoicePdfProps) {
  const statusColor = STATUS_COLORS[invoice.status] ?? STATUS_COLORS.PENDING;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.businessName}>{businessName}</Text>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.muted}>
              {MONTH_NAMES[invoice.month - 1]} {invoice.year}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { flexDirection: "row", justifyContent: "space-between" }]}>
          <View>
            <Text style={{ fontWeight: 700, marginBottom: 2 }}>{invoice.customer.name}</Text>
            <Text style={styles.muted}>{invoice.customer.phone}</Text>
            {invoice.customer.address && <Text style={styles.muted}>{invoice.customer.address}</Text>}
          </View>
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice ID: </Text>
              <Text>{invoice.id.slice(-10).toUpperCase()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Due date: </Text>
              <Text>{new Date(invoice.dueDate).toLocaleDateString("en-IN", { timeZone: "UTC" })}</Text>
            </View>
            <View style={[styles.row, { alignItems: "center" }]}>
              <Text style={styles.label}>Status: </Text>
              <Text style={[styles.badge, { backgroundColor: statusColor.bg, color: statusColor.text }]}>{invoice.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colDescription}>Description</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colAmount}>₹{Number(item.amount).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Total</Text>
            <Text>₹{Number(invoice.amount).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Paid</Text>
            <Text>₹{Number(invoice.paidTotal).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text>Balance due</Text>
            <Text>₹{Number(invoice.balance).toFixed(2)}</Text>
          </View>
        </View>

        {invoice.payments.length > 0 && (
          <View style={[styles.section, { marginTop: 24 }]}>
            <Text style={{ fontWeight: 700, marginBottom: 6 }}>Payment history</Text>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.colDescription}>Date</Text>
                <Text style={styles.colDescription}>Method</Text>
                <Text style={styles.colAmount}>Amount</Text>
              </View>
              {invoice.payments.map((payment) => (
                <View key={payment.id} style={styles.tableRow}>
                  <Text style={styles.colDescription}>
                    {new Date(payment.paidAt).toLocaleDateString("en-IN", { timeZone: "UTC" })}
                  </Text>
                  <Text style={styles.colDescription}>{payment.method}</Text>
                  <Text style={styles.colAmount}>₹{Number(payment.amount).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {qrDataUrl && (
          <View style={styles.qrSection}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image is a PDF primitive, not an HTML img; it has no alt prop */}
            <Image src={qrDataUrl} style={styles.qrImage} />
            <Text style={[styles.muted, { marginTop: 4 }]}>Scan to pay ₹{Number(invoice.balance).toFixed(2)} via UPI</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
