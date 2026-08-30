import { captions } from '../data.js';

export default function Stage({ stageRef, mediaRef, canvasRef, timeNowRef, timeDurRef }) {
  return (
    <>
      <section className="stage" id="stage" aria-label="نمایش محصول" ref={stageRef}>
        <div className="stage__media" id="stageMedia" ref={mediaRef}>
          <div className="stage__vid">
            <canvas
              id="seq"
              className="stage__seq"
              ref={canvasRef}
              width={960}
              height={540}
              role="img"
              aria-label="نمایش محصول"
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 top-topbar z-5 flex items-center justify-between px-gutter pt-2.5 font-ui text-kicker uppercase tracking-kicker text-ink max-stack:justify-end max-stack:px-[18px] max-stack:pt-2 max-compact:text-[10.5px]"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <span className="size-1.5 animate-gold-pulse rounded-full bg-gold shadow-[0_0_0_4px_var(--color-gold-soft)]" />
            <span className="max-stack:hidden">F/W ۲۰۲۶ · CREAM</span>
          </div>
          <div className="flex items-center gap-1.5 font-display tracking-[0.14em]">
            <span ref={timeNowRef}>۰۰:۰۰</span>
            <span className="opacity-40">/</span>
            <span ref={timeDurRef}>۰۰:۱۰</span>
          </div>
        </div>

        <div className="stage__load" aria-hidden="true"></div>

        <div
          className="stage__captions pointer-events-none absolute inset-x-0 bottom-0 top-topbar z-4 max-stack:place-items-end max-stack:justify-items-center"
          dir="rtl"
        >
          {captions.map((cap) => (
            <article key={cap.i} className={`cap cap--${cap.side}`} data-i={cap.i}>
              <div className="mb-[18px] flex items-center justify-end gap-3.5 font-ui text-kicker tracking-cue text-ink-faint max-stack:justify-center">
                <span className="font-display text-[13px] tracking-[0.16em]">{cap.no}</span>
                <span className="block h-px w-16 shrink-0 bg-ink-faint opacity-60"></span>
              </div>
              <h3 className="mb-3.5 font-arabic text-cap font-normal tracking-normal text-ink max-stack:text-[clamp(32px,9vw,48px)]">
                {cap.title}
              </h3>
              <p className="m-0 font-sans text-[clamp(14px,1.1vw,16px)] font-extralight leading-[2] text-ink-soft max-stack:mx-auto max-stack:max-w-[36em]">
                {cap.body}
              </p>
            </article>
          ))}
        </div>

        <div className="stage__rail" aria-hidden="true">
          <div className="stage__rail-track flex flex-col gap-[18px]" id="railTrack">
            {captions.map((cap) => (
              <span key={cap.i}></span>
            ))}
          </div>
        </div>
      </section>
      <div className="stage__pin-space" aria-hidden="true"></div>
    </>
  );
}
