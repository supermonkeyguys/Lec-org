import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { sections } from "@/config/sections";
import {
  closestSectionIndex,
  shouldPreserveNativeScroll,
} from "@/lib/section-navigation";
import TopNav from "./TopNav";

const navigationThrottleMs = 700;

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

function usesSectionNavigation() {
  const isSmallViewport = window.matchMedia?.("(max-width: 767px)").matches ?? false;
  return !prefersReducedMotion() && !isSmallViewport;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const scrollRootRef = useRef<HTMLElement>(null);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigationLockedRef = useRef(false);
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

  useEffect(() => {
    const scrollRoot = scrollRootRef.current;
    if (!scrollRoot) return;

    const sectionElements = getSectionElements(scrollRoot);
    const unlockNavigation = () => {
      navigationLockedRef.current = false;
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
        throttleTimerRef.current = null;
      }
    };
    const lockNavigation = () => {
      navigationLockedRef.current = true;
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
      throttleTimerRef.current = setTimeout(unlockNavigation, navigationThrottleMs);
    };
    const navigateToIndex = (index: number) => {
      const section = sectionElements[index];
      if (!section) return false;

      scrollRoot.scrollTo({ top: section.offsetTop, behavior: "smooth" });
      lockNavigation();
      return true;
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        !usesSectionNavigation() ||
        event.ctrlKey ||
        Math.abs(event.deltaY) < 10 ||
        shouldPreserveNativeScroll(scrollRoot, event.target, event.deltaY)
      ) {
        return;
      }

      if (navigationLockedRef.current) {
        event.preventDefault();
        return;
      }

      const currentIndex = closestSectionIndex(scrollRoot, sectionElements);
      const targetIndex = currentIndex + (event.deltaY > 0 ? 1 : -1);
      if (targetIndex < 0 || targetIndex >= sectionElements.length) return;

      event.preventDefault();
      navigateToIndex(targetIndex);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !usesSectionNavigation() ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        shouldPreserveNativeScroll(
          scrollRoot,
          event.target,
          event.key === "PageUp" ? -1 : 1,
        )
      ) {
        return;
      }

      const currentIndex = closestSectionIndex(scrollRoot, sectionElements);
      const targetIndex =
        event.key === "PageDown"
          ? currentIndex + 1
          : event.key === "PageUp"
            ? currentIndex - 1
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? sectionElements.length - 1
                : null;

      if (targetIndex === null || targetIndex < 0 || targetIndex >= sectionElements.length) {
        return;
      }

      event.preventDefault();
      if (!navigationLockedRef.current) navigateToIndex(targetIndex);
    };

    scrollRoot.addEventListener("wheel", handleWheel, { passive: false });
    scrollRoot.addEventListener("keydown", handleKeyDown);
    scrollRoot.addEventListener("scrollend", unlockNavigation);

    return () => {
      scrollRoot.removeEventListener("wheel", handleWheel);
      scrollRoot.removeEventListener("keydown", handleKeyDown);
      scrollRoot.removeEventListener("scrollend", unlockNavigation);
      unlockNavigation();
    };
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
