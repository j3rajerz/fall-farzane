/**
 * FAL FARZANEH — data/kabbalah-data.js
 * ماژول «درخت حیات فرزانه» (Farzaneh Tree of Life)
 *
 * این فایل داده‌های نمادین لایهٔ قبالایی برنامه را در بر می‌گیرد:
 *   - ۱۰ سفیروت درخت حیات
 *   - ۲۲ حرف الفبای عبری (به همراه دسته‌بندی سفر یصیرا و ارزش گماتریا)
 *   - ۲۲ مسیر درخت حیات و تطبیق آن‌ها با آرکانای کبیر تاروت
 *
 * IMPORTANT / مهم:
 * این داده صرفاً یک لایهٔ نمادین و تطبیقی است، نه سند تاریخی قطعی.
 * تطبیق میان تاروت و حروف عبری در اینجا بر پایهٔ سنت «قبالای هرمتیک»
 * (Hermetic Qabalah) — به‌طور مشخص نظام منسوب به گلدن داون
 * (Hermetic Order of the Golden Dawn) — است، که پدیده‌ای متأخر و
 * غربی از سدهٔ نوزدهم است، نه بخشی از سنت قبالای یهودی باستان.
 * برای تفکیک کامل سنت‌ها به SOURCES.md مراجعه کن.
 */

