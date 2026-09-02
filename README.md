# فال فرزانه — Fal Farzaneh

**هر کارت، روایتی برای اندیشیدن**

تجربه‌ای فارسی، موبایل‌محور و کیهانی از تاروت شخصی‌سازی‌شده بر پایهٔ تاریخ تولد شمسی —
بدون بک‌اند، بدون حساب کاربری، بدون ارسال داده به هیچ سروری.

![status](https://img.shields.io/badge/status-production--ready-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)
![stack](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20Vanilla%20JS-orange)

---

## معرفی

فال فرزانه یک وب‌اپلیکیشن کاملاً سمت‌کلاینت (client-side) است که کاربر را در محیطی
شبیه رصدخانه‌ای کیهانی به گشت‌وگذار در نمادهای تاروت دعوت می‌کند: تاریخ تولد شمسی
خود را وارد می‌کند، پروفایل نمادین شخصی می‌سازد، کارت انتخاب می‌کند و فالی
شخصی‌سازی‌شده دریافت می‌کند.

> ⚠️ فال فرزانه ادعای پیش‌بینی علمی یا قطعی آینده ندارد. این برنامه ابزاری برای
> تأمل، خودشناسی و سرگرمی نمادین است — نه جایگزین مشاورهٔ پزشکی، حقوقی یا مالی.

## ویژگی‌ها

- 🃏 دستهٔ کامل **۷۸ کارت** تاروت (۲۲ آرکانای کبیر + ۵۶ آرکانای صغیر) با متن فارسیِ اصیل
- 🌙 **تقویم شمسی/جلالی واقعی** با اعتبارسنجی کامل (سال کبیسه، طول ماه‌ها، روزهای هفته)
- 🔢 **موتور شخصی‌سازی قطعی (deterministic)**: از تاریخ تولد، اعداد و کارت‌های نمادین ثابت می‌سازد
- 🎴 ۷ نوع فال: یک‌کارتی، سه‌کارتی، عشق، کار و مالی، نیت، تولد (پنج‌کارتی)، انتخاب با شهود
- ☀️ **فال روزانه** با بذر قطعی روزانه (هر روز نتیجه‌ای تازه، اما پایدار در طول همان روز)
- 🌌 پس‌زمینهٔ کیهانی متحرک (ستاره، سیاره، مدار) با پشتیبانی کامل از `prefers-reduced-motion`
- 📚 کتابخانهٔ کامل کارت‌ها با فیلتر و جست‌وجو
- 📖 تاریخچهٔ فال‌ها («دفتر اسرار فرزانه») در `localStorage`، بدون هیچ ارسال بیرونی
- 📱 طراحی کاملاً موبایل‌محور، RTL، همراه با اعداد فارسی
- ♿ دسترس‌پذیری: برچسب‌های صوتی، فوکوس قابل‌مشاهده، پشتیبانی از حرکت کاهش‌یافته
- 📦 آمادهٔ PWA (قابل نصب، کارکرد پایهٔ آفلاین)
- 🚀 آمادهٔ استقرار مستقیم روی GitHub Pages — بدون بیلد، بدون بک‌اند

## معماری

```
دادهٔ کارت‌ها (data/cards.js)
        ↓
موتور تاروت — ENGINE A (js/tarot-engine.js)
        ↓
موتور خوانش (js/readings.js)
        ↑
موتور شخصی‌سازی — ENGINE B (js/personalization-engine.js)
        ↑
تاریخ جلالی (js/jalali-date.js)
        ↓
رابط کاربری (js/ui.js + js/app.js)
        ↓
ذخیرهٔ محلی (js/storage.js → localStorage)
```

دو موتور اصلی **کاملاً مستقل** از هم هستند:

- **ENGINE A — موتور تاروت** (`js/tarot-engine.js` + `data/cards.js`): فقط دربارهٔ
  خودِ تاروت است — ۷۸ کارت، معانی، نمادشناسی. هیچ آگاهی‌ای از تاریخ تولد یا کاربر ندارد.
- **ENGINE B — موتور شخصی‌سازی فرزانه** (`js/personalization-engine.js`): فقط
  دربارهٔ تبدیل تاریخ تولد به اعداد/بذرهای قطعی است. هیچ‌گاه مستقیماً به دادهٔ کارت
  دست نمی‌زند؛ فقط عدد و بذر تولید می‌کند که در `readings.js` به کارت واقعی نگاشت می‌شود.

## سیستم تاروت

ساختار مبتنی بر سنت **رایدر–ویت–اسمیت (RWS)** است. جزئیات پژوهشی در [`SOURCES.md`](./SOURCES.md).

## الگوریتم شخصی‌سازی بر پایهٔ تاریخ تولد

فرمول‌های زیر **اختصاصِ فال فرزانه** هستند و ادعای هیچ ریشهٔ سنتی یا علمی ندارند
(به‌روشنی هم در برنامه و هم در صفحهٔ «درباره» اعلام می‌شود):

| مقدار | فرمول | کاهش به بازهٔ |
|---|---|---|
| عدد تاروت شخصی | `year + month + day` | ۰..۲۱ (آرکانای کبیر) |
| عدد انرژی | `digitSum(year) + month × day` | ۰..۲۱ |
| کارت روز | `day` | ۰..۲۱ |
| کارت ماه | `month` | ۰..۲۱ |
| مسیر نمادین | هش کامل تاریخ (djb2/xfnv1a) | ۰..۲۱ |
| بذر روزانه | `birthSeed + jy×10000 + jm×100 + jd` | — |

تصادفی‌سازیِ قطعی با الگوریتم عمومی **mulberry32** (بذرپذیر) انجام می‌شود، به‌طوری‌که
تاریخ تولد یکسان + نوع فال یکسان، همیشه همان نتیجه را می‌دهد؛ اما فال «تصادفی» عادی
از `Math.random()` استفاده می‌کند.

## تقویم شمسی

پیاده‌سازی مستقل بر پایهٔ همان الگوریتم ریاضیِ استاندارد کتابخانهٔ متن‌باز `jalaali-js`
(به‌طور کامل مستند در [`SOURCES.md`](./SOURCES.md))، بدون وابستگی بستهٔ npm بیرونی.

## حریم خصوصی

- بدون بک‌اند، بدون حساب کاربری
- بدون ارسال تاریخ تولد، سؤال یا تاریخچهٔ فال به هیچ سروری
- بدون سرویس تحلیل یا ردیاب شخص‌ثالث
- همهٔ داده‌ها فقط در `localStorage` مرورگر خودِ کاربر ذخیره می‌شوند

## دارایی‌های بصری

کارت‌ها با CSS و نمادهای استاندارد یونیکد به‌صورت **اصلی و اختصاصی** طراحی شده‌اند
(نه اسکن یا بازتولید دستهٔ تجاری). جزئیات کامل و راهنمای جایگزینی با تصاویر واقعی در
[`ASSETS.md`](./ASSETS.md).

## مجوز

MIT — به [`LICENSE`](./LICENSE) نگاه کنید.

## توسعهٔ محلی

پروژه هیچ مرحلهٔ بیلدی ندارد. کافی است یک سرور استاتیک ساده اجرا کنید:

```bash
cd fal-farzaneh
python3 -m http.server 8080
# یا
npx serve .
```

سپس مرورگر را در آدرس `http://localhost:8080` باز کنید.

> باز کردن مستقیم `index.html` با پروتکل `file://` نیز کار می‌کند، اما برای رفتار
> صحیح Service Worker بهتر است از یک سرور محلی استفاده شود.

## استقرار روی GitHub Pages

```bash
git init
git add .
git commit -m "Initial Fal Farzaneh release"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

سپس:

1. به مخزن خود در گیت‌هاب بروید → **Settings** → **Pages**
2. در بخش **Build and deployment**، گزینهٔ **Source** را روی **Deploy from a branch** بگذارید
3. شاخهٔ **main** و پوشهٔ **/(root)** را انتخاب کنید
4. چند دقیقه صبر کنید؛ آدرس نهایی به شکل زیر خواهد بود:

```
https://USERNAME.github.io/REPOSITORY-NAME/
```

تمام مسیرها در پروژه **نسبی** هستند، بنابراین برنامه چه در ریشهٔ دامنه و چه در
زیرمسیر یک ریپازیتوری، بدون تغییر کار می‌کند.

## ساختار پروژه

```
fal-farzaneh/
├── index.html
├── README.md
├── SOURCES.md
├── ASSETS.md
├── LICENSE
├── manifest.json
├── sw.js
│
├── css/
│   ├── style.css
│   ├── cosmic.css
│   ├── cards.css
│   ├── animations.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── tarot-engine.js
│   ├── personalization-engine.js
│   ├── jalali-date.js
│   ├── readings.js
│   ├── storage.js
│   └── ui.js
│
└── data/
    └── cards.js
```

---

<div dir="ltr">

## English summary

**Fal Farzaneh** is a fully client-side, Persian-language, mobile-first tarot
web app with a personalized numerology system based on the Shamsi (Jalali)
birth date. No backend, no accounts, no external data transmission — all
history is stored locally via `localStorage`. Deck structure follows the
Rider–Waite–Smith tradition; interpretive texts are original Persian
authorship. Card artwork is original CSS-drawn design (no scanned/commercial
deck images), documented in `ASSETS.md`. Deploy directly to GitHub Pages —
no build step required.

</div>
