import { motion } from "framer-motion";
import { teamInfo } from "@/data/team";
import { sectionFade, itemFade } from "@/config/animations";

const emojis = ["🛠️", "🤝", "📈", "📜"];

export default function Mission() {
  return (
    <section id="mission" className="site-section flex flex-col justify-center py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div {...sectionFade}>
          <p className="font-mono text-xs text-muted mb-2 tracking-widest uppercase text-center">
            Our Purpose
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-center mb-16">
            我们为什么存在
          </h2>
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-xl text-ink leading-relaxed">
              {teamInfo.mission}
            </p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {teamInfo.values.map((value, i) => (
            <motion.div
              key={value.title}
              {...itemFade(i * 0.1)}
              className="sketchy-border bg-card p-6 text-center"
            >
              <div className="text-3xl mb-3">{emojis[i]}</div>
              <h3 className="text-xl font-bold text-ink mb-2">
                {value.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
