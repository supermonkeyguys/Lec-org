import { motion } from "framer-motion";
import { useState } from "react";
import { teamInfo } from "@/data/team";
import {
  itemFade,
  sectionFade,
  usePrefersReducedMotion,
} from "@/config/animations";
import { responsiveImageProps } from "@/lib/responsiveImage";
import SectionShell from "./SectionShell";
import ImageViewer from "./ImageViewer";

const emojis = ["👥", "🕒", "💬", "💻"];

interface MissionProps {
  id?: string | null;
}

export default function Mission({ id = "mission" }: MissionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedImage, setSelectedImage] = useState<(typeof teamInfo.aboutImages)[number] | null>(null);

  return (
    <SectionShell id={id} className="flex flex-col justify-center py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div {...sectionFade(Boolean(reducedMotion))}>
          <p className="font-mono text-xs text-muted mb-2 tracking-widest uppercase text-center">
            {teamInfo.content.missionEyebrow}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-center mb-16">
            {teamInfo.content.missionTitle}
          </h2>
          <div className="mx-auto mb-20 max-w-3xl space-y-5 text-left text-base leading-relaxed text-muted sm:text-lg">
            {teamInfo.content.introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-12">
          {teamInfo.aboutImages.map((image) => (
            <button
              aria-label={`查看${image.alt}`}
              className="cursor-zoom-in rounded-2xl"
              key={image.alt}
              onClick={() => setSelectedImage(image)}
              type="button"
            >
              <img
                {...responsiveImageProps(image.image, image.sizes)}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full rounded-2xl object-cover sketchy-border-sm"
              />
            </button>
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
        <ImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
      </div>
    </SectionShell>
  );
}
