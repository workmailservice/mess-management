import { ChefHat, ArrowRight } from "lucide-react";

export function CtaBannerSection({ businessName }: { businessName: string }) {
  return (
    <section className="bg-green-900 dark:bg-green-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-4">
          <span className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white sm:flex">
            <ChefHat className="size-6" />
          </span>
          <p className="text-lg font-bold text-white">
            Good Food. Good Mood.
            <br />
            Every Day.
          </p>
        </div>

        <div className="hidden h-12 w-px bg-white/15 md:block" />

        <p className="max-w-xs text-sm text-green-100">
          Join {businessName} and experience the joy of homely meals.
        </p>

        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-green-900 shadow-sm transition hover:bg-green-50"
        >
          Get in Touch
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}
