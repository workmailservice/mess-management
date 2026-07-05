import { Sunrise, Sun, Moon, Clock } from "lucide-react";

const TIMING_ICONS = [Sunrise, Sun, Moon];

export function RatesSection({ rateDisplay, mealTimings }: { rateDisplay: string; mealTimings: string }) {
  const timingParts = mealTimings
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section id="rates" className="bg-stone-50 py-20 dark:bg-stone-900">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="text-xs font-semibold tracking-widest text-green-700 uppercase dark:text-green-400">
          Mess rate
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">Simple, Fair Pricing</h2>

        <div className="mt-8 rounded-3xl border border-green-100 bg-white p-10 shadow-sm dark:border-stone-800 dark:bg-stone-950">
          <p className="text-2xl font-bold text-green-700 sm:text-3xl dark:text-green-400">{rateDisplay}</p>

          {timingParts.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-green-100 pt-8 dark:border-stone-800">
              {timingParts.map((part, i) => {
                const Icon = TIMING_ICONS[i] ?? Clock;
                return (
                  <div key={part} className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 dark:bg-stone-800">
                    <Icon className="size-4 text-green-700 dark:text-green-400" />
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{part}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
