import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { sections } from "@/config/sections";
import TopNav from "./TopNav";

function getSectionElements(scrollRoot: HTMLElement) {
  return sections
    .map(({ id }) => document.getElementById(id))
    .filter((element): element is HTMLElement =>
      Boolean(element && scrollRoot.contains(element)),
    );
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const scrollRootRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const scrollRoot = scrollRootRef.current;
    if (!scrollRoot || !("IntersectionObserver" in window)) return;

    const sectionElements = getSectionElements(scrollRoot);

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (activeEntry) setActiveId(activeEntry.target.id);
      },
      { root: scrollRoot, threshold: 0.55 }
    );

    sectionElements.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavigate = (id: string) => {
    const scrollRoot = scrollRootRef.current;
    const section = document.getElementById(id);
    if (!scrollRoot || !section || !scrollRoot.contains(section)) return;

    scrollRoot.scrollTo({
      top: section.offsetTop,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <TopNav activeId={activeId} onNavigate={handleNavigate} />
        <main
          id="site-scroll-root"
          ref={scrollRootRef}
          aria-label="主内容分段滚动"
          tabIndex={0}
          className="site-scroll no-scrollbar h-[100svh] overflow-y-auto"
        >
          {children}
        </main>
      </div>
    </MotionConfig>
  );
}
