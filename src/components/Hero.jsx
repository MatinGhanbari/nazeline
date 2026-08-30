export default function Hero() {
  return (
    <section
      className="sticky top-0 z-1 grid min-h-dvh place-items-center bg-canvas bg-hero-wash px-[6vw] pb-[108px] pt-topbar"
      aria-label="معرفی"
    >
      <div className="relative max-w-[920px] text-center">
        <div className="mb-7 flex items-center justify-center gap-3.5 font-ui text-kicker uppercase tracking-[0.38em] text-ink-faint">
          <span className="inline-block h-px w-7 bg-ink-faint" aria-hidden="true" />
          شماره ۰۲
          <span className="inline-block h-px w-7 bg-ink-faint" aria-hidden="true" />
        </div>
        <h1 className="hero-title mb-7 flex flex-col items-center gap-[0.05em] font-display text-hero font-light tracking-[0.01em] text-ink">
          <span className="serif-it text-ink-soft">NazeLine</span>
          <span>Luna&nbsp;Suit</span>
        </h1>
        <p className="mx-auto max-w-[540px] font-sans text-[clamp(15px,1.4vw,18px)] font-extralight leading-[2] text-ink-soft">
          یک سوت‌سویی مینیمال در رنگ کرم — طراحی‌شده برای لحظه‌هایی که سکوت، بلندترین صدا است.
        </p>
      </div>
      <div
        className="pointer-events-none absolute bottom-[max(28px,env(safe-area-inset-bottom,0px))] left-1/2 z-2 flex animate-cue flex-col items-center gap-3 text-center font-ui text-kicker uppercase tracking-cue text-ink-faint"
        aria-hidden="true"
      >
        <span>اسکرول برای دیدن پارچه</span>
        <svg viewBox="0 0 14 24" width="14" height="24">
          <path
            d="M7 1 V22 M1 16 L7 22 L13 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        className="absolute top-1/2 right-[clamp(16px,3vw,40px)] flex -translate-y-1/2 flex-col gap-3.5"
        aria-hidden="true"
      >
        <span className="block h-9 w-px bg-ink-faint opacity-40" />
        <span className="block h-9 w-px bg-ink-faint opacity-40" />
        <span className="block h-9 w-px bg-ink-faint opacity-40" />
      </div>
    </section>
  );
}
