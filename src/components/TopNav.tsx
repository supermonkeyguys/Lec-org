import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { sections } from "@/config/sections";

interface TopNavProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

const mobilePrimarySections = sections.slice(0, 4);
const mobileOverflowSections = sections.slice(4);

export default function TopNav({ activeId, onNavigate }: TopNavProps) {
  const hasActiveOverflowSection = mobileOverflowSections.some(
    (section) => section.id === activeId,
  );

  return (
    <nav aria-label="主导航" className="top-nav fixed inset-x-0 top-0 z-50 border-b-2 border-ink bg-cream/95 shadow-[0_3px_0_0_rgba(30,41,59,1)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-1 px-3 py-3 sm:hidden">
        {mobilePrimarySections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={activeId === section.id ? "page" : undefined}
            className={`min-w-0 flex-1 rounded-full px-2 py-1.5 text-center font-mono text-xs transition-colors ${
              activeId === section.id
                ? "bg-ink text-card"
                : "text-muted hover:bg-ink/10 hover:text-ink"
            }`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(section.id);
            }}
          >
            {section.label}
          </a>
        ))}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            aria-label="更多页面"
            className={`shrink-0 rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
              hasActiveOverflowSection
                ? "bg-ink text-card"
                : "text-muted hover:bg-ink/10 hover:text-ink"
            }`}
          >
            更多
            <span aria-hidden="true" className="ml-1">⌄</span>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-36 rounded-2xl border-2 border-ink bg-card p-1 shadow-[3px_3px_0_0_rgba(30,41,59,1)]"
            >
              {mobileOverflowSections.map((section) => (
                <DropdownMenu.Item key={section.id} asChild>
                  <a
                    href={`#${section.id}`}
                    aria-current={activeId === section.id ? "page" : undefined}
                    className={`block rounded-xl px-3 py-2 font-mono text-sm outline-none transition-colors ${
                      activeId === section.id
                        ? "bg-ink text-card"
                        : "text-muted hover:bg-ink/10 hover:text-ink focus:bg-ink/10 focus:text-ink"
                    }`}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(section.id);
                    }}
                  >
                    <span aria-hidden="true" className="mr-2 text-xs opacity-70">
                      {section.num}
                    </span>
                    {section.label}
                  </a>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
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
