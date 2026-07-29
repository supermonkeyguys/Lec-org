import { recruitmentInfo } from "@/data/recruitment";
import { responsiveImageProps } from "@/lib/responsiveImage";
import SectionShell from "./SectionShell";

const recruitmentDetails = [
  { label: "招新时间", value: recruitmentInfo.period },
  { label: "招新对象", value: recruitmentInfo.audience },
  { label: "活动地点", value: recruitmentInfo.location },
  { label: "官方招新群", value: recruitmentInfo.groupNumber },
] as const;

export default function Recruitment() {
  return (
    <SectionShell
      id="recruitment"
      className="flex flex-col justify-center px-6 py-16"
    >
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">
            Join LEC
          </p>
          <h2 className="mb-4 text-4xl font-bold text-ink sm:text-5xl">招新报名</h2>
          <p className="max-w-2xl text-lg text-muted">
            如果你对我们感兴趣，加入我们吧！
          </p>

          <dl className="sketchy-border mt-8 grid gap-5 bg-card p-6 sm:grid-cols-2">
            {recruitmentDetails.map((detail) => (
              <div key={detail.label}>
                <dt className="font-mono text-xs tracking-widest text-muted">
                  {detail.label}
                </dt>
                <dd className="mt-1 text-lg font-bold text-ink">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="sketchy-border mx-auto w-full max-w-sm bg-card p-5 text-center">
          <img
            {...responsiveImageProps(
              recruitmentInfo.qrImage,
              "(min-width: 1024px) 24rem, min(100vw - 3rem, 18rem)",
            )}
            alt="乐程官方招新群二维码"
            loading="lazy"
            decoding="async"
            className="mx-auto aspect-square w-full max-w-72 object-contain"
          />
          <figcaption className="mt-4 text-base text-muted">
            扫码加入官方招新群，获取最新安排。
          </figcaption>
        </figure>
      </div>
    </SectionShell>
  );
}
