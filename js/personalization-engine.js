/**
 * FAL FARZANEH — js/personalization-engine.js
 * ENGINE B — موتور شخصی‌سازی فرزانه
 *
 * مسئول: تاریخ تولد شمسی، اعداد نمادین شخصی، کارت‌های تولد، بذرِ قطعی (deterministic seed)
 * و انتخاب/چینش قطعی کارت‌ها برای فال‌های شخصی‌سازی‌شده.
 *
 * توضیح شفاف: سیستم زیر یک الگوریتم عددشناختی اختصاصیِ «فال فرزانه» است،
 * نه یک قاعدهٔ تاریخی یا سنتی تاروت. این موضوع در صفحهٔ «درباره» نیز توضیح داده شده.
 *
 * این فایل کاملاً مستقل از ENGINE A (js/tarot-engine.js) عمل می‌کند و فقط
 * خروجی عددی/بذر تولید می‌کند که توسط readings.js به کارت واقعی نگاشت می‌شود.
 */

(function (global) {
  "use strict";

  /**
   * هش رشته به یک عدد صحیح ۳۲ بیتی (پیاده‌سازی الگوریتم استاندارد djb2/xfnv1a)
   */
  function hashString(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  /**
   * تولیدکنندهٔ عدد شبه‌تصادفیِ قطعی بر اساس بذر (mulberry32)
   */
  function seededRandomFactory(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function digitSum(n) {
    n = Math.abs(Math.trunc(n));
    let s = 0;
    while (n > 0) { s += n % 10; n = Math.trunc(n / 10); }
    return s;
  }

  /** کاهش عدد به بازهٔ ۰ تا ۲۱ (متناظر با ۲۲ کارت آرکانای کبیر) */
  function reduceToMajorRange(n) {
    n = Math.abs(Math.trunc(n));
    while (n > 21) {
      n = digitSum(n);
      if (n > 21) {
        // ادامهٔ کاهش تا رسیدن به بازهٔ مجاز
        let s = 0, t = n;
        while (t > 0) { s += t % 10; t = Math.trunc(t / 10); }
        n = s;
      }
    }
    return n;
  }

  /**
   * ساخت بذر پایهٔ تاریخ تولد. ورودی: {year, month, day}
   */
  function birthSeed(date) {
    const raw = `jalali:${date.year}-${date.month}-${date.day}`;
    return hashString(raw);
  }

  /**
   * محاسبهٔ پروفایل عددی/نمادین فرزانه از تاریخ تولد شمسی.
   * فرمول‌ها مطابق سند مستربیلد (بخش ۲۲ و ۲۴) مستند شده‌اند:
   *  - عدد اصلی    = year + month + day  → کاهش به ۰..۲۱
   *  - عدد ثانویه  = digitSum(year) + month*day → کاهش به ۰..۲۱
   *  - کارت روز    = day → کاهش به ۰..۲۱
   *  - کارت ماه    = month → نگاشت مستقیم به ۱..۱۲ (متناظر با ۱۲ آرکانای کبیر نخست)
   *  - مسیر نمادین = هش کامل تاریخ → کاهش به ۰..۲۱
   */
  function computeBirthProfile(date) {
    const { year, month, day } = date;
    const primaryRaw = year + month + day;
    const secondaryRaw = digitSum(year) + month * day;
    const dayRaw = day;
    const monthRaw = month;
    const pathSeed = birthSeed(date);

    return {
      seed: pathSeed,
      personalTarotNumber: reduceToMajorRange(primaryRaw),
      energyNumber: reduceToMajorRange(secondaryRaw),
      dayNumber: reduceToMajorRange(dayRaw),
      monthNumber: reduceToMajorRange(monthRaw),
      pathNumber: reduceToMajorRange(pathSeed % 1000),
      raw: { primaryRaw, secondaryRaw, dayRaw, monthRaw }
    };
  }

  /**
   * نگاشت یک عدد ۰..۲۱ به کارت آرکانای کبیر متناظر.
   */
  function majorNumberToCard(n) {
    const majors = global.TarotEngine.getMajorArcana();
    return majors.find((c) => c.number === n) || majors[0];
  }

  /**
   * ساخت بذر ترکیبی برای یک نوع فال خاص، بر اساس بذر تولد + شناسهٔ نوع فال.
   */
  function readingSeed(baseSeed, readingType) {
    return hashString(`${baseSeed}:${readingType}`) >>> 0;
  }

  /**
   * بذر روزانه — بر اساس تاریخ جلالیِ روز جاری، مطابق بخش ۳۵ سند.
   */
  function dailySeed(baseSeed, todayJalali) {
    const composite = baseSeed +
      todayJalali.jy * 10000 +
      todayJalali.jm * 100 +
      todayJalali.jd;
    return hashString(`daily:${composite}`) >>> 0;
  }

  /**
   * برداشتن N کارت یکتا به‌صورت قطعی از یک بذر مشخص (بدون تکرار).
   * جهت (مستقیم/معکوس) هر کارت نیز به‌صورت قطعی از همان جریان تصادفی تعیین می‌شود.
   */
  function drawUniqueCards(seed, count, options) {
    options = options || {};
    const pool = options.pool || global.TarotEngine.getAllCards();
    const rng = seededRandomFactory(seed);

    // الگوریتم فیشر-یتس با تولیدکنندهٔ قطعی
    const indices = pool.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const drawn = indices.slice(0, count).map((idx) => {
      const orientationRoll = rng();
      // احتمال معکوس‌شدن: حدود ۳۰٪ — رفتاری متعادل و رایج در سنت تاروت
      const orientation = orientationRoll < 0.3 ? "reversed" : "upright";
      return { card: pool[idx], orientation };
    });

    return drawn;
  }

  /**
   * برای فال تصادفی معمولی (غیر شخصی‌سازی‌شده) — از Math.random استفاده می‌شود.
   */
  function drawRandomCards(count, options) {
    options = options || {};
    const pool = options.pool || global.TarotEngine.getAllCards();
    const shuffled = pool.slice();
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count).map((card) => ({
      card,
      orientation: Math.random() < 0.3 ? "reversed" : "upright"
    }));
  }

  global.PersonalizationEngine = {
    hashString,
    seededRandomFactory,
    digitSum,
    reduceToMajorRange,
    birthSeed,
    computeBirthProfile,
    majorNumberToCard,
    readingSeed,
    dailySeed,
    drawUniqueCards,
    drawRandomCards
  };
})(window);
