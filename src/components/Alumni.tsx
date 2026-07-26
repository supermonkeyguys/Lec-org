import {
  alumniMembers,
  alumniContent,
  outcomeLabels,
  type AlumniOutcome,
} from "@/data/alumni";

const outcomeClassNames: Record<AlumniOutcome, string> = {
  recommendation: "bg-sky-100 text-sky-700",
  "graduate-exam": "bg-violet-100 text-violet-700",
  employment: "bg-emerald-100 text-emerald-700",
};

const alumniByCohort = Array.from(
  alumniMembers.reduce((groups, member) => {
    const cohortMembers = groups.get(member.cohort) ?? [];
    cohortMembers.push(member);
    groups.set(member.cohort, cohortMembers);
    return groups;
  }, new Map<number, typeof alumniMembers>()),
).sort(([firstCohort], [secondCohort]) => secondCohort - firstCohort);

export default function Alumni() {
  return (
    <section
      id="alumni"
      className="site-section flex flex-col justify-center px-6 py-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">
            {alumniContent.eyebrow}
          </p>
          <h2 className="mb-4 text-4xl font-bold text-ink sm:text-5xl">
            {alumniContent.title}
          </h2>
          <p className="mb-16 text-lg text-muted">
            {alumniContent.statusMessage}
          </p>
        </div>

        {alumniByCohort.length === 0 ? (
          <p className="text-center text-muted">{alumniContent.emptyMessage}</p>
        ) : (
          <div className="space-y-12">
            {alumniByCohort.map(([cohort, cohortMembers]) => (
              <section key={cohort} aria-labelledby={`alumni-cohort-${cohort}`}>
                <h3
                  id={`alumni-cohort-${cohort}`}
                  className="mb-5 font-mono text-lg font-bold text-ink"
                >
                  {cohort} 届
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {cohortMembers.map((member) => (
                    <article key={member.id} className="sketchy-border bg-card p-5">
                      <div className="flex items-start gap-4">
                        <span
                          aria-hidden="true"
                          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink/10 text-xl font-bold text-ink"
                        >
                          {member.name.slice(0, 1)}
                        </span>
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h4 className="text-lg font-bold text-ink">{member.name}</h4>
                            {member.outcome && (
                              <span
                                className={`rounded-full px-2 py-0.5 font-mono text-xs ${outcomeClassNames[member.outcome]}`}
                              >
                                {outcomeLabels[member.outcome]}
                              </span>
                            )}
                          </div>
                          {member.organization && (
                            <p className="text-muted">{member.organization}</p>
                          )}
                          {member.detail && (
                            <p className="mt-1 text-sm text-fade">{member.detail}</p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
