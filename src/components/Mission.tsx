import { motion } from "framer-motion";
import { teamInfo } from "@/data/team";
import {
  itemFade,
  sectionFade,
  usePrefersReducedMotion,
} from "@/config/animations";

const emojis = ["👥", "🕒", "💬", "💻"];

export default function Mission() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="mission" className="site-section flex flex-col justify-center py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div {...sectionFade(Boolean(reducedMotion))}>
          <p className="font-mono text-xs text-muted mb-2 tracking-widest uppercase text-center">
            {teamInfo.content.missionEyebrow}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-center mb-16">
            {teamInfo.content.missionTitle}
          </h2>
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-xl text-ink leading-relaxed">
              {teamInfo.mission}
            </p>
            <p className="mt-4 text-base text-muted">
              {teamInfo.content.missionSubtitle}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-12">
          {teamInfo.aboutImages.map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-2xl object-cover sketchy-border-sm"
            />
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {teamInfo.facts.map((fact, i) => (
            <motion.div
              key={fact.label}
              {...itemFade(i * 0.1, Boolean(reducedMotion))}
              className="sketchy-border bg-card p-6 text-center"
            >
              <div className="text-3xl mb-3">{emojis[i]}</div>
              <h3 className="text-xl font-bold text-ink mb-2">
                {fact.label}
              </h3>
              <p className="mb-2 font-mono text-lg font-bold text-ink">
                {fact.value}
              </p>
              <p className="text-muted leading-relaxed">
                {fact.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
