export default function Topbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-nav grid h-topbar grid-cols-[1fr_auto_1fr] items-center border-b border-line-soft bg-canvas/90 px-gutter font-ui text-[12px] font-light uppercase tracking-nav text-ink backdrop-blur-frost backdrop-saturate-115 max-stack:grid-cols-[1fr_auto] max-stack:px-[18px]">
      <div className="pointer-events-auto order-1 flex items-center justify-start gap-3">
        <span className="inline-flex text-current" aria-hidden="true">
          <svg viewBox="0 0 60 18" width="60" height="18">
            <path
              d="M2 14 Q9 2 16 14 T30 14 T44 14 T58 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="font-display text-[15px] font-normal tracking-brand">NazeLine</span>
      </div>
      <nav
        className="pointer-events-auto order-2 flex justify-center gap-8 max-wide:gap-5 max-stack:hidden"
        aria-label="منو"
      >
        <a
          href="#stage"
          className="inline-flex min-h-11 items-center px-0.5 opacity-70 transition-opacity duration-400 ease-atelier hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          مجموعه
        </a>
        <a
          href="#details"
          className="inline-flex min-h-11 items-center px-0.5 opacity-70 transition-opacity duration-400 ease-atelier hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          جزئیات
        </a>
        <a
          href="#contact"
          className="inline-flex min-h-11 items-center px-0.5 opacity-70 transition-opacity duration-400 ease-atelier hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          تماس
        </a>
      </nav>
      <div className="pointer-events-auto order-3 text-start opacity-70">
        <span>F/W · ۲۰۲۶</span>
      </div>
    </header>
  );
}
