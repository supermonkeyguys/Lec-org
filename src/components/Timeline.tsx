import { motion } from "framer-motion";
import { historyContent, recentActivities } from "@/data/milestones";
import {
  sectionFade,
  usePrefersReducedMotion,
} from "@/config/animations";
import SectionShell from "./SectionShell";

interface TimelineProps {
  id?: string | null;
}

export default function Timeline({ id = "history" }: TimelineProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <SectionShell id={id} className="flex flex-col justify-center py-16 px-6">
      <div className="max-w-3xl mx-auto">
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

        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <article
              key={activity.id}
              className="sketchy-border bg-card flex flex-col gap-2 p-5 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <time className="shrink-0 font-mono text-sm text-muted">
                {activity.dateLabel}
              </time>
              <p className="text-base leading-relaxed text-ink">{activity.title}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