(function (global) {
  "use strict";

  // ---------------------------------------------------------------
  // ۱۰ سفیروت
  // ---------------------------------------------------------------
  const SEFIROT = [
    { id: "keter", num: 1, heb: "כתר", en: "Kether", fa: "کِتِر", fa_meaning: "تاج", pillar: "middle", x: 170, y: 34 },
    { id: "chokhmah", num: 2, heb: "חכמה", en: "Chokhmah", fa: "خُخما", fa_meaning: "حکمت", pillar: "right", x: 262, y: 96 },
    { id: "binah", num: 3, heb: "בינה", en: "Binah", fa: "بینا", fa_meaning: "فهم", pillar: "left", x: 78, y: 96 },
    { id: "chesed", num: 4, heb: "חסד", en: "Chesed", fa: "حسِد", fa_meaning: "رحمت / مهربانی", pillar: "right", x: 262, y: 204 },
    { id: "gevurah", num: 5, heb: "גבורה", en: "Gevurah", fa: "گِوورا", fa_meaning: "قدرت / داوری", pillar: "left", x: 78, y: 204 },
    { id: "tiferet", num: 6, heb: "תפארת", en: "Tiferet", fa: "تیفارت", fa_meaning: "زیبایی", pillar: "middle", x: 170, y: 262 },
    { id: "netzach", num: 7, heb: "נצח", en: "Netzach", fa: "نِتزَח", fa_meaning: "پیروزی / پایداری", pillar: "right", x: 262, y: 340 },
    { id: "hod", num: 8, heb: "הוד", en: "Hod", fa: "هود", fa_meaning: "شکوه", pillar: "left", x: 78, y: 340 },
    { id: "yesod", num: 9, heb: "יסוד", en: "Yesod", fa: "یِسود", fa_meaning: "بنیاد", pillar: "middle", x: 170, y: 402 },
    { id: "malkhut", num: 10, heb: "מלכות", en: "Malkhut", fa: "مَلخوت", fa_meaning: "پادشاهی", pillar: "middle", x: 170, y: 476 }
  ];

  const PILLARS = {
    right: { fa: "ستون رحمت", en: "Pillar of Mercy" },
    left: { fa: "ستون شدت / داوری", en: "Pillar of Severity" },
    middle: { fa: "ستون میانی", en: "Middle Pillar" }
  };

  function sefirahById(id) { return SEFIROT.find((s) => s.id === id) || null; }

  // ---------------------------------------------------------------
  // ۲۲ حرف الفبای عبری — بر پایهٔ سفر یصیرا (Sefer Yetzirah)
  // ---------------------------------------------------------------
  // مقدار گماتریا بر پایهٔ روش رایج «مسپار هخرخی» (Mispar Hechrechi)
  const HEBREW_LETTERS = [
    { letter: "א", name: "Aleph", fa: "الف", category: "mother", gematria: 1 },
    { letter: "ב", name: "Bet", fa: "بت", category: "double", gematria: 2 },
    { letter: "ג", name: "Gimel", fa: "گیمل", category: "double", gematria: 3 },
    { letter: "ד", name: "Dalet", fa: "دالت", category: "double", gematria: 4 },
    { letter: "ה", name: "He", fa: "هه", category: "simple", gematria: 5 },
    { letter: "ו", name: "Vav", fa: "واو", category: "simple", gematria: 6 },
    { letter: "ז", name: "Zayin", fa: "زاین", category: "simple", gematria: 7 },
    { letter: "ח", name: "Chet", fa: "خت", category: "simple", gematria: 8 },
    { letter: "ט", name: "Tet", fa: "تت", category: "simple", gematria: 9 },
    { letter: "י", name: "Yod", fa: "یود", category: "simple", gematria: 10 },
    { letter: "כ", name: "Kaf", fa: "کاف", category: "double", gematria: 20 },
    { letter: "ל", name: "Lamed", fa: "لامد", category: "simple", gematria: 30 },
    { letter: "מ", name: "Mem", fa: "مم", category: "mother", gematria: 40 },
    { letter: "נ", name: "Nun", fa: "نون", category: "simple", gematria: 50 },
    { letter: "ס", name: "Samekh", fa: "سامخ", category: "simple", gematria: 60 },
    { letter: "ע", name: "Ayin", fa: "عین", category: "simple", gematria: 70 },
    { letter: "פ", name: "Pe", fa: "په", category: "double", gematria: 80 },
    { letter: "צ", name: "Tzadi", fa: "تسادی", category: "simple", gematria: 90 },
    { letter: "ק", name: "Qof", fa: "قوف", category: "simple", gematria: 100 },
    { letter: "ר", name: "Resh", fa: "ریش", category: "double", gematria: 200 },
    { letter: "ש", name: "Shin", fa: "شین", category: "mother", gematria: 300 },
    { letter: "ת", name: "Tav", fa: "تاو", category: "double", gematria: 400 }
  ];

  const LETTER_CATEGORY_LABEL = {
    mother: "حرف مادر (Mother Letter)",
    double: "حرف مضاعف (Double Letter)",
    simple: "حرف ساده (Simple Letter)"
  };

  function letterByName(name) { return HEBREW_LETTERS.find((l) => l.name === name) || null; }

  // ---------------------------------------------------------------
  // ۲۲ مسیر درخت حیات — تطبیق قبالای هرمتیک (نظام گلدن داون)
  // منبع این تطبیق: سنت قبالای هرمتیک (Hermetic Qabalah / Golden Dawn)
  // ---------------------------------------------------------------
  const TRADITION_LABEL = "قبالای هرمتیک (Hermetic Qabalah — Golden Dawn)";

  const PATHS = [
    { path: 11, letterName: "Aleph", from: "keter", to: "chokhmah", cardId: "major-00", assoc: "عنصر هوا" },
    { path: 12, letterName: "Bet", from: "keter", to: "binah", cardId: "major-01", assoc: "سیارهٔ عطارد" },
    { path: 13, letterName: "Gimel", from: "keter", to: "tiferet", cardId: "major-02", assoc: "ماه" },
    { path: 14, letterName: "Dalet", from: "chokhmah", to: "binah", cardId: "major-03", assoc: "سیارهٔ زهره" },
    { path: 15, letterName: "He", from: "chokhmah", to: "tiferet", cardId: "major-04", assoc: "برج حَمَل" },
    { path: 16, letterName: "Vav", from: "chokhmah", to: "chesed", cardId: "major-05", assoc: "برج ثور" },
    { path: 17, letterName: "Zayin", from: "binah", to: "tiferet", cardId: "major-06", assoc: "برج جوزا" },
    { path: 18, letterName: "Chet", from: "binah", to: "gevurah", cardId: "major-07", assoc: "برج سرطان" },
    { path: 19, letterName: "Tet", from: "chesed", to: "gevurah", cardId: "major-08", assoc: "برج اسد" },
    { path: 20, letterName: "Yod", from: "chesed", to: "tiferet", cardId: "major-09", assoc: "برج سنبله" },
    { path: 21, letterName: "Kaf", from: "chesed", to: "netzach", cardId: "major-10", assoc: "سیارهٔ مشتری" },
    { path: 22, letterName: "Lamed", from: "gevurah", to: "tiferet", cardId: "major-11", assoc: "برج میزان" },
    { path: 23, letterName: "Mem", from: "gevurah", to: "hod", cardId: "major-12", assoc: "عنصر آب" },
    { path: 24, letterName: "Nun", from: "tiferet", to: "netzach", cardId: "major-13", assoc: "برج عقرب" },
    { path: 25, letterName: "Samekh", from: "tiferet", to: "yesod", cardId: "major-14", assoc: "برج قوس" },
    { path: 26, letterName: "Ayin", from: "tiferet", to: "hod", cardId: "major-15", assoc: "برج جدی" },
    { path: 27, letterName: "Pe", from: "netzach", to: "hod", cardId: "major-16", assoc: "سیارهٔ مریخ" },
    { path: 28, letterName: "Tzadi", from: "netzach", to: "yesod", cardId: "major-17", assoc: "برج دلو" },
    { path: 29, letterName: "Qof", from: "netzach", to: "malkhut", cardId: "major-18", assoc: "برج حوت" },
    { path: 30, letterName: "Resh", from: "hod", to: "yesod", cardId: "major-19", assoc: "خورشید" },
    { path: 31, letterName: "Shin", from: "hod", to: "malkhut", cardId: "major-20", assoc: "عنصر آتش" },
    { path: 32, letterName: "Tav", from: "yesod", to: "malkhut", cardId: "major-21", assoc: "سیارهٔ زحل" }
  ];

  function pathForCardId(cardId) { return PATHS.find((p) => p.cardId === cardId) || null; }
  function pathByNumber(num) { return PATHS.find((p) => p.path === num) || null; }

  /**
   * بستهٔ کامل اطلاعات قبالایی یک کارت آرکانای کبیر، آماده برای نمایش در UI.
   */
  function qabalisticInfoForCard(cardId) {
    const p = pathForCardId(cardId);
    if (!p) return null;
    const letter = letterByName(p.letterName);
    const fromS = sefirahById(p.from);
    const toS = sefirahById(p.to);
    return {
      pathNumber: p.path,
      hebrewLetter: letter.letter,
      hebrewName: letter.name,
      hebrewNameFa: letter.fa,
      letterCategory: LETTER_CATEGORY_LABEL[letter.category],
      fromSephirah: fromS,
      toSephirah: toS,
      association: p.assoc,
      tradition: TRADITION_LABEL
    };
  }

  // ---------------------------------------------------------------
  // گماتریا — عدد حروف عبری (روش مسپار هخرخی)
  // ---------------------------------------------------------------
  function gematriaOf(hebrewWord) {
    let total = 0;
    const breakdown = [];
    for (const ch of hebrewWord) {
      const found = HEBREW_LETTERS.find((l) => l.letter === ch);
      if (found) {
        total += found.gematria;
        breakdown.push({ letter: ch, value: found.gematria });
      }
    }
    return { total, breakdown, method: "Mispar Hechrechi (مسپار هخرخی)" };
  }

  global.KabbalahData = {
    SEFIROT,
    PILLARS,
    HEBREW_LETTERS,
    LETTER_CATEGORY_LABEL,
    PATHS,
    TRADITION_LABEL,
    sefirahById,
    letterByName,
    pathForCardId,
    pathByNumber,
    qabalisticInfoForCard,
    gematriaOf
  };
})(window);
