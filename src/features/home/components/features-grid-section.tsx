import { Leaf, ShieldCheck, Users2, Clock } from "lucide-react";

const FEATURES = [
  { icon: Leaf, title: "Nutritious Food", description: "Balanced meals made with fresh ingredients for a healthy you." },
  { icon: ShieldCheck, title: "Hygienic Kitchen", description: "Clean, sanitized, and well maintained kitchen for your safety." },
  { icon: Users2, title: "Student Friendly", description: "Affordable plans and a homely environment that feels like home." },
  { icon: Clock, title: "On-Time Service", description: "Meals served on time, every time. Right when you need it." },
];

export function FeaturesGridSection() {
  return (
    <section className="bg-green-50/60 py-20 dark:bg-stone-900">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-green-700 uppercase dark:text-green-400">
            Why choose us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
            More Than Just Meals
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-green-100 bg-white p-6 text-center shadow-sm transition hover:shadow-md dark:border-stone-800 dark:bg-stone-950"
            >
              <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
              <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
