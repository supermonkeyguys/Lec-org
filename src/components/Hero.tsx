import { motion } from "framer-motion";
import { teamInfo } from "@/data/team";
import { assetPath } from "@/lib/assetPath";
import { usePrefersReducedMotion } from "@/config/animations";
import SectionShell from "./SectionShell";

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <SectionShell
      id="hero"
      className="flex items-center justify-center px-6 text-center relative overflow-hidden"
    >
      <div className="absolute top-20 left-20 w-16 h-16 rounded-full border-2 border-ink/20 animate-float" />
      <div className="absolute bottom-32 right-24 w-24 h-24 rounded-full border-2 border-ink/10 animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 right-1/4 text-6xl opacity-5 animate-float select-none" style={{ animationDelay: "1s" }}>
        &lt;/&gt;
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <img
          src={assetPath("/logo.jpg")}
          alt={teamInfo.name}
          className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 sketchy-border object-contain bg-card"
        />
        <p className="font-mono text-sm text-muted mb-4 tracking-widest uppercase">
          {teamInfo.nameEn} · {teamInfo.content.heroMeta}
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold text-ink leading-tight mb-8">
          {teamInfo.name}
        </h1>
        <p className="text-xl sm:text-2xl text-muted max-w-xl mx-auto leading-relaxed">
          {teamInfo.mission}
        </p>

        <motion.a
          href="#alumni"
          className="inline-block mt-12 sketchy-border bg-card px-8 py-3 text-ink no-underline font-mono text-sm hover:-translate-y-0.5 transition-transform"
          whileHover={reducedMotion ? undefined : { y: -2 }}
          whileTap={reducedMotion ? undefined : { y: 0 }}
        >
          {teamInfo.content.heroCta}
        </motion.a>
      </motion.div>

    </SectionShell>
  );
}
