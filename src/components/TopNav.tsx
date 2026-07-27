import { sections } from "@/config/sections";

interface TopNavProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

export default function TopNav({ activeId, onNavigate }: TopNavProps) {
  return (
    <nav aria-label="主导航" className="top-nav fixed inset-x-0 top-0 z-50 border-b-2 border-ink bg-cream/95 shadow-[0_3px_0_0_rgba(30,41,59,1)] backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:hidden">
        <label className="sr-only" htmlFor="mobile-section-navigation">
          页面导航
        </label>
        <select
          id="mobile-section-navigation"
          aria-label="页面导航"
          value={activeId}
          className="w-full rounded-full border-2 border-ink bg-card px-4 py-2 font-mono text-sm text-ink"
          onChange={(event) => onNavigate(event.target.value)}
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.num} {section.label}
            </option>
          ))}
        </select>
      </div>
      <div className="no-scrollbar mx-auto hidden max-w-5xl items-center gap-1 overflow-x-auto px-4 py-3 sm:flex sm:justify-center sm:px-6">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={activeId === section.id ? "page" : undefined}
            className={`shrink-0 rounded-full px-3 py-1.5 font-mono text-xs transition-colors sm:px-4 ${
              activeId === section.id
                ? "bg-ink text-card"
                : "text-muted hover:bg-ink/10 hover:text-ink"
            }`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(section.id);
            }}
          >
            <span aria-hidden="true" className="mr-1.5 text-[0.65rem] opacity-70">
              {section.num}
            </span>
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
