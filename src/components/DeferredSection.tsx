import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface DeferredSectionProps {
  id: string;
  minHeight: string;
  children: () => ReactNode;
}

export default function DeferredSection({
  id,
  minHeight,
  children,
}: DeferredSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || !("IntersectionObserver" in window)) {
      setIsReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      id={id}
      data-testid={`deferred-section-${id}`}
      style={isReady ? undefined : { minHeight }}
    >
      {isReady ? children() : null}
    </div>
  );
}
