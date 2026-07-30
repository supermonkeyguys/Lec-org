import { motion } from "framer-motion";
import { useState } from "react";
import { historyContent, recentActivities } from "@/data/milestones";
import {
  sectionFade,
  usePrefersReducedMotion,
} from "@/config/animations";
import SectionShell from "./SectionShell";

interface TimelineProps {
  id?: string | null;
}

const BATCH_SIZE = 8;

export default function Timeline({ id = "history" }: TimelineProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const visibleActivities = recentActivities.slice(0, visibleCount);
  const remainingCount = recentActivities.length - visibleActivities.length;

  return (
    <SectionShell id={id} className="flex flex-col justify-center py-16 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div {...sectionFade(Boolean(reducedMotion))}>
          <p className="font-mono text-xs text-muted mb-2 tracking-widest uppercase text-center">
            {historyContent.eyebrow}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-center mb-4">
            {historyContent.title}
          </h2>
          <p className="text-center text-muted mb-12 text-lg">
            {historyContent.subtitle}
          </p>
        </motion.div>

        <div
          className="relative space-y-8 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-ink/20 sm:before:left-1/2"
          data-testid="activity-timeline"
        >
          {visibleActivities.map((activity, index) => {
            const isLeft = index % 2 === 0;

            return (
              <article
                key={activity.id}
                className="relative grid grid-cols-[2rem_1fr] gap-x-4 sm:grid-cols-[1fr_4rem_1fr]"
              >
                <span
                  aria-hidden="true"
                  className="relative z-10 col-start-1 mt-6 h-3 w-3 justify-self-center rounded-full bg-ink sm:col-start-2"
                />
                <div
                  className={`sketchy-border bg-card col-start-2 row-start-1 p-5 sm:w-[calc(100%-2rem)] ${
                    isLeft
                      ? "sm:col-start-1 sm:justify-self-end sm:-translate-y-2"
                      : "sm:col-start-3 sm:justify-self-start"
                  }`}
                  data-testid="activity-card"
                >
                  <time className="font-mono text-sm text-muted">
                    {activity.dateLabel}
                  </time>
                  <p className="mt-2 text-base leading-relaxed text-ink">
                    {activity.title}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {remainingCount > 0 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              className="sketchy-border bg-card px-5 py-3 font-mono text-sm text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              onClick={() => setVisibleCount((count) => count + BATCH_SIZE)}
            >
              加载更多（剩余 {remainingCount} 条）
            </button>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
