import { useState, useEffect } from "react";
import { sections } from "@/config/sections";

export default function TocFloating() {
  const [active, setActive] = useState(sections[0].id);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Collapsed pill */}
      <div
        className={`flex flex-col gap-3 p-3 bg-card border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full transition-all duration-300 ${
          hovered
            ? "opacity-0 scale-90 pointer-events-none"
            : "opacity-100 scale-100 pointer-events-auto"
        }`}
      >
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`w-3 h-3 rounded-full border border-black transition-colors ${
              active === s.id ? "bg-black" : "bg-gray-300"
            }`}
            aria-label={s.label}
          />
        ))}
      </div>

      {/* Expanded panel */}
      <div
        className={`flex flex-col gap-3 bg-card p-6 pr-8 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-72 md:w-80 transition-all duration-500 absolute top-1/2 left-0 -translate-y-1/2 ${
          hovered
            ? "opacity-100 visible translate-x-0"
            : "opacity-0 invisible -translate-x-10"
        }`}
      >
        <div className="absolute left-4 top-0 bottom-0 w-8 flex flex-col justify-evenly py-4">
          {sections.map((s) => (
            <div
              key={s.id}
              className={`w-3 h-3 rounded-full border border-black transition-colors ${
                active === s.id ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="pl-10">
          <img
            src="/logo.jpg"
            alt="LEC"
            className="w-8 h-8 mb-3 sketchy-border-sm object-contain bg-card"
          />
          <p className="font-hand font-bold text-lg mb-3 border-b-2 border-black pb-2">
            Content
          </p>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`block text-left w-full py-1.5 font-mono text-xs transition-colors border-none bg-transparent cursor-pointer ${
                active === s.id
                  ? "text-black font-bold"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="mr-2">{s.num}.</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
