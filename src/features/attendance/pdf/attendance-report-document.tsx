import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { getCustomerAttendanceReport } from "@/features/attendance/services/attendance-service";

type AttendanceReport = Awaited<ReturnType<typeof getCustomerAttendanceReport>>;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#111827" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  businessName: { fontSize: 18, fontWeight: 700 },
  reportTitle: { fontSize: 14, fontWeight: 700, textAlign: "right" },
  muted: { color: "#6b7280" },
  section: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#6b7280" },
  summaryCards: { flexDirection: "row", gap: 8, marginBottom: 16 },
  summaryCard: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 6, padding: 8, alignItems: "center" },
  summaryCardValue: { fontSize: 14, fontWeight: 700 },
  summaryCardLabel: { fontSize: 8, color: "#6b7280", marginTop: 2 },
  grid: { flexDirection: "row", gap: 12 },
  gridColumn: { flex: 1 },
  table: { borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingVertical: 4, alignItems: "center" },
  tableHeaderRow: { flexDirection: "row", paddingVertical: 6, fontWeight: 700 },
  colDay: { flex: 1 },
  colStatus: { flex: 2 },
  colCount: { flex: 1, textAlign: "right" },
  badge: { fontSize: 8, fontWeight: 700, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, alignSelf: "flex-start" },
  takenBadge: { backgroundColor: "#dcfce7", color: "#166534" },
  notTakenBadge: { backgroundColor: "#fee2e2", color: "#991b1b" },
});

interface AttendanceReportPdfProps {
  report: AttendanceReport;
  businessName: string;
}

export function AttendanceReportDocument({ report, businessName }: AttendanceReportPdfProps) {
  const { customer, year, month, days, summary } = report;
  const midpoint = Math.ceil(days.length / 2);
  const leftDays = days.slice(0, midpoint);
  const rightDays = days.slice(midpoint);

  function renderDayRow(entry: (typeof days)[number]) {
    return (
      <View key={entry.day} style={styles.tableRow}>
        <Text style={styles.colDay}>{entry.day}</Text>
        <View style={styles.colStatus}>
          <Text style={[styles.badge, entry.taken ? styles.takenBadge : styles.notTakenBadge]}>
            {entry.taken ? "Taken" : "Not taken"}
          </Text>
        </View>
        <Text style={styles.colCount}>{entry.count}</Text>
      </View>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.businessName}>{businessName}</Text>
          <View>
            <Text style={styles.reportTitle}>TIFFIN ATTENDANCE REPORT</Text>
            <Text style={styles.muted}>
              {MONTH_NAMES[month - 1]} {year}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 700, marginBottom: 2 }}>{customer.name}</Text>
          <Text style={styles.muted}>{customer.phone}</Text>
        </View>

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardValue}>{summary.dayCount}</Text>
            <Text style={styles.summaryCardLabel}>Days in month</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryCardValue, { color: "#166534" }]}>{summary.daysTaken}</Text>
            <Text style={styles.summaryCardLabel}>Days taken</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryCardValue, { color: "#991b1b" }]}>{summary.daysNotTaken}</Text>
            <Text style={styles.summaryCardLabel}>Days not taken</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardValue}>{summary.totalTiffins}</Text>
            <Text style={styles.summaryCardLabel}>Total tiffins</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridColumn}>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.colDay}>Day</Text>
                <Text style={styles.colStatus}>Status</Text>
                <Text style={styles.colCount}>Tiffins</Text>
              </View>
              {leftDays.map(renderDayRow)}
            </View>
          </View>
          <View style={styles.gridColumn}>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.colDay}>Day</Text>
                <Text style={styles.colStatus}>Status</Text>
                <Text style={styles.colCount}>Tiffins</Text>
              </View>
              {rightDays.map(renderDayRow)}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
