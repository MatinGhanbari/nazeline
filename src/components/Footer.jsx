import { useState } from 'react';

export default function Footer() {
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setSent(true);
    e.currentTarget.querySelector('input').value = '';
  }

  return (
    <footer className="relative z-4 bg-inverse px-section pb-8 pt-[8vh] text-inverse-fg" id="contact">
      <div className="grid grid-cols-3 gap-12 border-b border-inverse-line pb-[6vh] max-split:grid-cols-1 max-split:gap-8">
        <div>
          <div className="font-ui text-kicker uppercase tracking-kicker text-gold">نمایشگاه</div>
          <p className="mt-2.5 text-[14px] font-extralight leading-[2] text-inverse-muted">
            تهران، خیابان فرشته، پلاک ۱۲
            <br />
            بازدید فقط با وقت قبلی
          </p>
        </div>
        <div>
          <div className="font-ui text-kicker uppercase tracking-kicker text-gold">ارتباط</div>
          <p className="mt-2.5 text-[14px] font-extralight leading-[2] text-inverse-muted">
            hello@NazeLine.studio
            <br />
            +۹۸ ۲۱ ۲۲۲۲ ۰۰۰۰
          </p>
        </div>
        <div>
          <div className="font-ui text-kicker uppercase tracking-kicker text-gold">خبرنامه</div>
          <p className="mt-2.5 text-[14px] font-extralight leading-[2] text-inverse-muted">
            برای دریافت زمان عرضه‌ی بعدی، ایمیل خود را بنویسید.
          </p>
          <form className="mt-[18px] flex max-w-[340px] gap-0" onSubmit={onSubmit}>
            <input
              type="email"
              required
              placeholder="ایمیل شما"
              aria-label="ایمیل"
              className="min-w-0 flex-1 border-0 border-b border-inverse-line bg-transparent py-2.5 font-sans text-body text-inverse-fg outline-none placeholder:text-inverse-faint"
            />
            <button
              type="submit"
              aria-label="ارسال"
              className={`min-h-11 cursor-pointer border-0 border-b border-inverse-line bg-transparent py-2.5 pe-0 ps-[18px] font-sans text-[12px] tracking-nav text-inverse-fg transition-colors duration-300 ease-atelier hover:border-gold hover:text-gold ${sent ? 'border-gold text-gold' : ''}`}
            >
              {sent ? 'عضویت ✓' : 'عضویت'}
            </button>
          </form>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between font-ui text-kicker uppercase tracking-[0.28em] text-inverse-faint max-compact:flex-col max-compact:gap-1.5 max-compact:text-center">
        <span>© ۲۰۲۶ NazeLine Studio</span>
        <span className="font-display normal-case tracking-[0.02em]">— شماره ۰۲ از مجموعه‌ی کرم</span>
        <span dir="ltr">F/W 26</span>
      </div>
    </footer>
  );
}
