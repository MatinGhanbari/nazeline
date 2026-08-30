import { useState } from 'react';

export default function Footer() {
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setSent(true);
    e.currentTarget.querySelector('input').value = '';
  }

  return (
    <footer className="foot" id="contact">
      <div className="foot__row">
        <div className="foot__col">
          <div className="foot__k">نمایشگاه</div>
          <p>
            تهران، خیابان فرشته، پلاک ۱۲
            <br />
            بازدید فقط با وقت قبلی
          </p>
        </div>
        <div className="foot__col">
          <div className="foot__k">ارتباط</div>
          <p>
            hello@NazeLine.studio
            <br />
            +۹۸ ۲۱ ۲۲۲۲ ۰۰۰۰
          </p>
        </div>
        <div className="foot__col">
          <div className="foot__k">خبرنامه</div>
          <p>برای دریافت زمان عرضه‌ی بعدی، ایمیل خود را بنویسید.</p>
          <form className="foot__form" onSubmit={onSubmit}>
            <input type="email" required placeholder="ایمیل شما" aria-label="ایمیل" />
            <button type="submit" aria-label="ارسال" className={sent ? 'is-sent' : undefined}>
              عضویت
            </button>
          </form>
        </div>
      </div>
      <div className="foot__base">
        <span>© ۲۰۲۶ NazeLine Studio</span>
        <span className="serif">— شماره ۰۲ از مجموعه‌ی کرم</span>
        <span dir="ltr">F/W 26</span>
      </div>
    </footer>
  );
}
