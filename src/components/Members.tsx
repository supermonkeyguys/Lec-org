import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { members, type Member } from "@/data/members";
import { sectionFade } from "@/config/animations";

const cohorts = [...new Set(members.map((m) => m.cohort))].sort((a, b) => b - a);

const { currentCohorts, alumniCohorts } = cohorts.reduce(
  (acc, c) => {
    const rep = members.find((m) => m.cohort === c);
    if (rep?.status === "current") acc.currentCohorts.push(c);
    else acc.alumniCohorts.push(c);
    return acc;
  },
  { currentCohorts: [] as number[], alumniCohorts: [] as number[] }
);

function MemberCard({ member }: { member: Member }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="sketchy-border bg-card p-5 text-center"
    >
      <img
        src={member.avatar}
        alt={member.name}
        className="w-20 h-20 mx-auto mb-3 rounded-full"
        loading="lazy"
      />
      <h3 className="text-lg font-bold text-ink mb-1">{member.name}</h3>
      <p className="text-sm text-muted">{member.role}</p>
      {member.bio && (
        <p className="text-xs text-fade mt-2 line-clamp-2">{member.bio}</p>
      )}
      {member.status === "alumni" && (
        <span className="inline-block mt-2 px-2 py-0.5 text-xs sketchy-border-sm text-muted">
          Alumni
        </span>
      )}
    </motion.div>
  );
}

export default function Members() {
  const [activeCohort, setActiveCohort] = useState<number>(cohorts[0]);

  const filtered = useMemo(
    () => members.filter((m) => m.cohort === activeCohort),
    [activeCohort]
  );

  return (
    <section id="members" className="site-section flex flex-col justify-center py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div {...sectionFade}>
          <p className="font-mono text-xs text-muted mb-2 tracking-widest uppercase text-center">
            Our People
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-center mb-4">
            成员
          </h2>
          <p className="text-center text-muted mb-16 text-lg">
            每一位都是 LEC 不可或缺的一部分
          </p>
        </motion.div>

        {/* Cohort filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <span className="font-mono text-xs text-muted mr-2 self-center">在读</span>
          {currentCohorts.map((cohort) => (
            <button
              key={cohort}
              onClick={() => setActiveCohort(cohort)}
              className={`font-mono text-xs px-4 py-2 sketchy-border-sm transition-all ${
                activeCohort === cohort
                  ? "bg-ink text-card"
                  : "bg-card text-ink hover:-translate-y-0.5"
              }`}
            >
              {cohort} 级
            </button>
          ))}
          <span className="w-full sm:w-auto" />
          <span className="font-mono text-xs text-muted mr-2 self-center">已毕业</span>
          {alumniCohorts.map((cohort) => (
            <button
              key={cohort}
              onClick={() => setActiveCohort(cohort)}
              className={`font-mono text-xs px-4 py-2 sketchy-border-sm transition-all ${
                activeCohort === cohort
                  ? "bg-ink text-card"
                  : "bg-card text-ink hover:-translate-y-0.5"
              }`}
            >
              {cohort} 级
            </button>
          ))}
        </div>

        {/* Member grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCohort}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {filtered.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
