/**
 * FAL FARZANEH — js/jalali-date.js
 *
 * پیاده‌سازی تقویم جلالی (شمسی) بر پایهٔ الگوریتم استاندارد و شناخته‌شدهٔ
 * تبدیل جلالی↔میلادی که توسط کتابخانه‌های معتبری مانند jalaali-js استفاده می‌شود
 * (نگاه کنید به SOURCES.md برای منبع الگوریتم).
 *
 * این فایل کاملاً مستقل است و به موتور تاروت یا موتور شخصی‌سازی وابسته نیست.
 */

(function (global) {
  "use strict";

  const PERSIAN_MONTHS = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  const WEEKDAYS_FA = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

  const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  function toPersianDigits(input) {
    return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
  }

  function toLatinDigits(input) {
    return String(input).replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
  }

  // --- الگوریتم تبدیل جلالی (بر پایهٔ محاسبات نجومی استاندارد jalaali) ---

  function div(a, b) { return ~~(a / b); }
  function mod(a, b) { return a - ~~(a / b) * b; }

  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
    1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
  ];

  function jalCal(jy) {
    const bl = breaks.length;
    const gy = jy + 621;
    let leapJ = -14, jp = breaks[0];
    if (jy < jp || jy >= breaks[bl - 1]) {
      throw new Error("سال جلالی خارج از محدودهٔ پشتیبانی‌شده است.");
    }
    let jump = 0;
    for (let i = 1; i < bl; i += 1) {
      const jm = breaks[i];
      jump = jm - jp;
      if (jy < jm) break;
      leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
      jp = jm;
    }
    let n = jy - jp;
    leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
    if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
    const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
    const march = 20 + leapJ - leapG;
    if (jump - n < 6) n = n - jump + div(jump, 33) * 33;
    let leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) leap = 4;
    return { leap: leap, gy: gy, march: march };
  }

  function isLeapJalaliYear(jy) {
    return jalCal(jy).leap === 0;
  }

  function g2d(gy, gm, gd) {
    let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
      + div(153 * mod(gm + 9, 12) + 2, 5)
      + gd - 34840408;
    d = d - div(div(gy + div(gm - 8, 6) + 100100, 100) * 3, 4) + 752;
    return d;
  }

  function d2g(jdn) {
    let j = 4 * jdn + 139361631;
    j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    const i = div(mod(j, 1461), 4) * 5 + 308;
    const gd = div(mod(i, 153), 5) + 1;
    const gm = mod(div(i, 153), 12) + 1;
    const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
    return { gy: gy, gm: gm, gd: gd };
  }

  function j2d(jy, jm, jd) {
    const r = jalCal(jy);
    return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
  }

  function d2j(jdn) {
    const gy = d2g(jdn).gy;
    let jy = gy - 621;
    let r = jalCal(jy);
    let jdn1f = g2d(gy, 3, r.march);
    let k = jdn - jdn1f;
    if (k >= 0) {
      if (k <= 185) {
        const jm = 1 + div(k, 31);
        const jd = mod(k, 31) + 1;
        return { jy: jy, jm: jm, jd: jd };
      }
      k -= 186;
    } else {
      jy -= 1;
      k += 179;
      if (r.leap === 1) k += 1;
    }
    const jm = 7 + div(k, 30);
    const jd = mod(k, 30) + 1;
    return { jy: jy, jm: jm, jd: jd };
  }

  function jalaaliToGregorian(jy, jm, jd) {
    const jdn = j2d(jy, jm, jd);
    return d2g(jdn);
  }

  function gregorianToJalaali(gy, gm, gd) {
    const jdn = g2d(gy, gm, gd);
    return d2j(jdn);
  }

  function daysInJalaliMonth(jy, jm) {
    if (jm >= 1 && jm <= 6) return 31;
    if (jm >= 7 && jm <= 11) return 30;
    if (jm === 12) return isLeapJalaliYear(jy) ? 30 : 29;
    throw new Error("مقدار ماه نامعتبر است.");
  }

  function isValidJalaliDate(jy, jm, jd) {
    jy = Number(jy); jm = Number(jm); jd = Number(jd);
    if (!Number.isInteger(jy) || !Number.isInteger(jm) || !Number.isInteger(jd)) return false;
    if (jy < 1200 || jy > 1500) return false;
    if (jm < 1 || jm > 12) return false;
    if (jd < 1 || jd > daysInJalaliMonth(jy, jm)) return false;
    return true;
  }

  function todayJalali() {
    const now = new Date();
    return gregorianToJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  function weekdayOfJalali(jy, jm, jd) {
    const g = jalaaliToGregorian(jy, jm, jd);
    const dt = new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
    // JS getUTCDay: 0=Sunday..6=Saturday -> convert to Iranian week (0=Saturday)
    const jsDay = dt.getUTCDay();
    return (jsDay + 1) % 7;
  }

  function formatJalali(jy, jm, jd, opts) {
    opts = opts || {};
    const monthName = PERSIAN_MONTHS[jm - 1];
    const dayStr = toPersianDigits(jd);
    const yearStr = toPersianDigits(jy);
    if (opts.short) return `${dayStr} ${monthName} ${yearStr}`;
    return `${dayStr} ${monthName} ${yearStr}`;
  }

  global.JalaliDate = {
    PERSIAN_MONTHS,
    WEEKDAYS_FA,
    toPersianDigits,
    toLatinDigits,
    isLeapJalaliYear,
    daysInJalaliMonth,
    isValidJalaliDate,
    jalaaliToGregorian,
    gregorianToJalaali,
    todayJalali,
    weekdayOfJalali,
    formatJalali
  };
})(window);
