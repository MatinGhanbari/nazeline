import { details } from '../data.js';

export default function Details({ detailsRef }) {
  return (
    <section
      className="relative z-3 min-h-dvh bg-linear-to-b from-canvas to-canvas-soft px-section pb-[8vh] pt-[14vh] shadow-[0_-1px_0_var(--color-line)]"
      id="details"
      aria-label="جزئیات مجموعه"
      ref={detailsRef}
    >
      <div className="grid grid-cols-4 gap-px border-y border-line bg-line-soft max-split:grid-cols-2 max-compact:grid-cols-1">
        {details.map((cell) => (
          <div
            className="flex min-h-[180px] flex-col gap-3 bg-canvas px-6 py-8 text-start"
            key={cell.k}
          >
            <div className="font-ui text-kicker uppercase tracking-kicker text-ink-faint">{cell.k}</div>
            <div className="font-sans text-[15px] font-extralight leading-[2] text-ink">
              {cell.v.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 ? <br /> : null}
                  {line === 'Luna Bianco' ? <>Luna&nbsp;Bianco</> : line}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-[12vh] max-w-[880px] px-5 text-center">
        <div className="font-arabic text-quote font-normal tracking-normal text-ink">
          <span className="serif-it align-[-0.1em] text-[1.3em] leading-none text-gold">«</span>
          <span>ما به لباسی فکر می‌کنیم که بعد از پوشیدن، آرامش را فراموش نکند.</span>
          <span className="serif-it align-[-0.1em] text-[1.3em] leading-none text-gold">»</span>
        </div>
        <div className="mt-7 font-ui text-kicker uppercase tracking-kicker text-ink-faint">
          — از دفتر طراحی لونا
        </div>
      </div>
    </section>
  );
}
