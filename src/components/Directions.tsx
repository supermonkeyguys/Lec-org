import {
  Bot,
  ChartNoAxesCombined,
  Gamepad2,
  Layers3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { technicalDirections } from "@/data/directions";
import type { TechnicalDirection } from "@/data/directions";
import SectionShell from "./SectionShell";

const directionIcons = {
  "full-stack": Layers3,
  "agent-development": Bot,
  "game-development": Gamepad2,
  "machine-learning": ChartNoAxesCombined,
  graphics: Sparkles,
} satisfies Record<TechnicalDirection["id"], LucideIcon>;

export default function Directions() {
  return (
    <SectionShell
      id="directions"
      className="flex flex-col justify-center px-6 py-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">
            Technical Directions
          </p>
          <h2 className="mb-4 text-4xl font-bold text-ink sm:text-5xl">技术方向</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            从基础能力到实践项目，探索适合自己的技术路径。
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {technicalDirections.map((direction) => {
            const Icon = directionIcons[direction.id];

            return (
              <article key={direction.id} className="sketchy-border bg-card p-6">
                <div className="flex text-ink">
                  <Icon aria-hidden="true" size={22} strokeWidth={2.25} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-ink">{direction.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  {direction.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
