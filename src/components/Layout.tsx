import TocFloating from "./TocFloating";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TocFloating />
      <main
        className="h-screen overflow-y-auto snap-y snap-proximity no-scrollbar scroll-smooth"
      >
        {children}
      </main>
    </div>
  );
}
