import { UtensilsCrossed } from "lucide-react";

export function SiteHeader({ businessName }: { businessName: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-green-100 bg-stone-50/80 backdrop-blur dark:border-green-950 dark:bg-stone-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-green-700 text-white shadow-sm">
            <UtensilsCrossed className="size-4.5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">{businessName}</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 sm:flex dark:text-stone-300">
          <a href="#about" className="transition-colors hover:text-green-700 dark:hover:text-green-400">
            About
          </a>
          <a href="#rates" className="transition-colors hover:text-green-700 dark:hover:text-green-400">
            Rates
          </a>
          <a href="#contact" className="transition-colors hover:text-green-700 dark:hover:text-green-400">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
