import "server-only";
import QRCode from "qrcode";

/** Builds a `upi://pay` deep link that any UPI app (GPay, PhonePe, Paytm, ...) can scan and pre-fill. */
export function buildUpiUri(params: { upiId: string; payeeName: string; amount: number; note: string }) {
  const query = new URLSearchParams({
    pa: params.upiId,
    pn: params.payeeName,
    am: params.amount.toFixed(2),
    cu: "INR",
    tn: params.note,
  });
  return `upi://pay?${query.toString()}`;
}

/** Returns a base64 PNG data URL of the UPI payment QR, or null if no UPI ID is configured / nothing owed. */
export async function generateUpiQrDataUrl(params: {
  upiId: string | undefined;
  payeeName: string;
  amount: number;
  note: string;
}): Promise<string | null> {
  if (!params.upiId || params.amount <= 0) return null;
  const uri = buildUpiUri({ upiId: params.upiId, payeeName: params.payeeName, amount: params.amount, note: params.note });
  return QRCode.toDataURL(uri, { margin: 1, width: 240 });
}
