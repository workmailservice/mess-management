"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useOutstandingReminders, useLogReminderSent } from "@/features/reminders/hooks/use-reminders";
import { buildReminderColumns, type ReminderRow } from "@/features/reminders/components/columns";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function RemindersView() {
  const { data, isLoading, isError, refetch } = useOutstandingReminders();
  const logReminder = useLogReminderSent();

  function handleSend(row: ReminderRow) {
    // Open first (synchronously, in the click handler) so browsers don't block the popup.
    window.open(buildWhatsAppLink(row.customerPhone, row.message), "_blank", "noopener,noreferrer");
    logReminder.mutate({ customerId: row.customerId, invoiceId: row.invoiceId, message: row.message });
  }

  const columns = useMemo(() => buildReminderColumns(handleSend), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      searchColumn="customerName"
      searchPlaceholder="Search by customer..."
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      emptyTitle="Nothing outstanding"
      emptyDescription="Every customer is paid up — no reminders needed."
    />
  );
}
