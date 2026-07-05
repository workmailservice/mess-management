import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function ContactSection({
  businessName,
  address,
  phone,
  email,
}: {
  businessName: string;
  address: string;
  phone: string;
  email: string;
}) {
  const whatsappLink = buildWhatsAppLink(phone, `Hi! I'd like to know more about ${businessName}.`);

  return (
    <section id="contact" className="bg-green-900 pb-20 dark:bg-green-950">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="pt-16 text-xs font-semibold tracking-widest text-green-300 uppercase">Location & contact</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Visit or reach out to us</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <MapPin className="mx-auto size-6 text-green-300" />
            <p className="mt-3 text-sm text-green-50">{address}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <Phone className="mx-auto size-6 text-green-300" />
            <a href={`tel:${phone}`} className="mt-3 block text-sm text-green-50 hover:text-white hover:underline">
              {phone}
            </a>
          </div>

          {email && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Mail className="mx-auto size-6 text-green-300" />
              <a href={`mailto:${email}`} className="mt-3 block text-sm text-green-50 hover:text-white hover:underline">
                {email}
              </a>
            </div>
          )}
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-900 shadow-sm transition hover:bg-green-50"
        >
          <MessageCircle className="size-4" />
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
