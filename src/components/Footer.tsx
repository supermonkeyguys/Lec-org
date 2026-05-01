import { teamInfo } from "@/data/team";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="snap-start min-h-[40vh] flex flex-col items-center justify-center py-16 px-6 text-center border-t-2 border-ink/10">
      <img
        src="/logo.jpg"
        alt={teamInfo.name}
        className="w-12 h-12 mx-auto mb-4 sketchy-border-sm object-contain bg-card"
      />
      <p className="text-xl font-bold text-ink mb-2">
        {teamInfo.name}
      </p>
      <p className="font-mono text-sm text-muted mb-4">
        Est. {teamInfo.founded} — {currentYear}
      </p>
      <p className="text-sm text-fade">
        Made with passion · Built by LEC members
      </p>
    </footer>
  );
}
