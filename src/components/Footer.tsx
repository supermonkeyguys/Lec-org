import { teamInfo } from "@/data/team";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center justify-center border-t-2 border-ink/10 px-6 py-16 text-center">
      <img
        src="/logo.jpg"
        alt={teamInfo.name}
        className="w-12 h-12 mx-auto mb-4 sketchy-border-sm object-contain bg-card"
      />
      <p className="text-xl font-bold text-ink mb-2">
        {teamInfo.name}
      </p>
      <p className="font-mono text-sm text-muted mb-4">
        {teamInfo.content.heroMeta} — {currentYear}
      </p>
      <p className="text-sm text-fade">
        {teamInfo.content.footerTagline}
      </p>
    </footer>
  );
}
