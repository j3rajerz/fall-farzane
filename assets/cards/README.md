# راهنمای نام‌گذاری تصاویر کارت‌ها

هر فایلی که در این پوشه (`assets/cards/`) با یکی از این نام‌ها ذخیره شود، **به‌طور خودکار**
به‌جای طرح CSS همان کارت نمایش داده می‌شود — بدون نیاز به تغییر هیچ کد دیگری.

پسوندهای پشتیبانی‌شده به‌ترتیب اولویت: `.jpg` → `.jpeg` → `.png` → `.webp`

منبع پیشنهادی برای دانلود (Public Domain، دستهٔ اصلی ۱۹۰۹): 
https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck_(Roses_%26_Lilies)

## آرکانای کبیر (۲۲ کارت)

| نام فایل | کارت |
|---|---|
| major-00.jpg | ابله (The Fool) |
| major-01.jpg | جادوگر (The Magician) |
| major-02.jpg | کاهنهٔ اعظم (The High Priestess) |
| major-03.jpg | امپراتریس (The Empress) |
| major-04.jpg | امپراتور (The Emperor) |
| major-05.jpg | هیروفنت (The Hierophant) |
| major-06.jpg | عشاق (The Lovers) |
| major-07.jpg | ارابه (The Chariot) |
| major-08.jpg | قدرت (Strength) |
| major-09.jpg | زاهد (The Hermit) |
| major-10.jpg | چرخ سرنوشت (Wheel of Fortune) |
| major-11.jpg | عدالت (Justice) |
| major-12.jpg | مرد آویخته (The Hanged Man) |
| major-13.jpg | مرگ (Death) |
| major-14.jpg | اعتدال (Temperance) |
| major-15.jpg | شیطان (The Devil) |
| major-16.jpg | برج (The Tower) |
| major-17.jpg | ستاره (The Star) |
| major-18.jpg | ماه (The Moon) |
| major-19.jpg | خورشید (The Sun) |
| major-20.jpg | داوری (Judgement) |
| major-21.jpg | جهان (The World) |

## آرکانای صغیر (۵۶ کارت)

الگوی نام‌گذاری: `{suit}-{rank}.jpg` — خوانه‌ها: `wands` (چوبدست)، `cups` (جام)، `swords` (شمشیر)، `pentacles` (سکه)
درجه‌ها: `ace`, `2`..`10`, `page`, `knight`, `queen`, `king`

مثال کامل برای خوانهٔ چوبدست‌ها (بقیهٔ خوانه‌ها را با تعویض `wands` به `cups`/`swords`/`pentacles` بساز):

| نام فایل | کارت |
|---|---|
| wands-ace.jpg | آس چوبدست‌ها |
| wands-2.jpg | دو چوبدست‌ها |
| wands-3.jpg | سه چوبدست‌ها |
| wands-4.jpg | چهار چوبدست‌ها |
| wands-5.jpg | پنج چوبدست‌ها |
| wands-6.jpg | شش چوبدست‌ها |
| wands-7.jpg | هفت چوبدست‌ها |
| wands-8.jpg | هشت چوبدست‌ها |
| wands-9.jpg | نه چوبدست‌ها |
| wands-10.jpg | ده چوبدست‌ها |
| wands-page.jpg | پیک چوبدست‌ها |
| wands-knight.jpg | شوالیه چوبدست‌ها |
| wands-queen.jpg | ملکه چوبدست‌ها |
| wands-king.jpg | شاه چوبدست‌ها |

یعنی برای خوانهٔ جام‌ها: `cups-ace.jpg` تا `cups-king.jpg`
برای شمشیرها: `swords-ace.jpg` تا `swords-king.jpg`
برای سکه‌ها: `pentacles-ace.jpg` تا `pentacles-king.jpg`

## نکته

نیازی نیست همهٔ ۷۸ تصویر را یک‌جا اضافه کنی. هر کارتی که فایلش اینجا نباشد، همچنان با طرح
زیبای CSS اختصاصی برنامه نمایش داده می‌شود — می‌توانی کم‌کم و به‌مرور تکمیل کنی.
