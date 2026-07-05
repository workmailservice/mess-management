export function SiteFooter({ businessName }: { businessName: string }) {
  return (
    <footer className="border-t border-white/10 bg-green-950 py-6 text-center text-sm text-green-200">
      © {new Date().getFullYear()} {businessName}. All rights reserved.
    </footer>
  );
}
