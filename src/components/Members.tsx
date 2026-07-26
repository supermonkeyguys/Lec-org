import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { members, membersContent, type Member } from "@/data/members";
import { sectionFade, usePrefersReducedMotion } from "@/config/animations";

const cohorts = [...new Set(members.map((m) => m.cohort))].sort((a, b) => b - a);

function MemberCard({ member }: { member: Member }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      layout
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
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
    </motion.div>
  );
}

export default function Members() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeCohort, setActiveCohort] = useState<number>(cohorts[0]);

  const filtered = useMemo(
    () => members.filter((m) => m.cohort === activeCohort),
    [activeCohort]
  );

  return (
    <section id="members" className="site-section flex flex-col justify-center py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div {...sectionFade(Boolean(reducedMotion))}>
          <p className="font-mono text-xs text-muted mb-2 tracking-widest uppercase text-center">
            {membersContent.eyebrow}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-center mb-4">
            {membersContent.title}
          </h2>
          <p className="text-center text-muted mb-16 text-lg">
            {membersContent.subtitle}
          </p>
        </motion.div>

        {/* Cohort filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <span className="font-mono text-xs text-muted mr-2 self-center">
            {membersContent.statusLabel}
          </span>
          {cohorts.map((cohort) => (
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
            initial={false}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {filtered.length === 0 ? (
              <p className="col-span-full text-center text-muted">
                {membersContent.emptyMessage}
              </p>
            ) : (
              filtered.map((member) => <MemberCard key={member.id} member={member} />)
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
