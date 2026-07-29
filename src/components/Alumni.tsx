import { useState } from "react";
import { motion } from "framer-motion";
import {
  alumniMembers,
  alumniContent,
  outcomeLabels,
  type AlumniOutcome,
} from "@/data/alumni";
import { members } from "@/data/members";
import { cardReveal, usePrefersReducedMotion } from "@/config/animations";
import SectionShell from "./SectionShell";

const outcomeClassNames: Record<AlumniOutcome, string> = {
  recommendation: "bg-sky-100 text-sky-700",
  "graduate-exam": "bg-violet-100 text-violet-700",
  "further-study": "bg-violet-100 text-violet-700",
  employment: "bg-emerald-100 text-emerald-700",
};

type FeaturedMember = Pick<
  (typeof alumniMembers)[number],
  "id" | "name" | "cohort" | "outcome" | "organization"
>;

const featuredMembers: FeaturedMember[] = [
  ...members.map(({ id, name, cohort }) => ({ id, name, cohort })),
  ...alumniMembers,
];

const membersByCohort = Array.from(
  featuredMembers.reduce((groups, member) => {
    const cohortMembers = groups.get(member.cohort) ?? [];
    cohortMembers.push(member);
    groups.set(member.cohort, cohortMembers);
    return groups;
  }, new Map<number, FeaturedMember[]>()),
).sort(([firstCohort], [secondCohort]) => secondCohort - firstCohort);

export default function Alumni() {
  const [selectedGrade, setSelectedGrade] = useState(membersByCohort[0]?.[0]);
  const reducedMotion = usePrefersReducedMotion();
  const selectedMembers = membersByCohort.find(
    ([cohort]) => cohort === selectedGrade,
  )?.[1];

  return (
    <SectionShell
      id="alumni"
      className="flex flex-col justify-center px-6 py-16"
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

        {membersByCohort.length === 0 ? (
          <p className="text-center text-muted">{alumniContent.emptyMessage}</p>
        ) : (
          <div>
            <div
              aria-label="优秀成员年级"
              className="mb-8 flex flex-wrap justify-center gap-3"
              role="tablist"
            >
              {membersByCohort.map(([cohort]) => (
                <button
                  aria-controls={`alumni-grade-${cohort}`}
                  aria-selected={selectedGrade === cohort}
                  className={`sketchy-border px-5 py-2.5 font-mono text-sm font-bold transition-colors ${
                    selectedGrade === cohort
                      ? "bg-ink text-card"
                      : "bg-card text-muted hover:bg-ink/10 hover:text-ink"
                  }`}
                  key={cohort}
                  onClick={() => setSelectedGrade(cohort)}
                  role="tab"
                  type="button"
                >
                  {cohort}级
                </button>
              ))}
            </div>

            <div
              id={`alumni-grade-${selectedGrade}`}
              role="tabpanel"
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {selectedMembers?.map((member, index) => (
                  <motion.article
                    key={member.id}
                    {...cardReveal(Math.min(index * 0.05, 0.3), reducedMotion)}
                    className="sketchy-border bg-card p-5"
                  >
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
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
