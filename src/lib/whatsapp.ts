const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** wa.me requires bare digits (country code + number), no "+", spaces, or dashes. */
function toWaMeDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function buildReminderMessage(params: {
  customerName: string;
  balance: number;
  month: number;
  year: number;
  dueDate: Date;
  businessName: string;
}) {
  const dueDateStr = params.dueDate.toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });
  return (
    `Hi ${params.customerName}, this is a friendly reminder that your mess bill of ` +
    `₹${params.balance.toFixed(2)} for ${MONTH_NAMES[params.month - 1]} ${params.year} was due on ${dueDateStr}. ` +
    `Please make the payment at your earliest convenience. Thank you! - ${params.businessName}`
  );
}

export function buildWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${toWaMeDigits(phone)}?text=${encodeURIComponent(message)}`;
}

export function buildAttendanceMessage(params: {
  customerName: string;
  monthLabel: string;
  totalTiffins: number;
  businessName: string;
}) {
  return (
    `Hi ${params.customerName}, your tiffin attendance for ${params.monthLabel} is ` +
    `${params.totalTiffins} tiffin${params.totalTiffins === 1 ? "" : "s"} so far. Thank you! - ${params.businessName}`
  );
}
