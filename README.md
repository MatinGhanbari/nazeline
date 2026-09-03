# NazeLine · Luna Suit

لندینگ تعاملی مجموعه‌ی **Luna** از برند NazeLine — یک سوت‌سویی مینیمال در رنگ کرم (پاییز / زمستان ۲۰۲۶).

نسخهٔ زنده: [matinghanbari.github.io/nazeline](https://matinghanbari.github.io/nazeline/)

صفحه راست‌چین است و به‌جای ویدیو، با اسکرول یک توالی WebP روی canvas پخش می‌شود.

## ویژگی‌ها

- استیج پین‌شده با [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)؛ پیشرفت اسکرول به فریم نزدیک‌ترین تصویر نگاشت می‌شود
- بارگذاری ترتیبی فریم‌ها (۶ درخواست هم‌زمان) تا فریم‌های اول زودتر روی صفحه بیایند
- ذخیره‌ی فریم‌ها در Cache Storage برای بازدیدهای بعدی
- کپشن‌های فارسی که با پیشرفت اسکرول عوض می‌شوند
- احترام به `prefers-reduced-motion`
- رابط RTL با فونت‌های Amiri، Vazirmatn، Cormorant Garamond و Outfit

## پیش‌نیازها

- Node.js ۱۸ یا جدیدتر
- برای استخراج فریم از ویدیو: Python ۳.۱۲ و OpenCV (`opencv-python`)

## اجرا

```bash
npm install
npm run dev
```

سرور توسعه روی `http://localhost:5173` بالا می‌آید.

ساخت نسخهٔ تولید:

```bash
npm run build
npm run preview
```

## توالی فریم‌ها

تجربه‌ی اسکرول به فایل‌های `public/assets/frames/` وابسته است:

| مورد | مقدار فعلی |
|------|------------|
| تعداد | ۲۴۰ فریم |
| فرمت | WebP، عرض ۹۶۰ پیکسل |
| مانیفست | `public/assets/frames/manifest.json` |

برای بازتولید فریم‌ها از کلیپ منبع (`media/luna2.mp4`):

```bash
pip install opencv-python
npm run frames
```

اسکریپت `scripts/extract-frames.py` فریم‌ها را یکنواخت از ویدیو برمی‌دارد، به عرض ۹۶۰ و کیفیت ۷۸ می‌نویسد، و `manifest.json` را به‌روز می‌کند.

## ساختار

```
src/
  App.jsx                 لایه‌ی صفحه
  data.js                 کپشن‌ها و مشخصات محصول
  hooks/useStage.js       پین، lerp اسکرول، رسم canvas
  lib/loadFrames.js       واکشی، کش و decode فریم‌ها
  components/             Topbar, Hero, Stage, Details, Footer
public/assets/frames/     توالی WebP + manifest
scripts/extract-frames.py استخراج فریم از ویدیو
media/                    کلیپ منبع
```

متن‌های نمایشی در `src/data.js` هستند. تنظیمات استخراج فریم (تعداد، عرض، کیفیت) در بالای `scripts/extract-frames.py` تعریف شده‌اند.

## پشته

React ۱۹ · Vite ۶ · GSAP ۳
