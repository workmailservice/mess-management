import { Users2, UtensilsCrossed, Sparkles } from "lucide-react";

export function AboutSection({
  aboutText,
  aboutImageUrl,
  customerCount,
}: {
  aboutText: string;
  aboutImageUrl: string;
  customerCount: number;
}) {
  const stats = [
    customerCount > 0 ? { icon: Users2, label: `${customerCount}+ Happy Customers` } : null,
    { icon: UtensilsCrossed, label: "3 Meals a Day" },
    { icon: Sparkles, label: "Fresh Ingredients Daily" },
  ].filter((s): s is { icon: typeof Users2; label: string } => s !== null);

  return (
    <section id="about" className="bg-white py-20 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-widest text-green-700 uppercase dark:text-green-400">
              About us
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
              Cooked with love,
              <br />
              <span className="text-green-700 dark:text-green-400">served with care.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-300">{aboutText}</p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
              {stats.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                    <Icon className="size-4.5" />
                  </span>
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="aspect-16/10 w-full overflow-hidden rounded-3xl shadow-lg">
            {aboutImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded photo served from /public/uploads
              <img src={aboutImageUrl} alt="Our mess" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-800">
                <UtensilsCrossed className="size-20 text-white/80" strokeWidth={1.5} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
