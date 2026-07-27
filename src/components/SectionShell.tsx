import type { ReactNode } from "react";

interface SectionShellProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export default function SectionShell({
  id,
  className = "",
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={`site-section ${className}`.trim()}>
      {children}
    </section>
  );
}
