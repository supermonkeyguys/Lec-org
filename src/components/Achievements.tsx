import { achievementsContent } from "@/data/achievements";
import SectionShell from "./SectionShell";

export default function Achievements() {
  return (
    <SectionShell
      id="achievements"
      className="flex flex-col justify-center px-6 py-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">
            {achievementsContent.eyebrow}
          </p>
          <h2 className="mb-4 text-4xl font-bold text-ink sm:text-5xl">
            {achievementsContent.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            {achievementsContent.subtitle}
          </p>
          <p className="mt-4 font-mono text-xs text-fade">
            {achievementsContent.statusMessage}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {achievementsContent.stats.map((stat) => (
            <article key={stat.label} className="sketchy-border bg-card p-5 text-center">
              <h3 className="text-xl font-bold text-ink">
                {stat.label} {stat.value}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {stat.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3" aria-label="赛事标签">
          {achievementsContent.eventTags.map((eventTag) => (
            <span
              key={eventTag}
              className="sketchy-border-sm bg-card px-4 py-1.5 font-mono text-xs text-ink"
            >
              {eventTag}
            </span>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
