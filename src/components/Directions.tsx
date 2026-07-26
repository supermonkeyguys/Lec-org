import { technicalDirections } from "@/data/directions";

export default function Directions() {
  return (
    <section
      id="directions"
      className="site-section flex flex-col justify-center px-6 py-16"
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
          {technicalDirections.map((direction) => (
            <article key={direction.id} className="sketchy-border bg-card p-6">
              <span aria-hidden="true" className="text-3xl">
                {direction.icon}
              </span>
              <h3 className="mt-4 text-xl font-bold text-ink">{direction.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">
                {direction.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
