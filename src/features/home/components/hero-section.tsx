import { Leaf, Salad, Users2, UtensilsCrossed } from "lucide-react";

const MINI_FEATURES = [
  { icon: Leaf, label: "Hygienic & Safe" },
  { icon: Salad, label: "Nutritious Meals" },
  { icon: Users2, label: "Student Friendly" },
];

export function HeroSection({
  businessName,
  tagline,
  heroImageUrl,
}: {
  businessName: string;
  tagline: string;
  heroImageUrl: string;
}) {
  return (
    <section className="bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-green-700 uppercase dark:text-green-400">
            Good food. Better life.
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl dark:text-white">
            {businessName}
          </h1>
          <p className="mt-4 max-w-md text-lg text-stone-600 dark:text-stone-300">{tagline}</p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
            {MINI_FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                  <Icon className="size-4.5" />
                </span>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-4/3 w-full max-w-md">
          <div
            aria-hidden
            className="absolute -top-4 -left-4 grid grid-cols-4 gap-1.5 opacity-40"
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="size-1.5 rounded-full bg-green-300 dark:bg-green-800" />
            ))}
          </div>

          <div className="relative size-full overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl shadow-xl">
            {heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded photo served from /public/uploads
              <img src={heroImageUrl} alt={businessName} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-800">
                <UtensilsCrossed className="size-24 text-white/80" strokeWidth={1.5} />
              </div>
            )}
          </div>

          <span
            aria-hidden
            className="absolute -right-3 -bottom-3 flex size-14 items-center justify-center rounded-full bg-white shadow-lg dark:bg-stone-800"
          >
            <Leaf className="size-6 text-green-700 dark:text-green-400" />
          </span>
        </div>
      </div>
    </section>
  );
}
