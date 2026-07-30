import { motion } from "framer-motion";
import { Clock3, Code2, MessagesSquare, Users } from "lucide-react";
import { useState } from "react";
import { teamInfo, type TeamAboutImage } from "@/data/team";
import {
  itemFade,
  sectionFade,
  usePrefersReducedMotion,
} from "@/config/animations";
import { responsiveImageProps } from "@/lib/responsiveImage";
import {
  loadImageViewer,
  type ImageViewerComponent,
} from "./imageViewerLoader";
import SectionShell from "./SectionShell";

const factIcons = [Users, Clock3, MessagesSquare, Code2];

interface MissionProps {
  id?: string | null;
}

export default function Mission({ id = "mission" }: MissionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedImage, setSelectedImage] = useState<TeamAboutImage | null>(null);
  const [ImageViewer, setImageViewer] = useState<ImageViewerComponent | null>(null);
  const [viewerLoadFailed, setViewerLoadFailed] = useState(false);

  const selectImage = (image: TeamAboutImage) => {
    setSelectedImage(image);
    setImageViewer(null);
    setViewerLoadFailed(false);
    void loadImageViewer()
      .then((Viewer) => setImageViewer(() => Viewer))
      .catch(() => setViewerLoadFailed(true));
  };

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
              onClick={() => selectImage(image)}
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
          {teamInfo.facts.map((fact, i) => {
            const Icon = factIcons[i];

            return (
              <motion.div
                key={fact.label}
                {...itemFade(i * 0.1, Boolean(reducedMotion))}
                className="sketchy-border bg-card p-6 text-center"
              >
                <div className="mb-3 flex justify-center text-ink">
                  <Icon aria-hidden="true" size={22} strokeWidth={2.25} />
                </div>
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
            );
          })}
        </div>
        {selectedImage && ImageViewer ? (
          <ImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
        ) : null}
        {viewerLoadFailed ? (
          <p role="status">图片查看器加载失败，请刷新页面后重试。</p>
        ) : null}
      </div>
    </SectionShell>
  );
}
