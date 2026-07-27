import { sections } from "@/config/sections";

interface MobileNodeLineProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

export default function MobileNodeLine({
  activeId,
  onNavigate,
}: MobileNodeLineProps) {
  return (
    <nav
      aria-label="移动端页面导航"
      className="fixed left-2 top-1/2 z-50 flex -translate-y-1/2 flex-col items-start before:absolute before:inset-y-4 before:left-[1.125rem] before:w-px before:bg-ink md:hidden"
    >
      {sections.map((section) => {
        const isActive = section.id === activeId;

        return (
          <button
            key={section.id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            aria-label={`前往${section.label}`}
            className={`relative z-10 size-9 rounded-full border-2 border-ink transition-colors ${
              isActive
                ? "bg-ink text-card"
                : "bg-cream/95 text-ink hover:bg-ink hover:text-card focus-visible:bg-ink focus-visible:text-card"
            }`}
            onClick={() => onNavigate(section.id)}
          >
            <span
              aria-hidden="true"
              className={`mx-auto block rounded-full ${
                isActive ? "size-2.5 bg-card" : "size-1.5 border border-current"
              }`}
            />
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-card px-2 py-1 font-mono text-xs text-ink shadow-[2px_2px_0_0_rgba(30,41,59,1)]"
              >
                {section.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
