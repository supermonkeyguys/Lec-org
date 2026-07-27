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
    if (!scrollRoot) return;

    const sectionElements = getSectionElements(scrollRoot);
    if (!sectionElements.length) return;

    const updateActiveSection = () => {
      const current = sectionElements.reduce(
        (active, section) =>
          section.offsetTop <= scrollRoot.scrollTop + 1 ? section : active,
        sectionElements[0],
      );

      setActiveId((previous) =>
        previous === current.id ? previous : current.id,
      );
    };

    updateActiveSection();
    scrollRoot.addEventListener("scroll", updateActiveSection);
    return () => scrollRoot.removeEventListener("scroll", updateActiveSection);
  }, []);

  const handleNavigate = (id: string) => {
    const scrollRoot = scrollRootRef.current;
    const section = document.getElementById(id);
    if (!scrollRoot || !section || !scrollRoot.contains(section)) return;

    setActiveId(id);
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
