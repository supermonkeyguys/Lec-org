import { motion } from "framer-motion";
import { historyContent, milestones } from "@/data/milestones";
import {
  itemFade,
  sectionFade,
  usePrefersReducedMotion,
} from "@/config/animations";

export default function Timeline() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="history" className="site-section flex flex-col justify-center py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div {...sectionFade(Boolean(reducedMotion))}>
          <p className="font-mono text-xs text-muted mb-2 tracking-widest uppercase text-center">
            {historyContent.eyebrow}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-center mb-4">
            {historyContent.title}
          </h2>
          <p className="text-center text-muted mb-16 text-lg">
            {historyContent.subtitle}
          </p>
          <p className="mb-12 text-center font-mono text-xs text-fade">
            {historyContent.statusLabel}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-ink/20 -translate-x-1/2" />

          {milestones.map((milestone, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={milestone.id}
                {...itemFade(Math.min(0.05 * i, 0.3), Boolean(reducedMotion))}
                className="relative flex justify-center mb-12"
              >
                <div className="absolute left-1/2 w-3 h-3 bg-ink rounded-full -translate-x-1/2 mt-5 z-10" />

                <div
                  className={`w-full sm:w-[calc(50%-2rem)] ${
                    isLeft ? "sm:mr-auto sm:pr-8 sm:text-right" : "sm:ml-auto sm:pl-8 sm:text-left"
                  }`}
                >
                  <div className="sketchy-border bg-card p-5 text-left">
                    <span className="font-mono text-sm text-muted">
                      {milestone.dateLabel}
                    </span>
                    <h3 className="text-lg font-bold text-ink mt-1 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted text-base leading-relaxed">
                      {milestone.description}
                    </p>
                    <p className="mt-3 font-mono text-xs text-fade">
                      {milestone.sourceNote}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
