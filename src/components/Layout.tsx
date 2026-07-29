import { useEffect, useRef, useState } from "react";
import { sections } from "@/config/sections";
import TopNav from "./TopNav";

const keyboardScrollKeys = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "Space",
  "Spacebar",
  " ",
]);

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
  const pendingNavigationIdRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const scrollRoot = scrollRootRef.current;
    if (!scrollRoot) return;

    const sectionElements = getSectionElements(scrollRoot);
    if (!sectionElements.length) return;

    const updateActiveSection = () => {
      const pendingId = pendingNavigationIdRef.current;
      if (pendingId) {
        const target = sectionElements.find((section) => section.id === pendingId);

        if (target && Math.abs(scrollRoot.scrollTop - target.offsetTop) > 2) {
          return;
        }

        pendingNavigationIdRef.current = null;
      }

      const current = sectionElements.reduce(
        (active, section) =>
          section.offsetTop <= scrollRoot.scrollTop + 1 ? section : active,
        sectionElements[0],
      );

      setActiveId((previous) =>
        previous === current.id ? previous : current.id,
      );
    };

    const cancelPendingNavigation = () => {
      pendingNavigationIdRef.current = null;
    };

    const cancelPendingNavigationForKeyboardScroll = (event: KeyboardEvent) => {
      if (keyboardScrollKeys.has(event.key)) {
        cancelPendingNavigation();
      }
    };

    updateActiveSection();
    scrollRoot.addEventListener("scroll", updateActiveSection);
    scrollRoot.addEventListener("scrollend", updateActiveSection);
    scrollRoot.addEventListener("wheel", cancelPendingNavigation, { passive: true });
    scrollRoot.addEventListener("touchstart", cancelPendingNavigation, { passive: true });
    scrollRoot.addEventListener("keydown", cancelPendingNavigationForKeyboardScroll);

    return () => {
      scrollRoot.removeEventListener("scroll", updateActiveSection);
      scrollRoot.removeEventListener("scrollend", updateActiveSection);
      scrollRoot.removeEventListener("wheel", cancelPendingNavigation);
      scrollRoot.removeEventListener("touchstart", cancelPendingNavigation);
      scrollRoot.removeEventListener("keydown", cancelPendingNavigationForKeyboardScroll);
    };
  }, []);

  const handleNavigate = (id: string) => {
    const scrollRoot = scrollRootRef.current;
    const section = document.getElementById(id);
    if (!scrollRoot || !section || !scrollRoot.contains(section)) return;

    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    pendingNavigationIdRef.current = behavior === "smooth" ? id : null;
    setActiveId(id);
    scrollRoot.scrollTo({
      top: section.offsetTop,
      behavior,
    });
  };

  return (
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
  );
}
