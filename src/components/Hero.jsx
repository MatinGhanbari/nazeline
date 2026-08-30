export default function Hero() {
  return (
    <section className="hero" aria-label="معرفی">
      <div className="hero__inner">
        <div className="hero__eyebrow">— شماره ۰۲</div>
        <h1 className="hero__title">
          <span className="serif it">NazeLine</span>
          <span className="serif">Luna&nbsp;Suit</span>
        </h1>
        <p className="hero__sub">
          یک سوت‌سویی مینیمال در رنگ کرم — طراحی‌شده برای لحظه‌هایی که سکوت، بلندترین صدا است.
        </p>
      </div>
      <div className="hero__cue" aria-hidden="true">
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
      <div className="hero__rail" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
  );
}
