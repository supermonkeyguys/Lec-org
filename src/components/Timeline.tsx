import { motion } from "framer-motion";
import { milestones } from "@/data/milestones";
import { sectionFade, itemFade } from "@/config/animations";

export default function Timeline() {
  return (
    <section id="history" className="snap-start min-h-screen flex flex-col justify-center py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div {...sectionFade}>
          <p className="font-mono text-xs text-muted mb-2 tracking-widest uppercase text-center">
            Our Story
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-center mb-4">
            团队历史
          </h2>
          <p className="text-center text-muted mb-16 text-lg">
            十年，从一张白板到遍布各地的校友网络
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-ink/20 -translate-x-1/2" />

          {milestones.map((milestone, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={milestone.year}
                {...itemFade(Math.min(0.05 * i, 0.3))}
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
                      {milestone.year}
                    </span>
                    <h3 className="text-lg font-bold text-ink mt-1 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted text-base leading-relaxed">
                      {milestone.description}
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
