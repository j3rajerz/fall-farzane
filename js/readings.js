/**
 * FAL FARZANEH — js/readings.js
 *
 * موتور چینش فال (Reading Engine) و موتور تفسیر (Interpretation Engine).
 * این لایه، ENGINE A (تاروت) و ENGINE B (شخصی‌سازی) را برای ساخت یک
 * فال کامل و قابل‌نمایش با هم ترکیب می‌کند.
 */

(function (global) {
  "use strict";

  const TE = global.TarotEngine;
  const PE = global.PersonalizationEngine;

  const READING_TYPES = {
    single: {
      id: "single", title: "فال یک کارت", count: 1,
      positions: ["پیام امروز"]
    },
    three: {
      id: "three", title: "فال سه کارت", count: 3,
      positions: ["گذشته", "حال", "مسیر پیش رو"]
    },
    love: {
      id: "love", title: "فال عشق", count: 5,
      positions: ["انرژی من", "انرژی طرف مقابل", "وضعیت رابطه", "چالش", "توصیه"]
    },
    career: {
      id: "career", title: "فال کار و مالی", count: 5,
      positions: ["وضعیت فعلی", "فرصت", "مانع", "توصیه", "مسیر"]
    },
    intention: {
      id: "intention", title: "فال نیت", count: 3,
      positions: ["ریشهٔ نیت", "وضعیت کنونی", "پیام برای تأمل"]
    },
    birth: {
      id: "birth", title: "فال تولد", count: 5,
      positions: ["ریشه", "ماهیت درونی", "چالش", "فرصت", "مسیر نمادین پیش رو"]
    },
    tree: {
      id: "tree", title: "فال درخت حیات", count: 10,
      positions: ["تاج (کِتِر)", "حکمت (خُخما)", "فهم (بینا)", "رحمت (حسِد)", "قدرت (گِوورا)", "زیبایی (تیفارت)", "پایداری (نِتزَح)", "شکوه (هود)", "بنیاد (یِسود)", "جهان مادی (مَلخوت)"]
    },
    intuitive: {
      id: "intuitive", title: "انتخاب با شهود", count: 1,
      positions: ["کارتی که تو را صدا زد"]
    },
    daily: {
      id: "daily", title: "فال امروز من", count: 1,
      positions: ["پیام امروز تو"]
    }
  };

  function categoryForReadingType(typeId) {
    if (typeId === "love") return "love";
    if (typeId === "career") return "career";
    return "general";
  }

  function uid() {
    return "r_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  /**
   * ساخت یک فال شخصی‌سازی‌شده (بر پایهٔ بذر تاریخ تولد + نوع فال).
   */
  function buildPersonalizedReading(typeId, profile, extra) {
    const type = READING_TYPES[typeId];
    if (!type) throw new Error("نوع فال نامعتبر است: " + typeId);
    extra = extra || {};

    const baseSeed = profile.numerology.seed;
    const seed = PE.readingSeed(baseSeed, typeId + (extra.question ? ":" + extra.question : ""));
    const draws = PE.drawUniqueCards(seed, type.count);

    return assembleReading(type, draws, {
      mode: "personalized",
      birthDate: profile.date,
      question: extra.question || null
    });
  }

  /**
   * ساخت فال کاملاً تصادفی (بدون وابستگی به تاریخ تولد).
   */
  function buildRandomReading(typeId, extra) {
    const type = READING_TYPES[typeId];
    if (!type) throw new Error("نوع فال نامعتبر است: " + typeId);
    extra = extra || {};
    const draws = PE.drawRandomCards(type.count);
    return assembleReading(type, draws, {
      mode: "random",
      birthDate: null,
      question: extra.question || null
    });
  }

  /**
   * ساخت فال روزانه — قطعی برای همان روز، تغییرپذیر روز بعد.
   */
  function buildDailyReading(profile) {
    const today = global.JalaliDate.todayJalali();
    const seed = PE.dailySeed(profile.numerology.seed, today);
    const draws = PE.drawUniqueCards(seed, 1);
    const reading = assembleReading(READING_TYPES.daily, draws, {
      mode: "daily",
      birthDate: profile.date,
      question: null
    });
    reading.dailyDate = today;
    return reading;
  }

  /**
   * ساخت فال «انتخاب با شهود» — کارت را خودِ کاربر با تپ انتخاب می‌کند؛
   * این تابع فقط چینش نهایی را بر پایهٔ همان کارت انتخابی می‌سازد.
   */
  function buildIntuitiveReading(selectedCardId, forcedOrientation) {
    const card = TE.getCardById(selectedCardId);
    if (!card) throw new Error("کارت انتخابی یافت نشد.");
    const orientation = forcedOrientation || (Math.random() < 0.3 ? "reversed" : "upright");
    const draws = [{ card, orientation }];
    return assembleReading(READING_TYPES.intuitive, draws, {
      mode: "intuitive",
      birthDate: null,
      question: null
    });
  }

  function assembleReading(type, draws, context) {
    const category = categoryForReadingType(type.id);
    const cards = draws.map((d, i) => {
      const position = type.positions[i] || type.positions[0];
      const interpretation = interpretCard(d.card, d.orientation, position, type.id, category, context.question);
      return {
        cardId: d.card.id,
        name_fa: d.card.name_fa,
        name_en: d.card.name_en,
        image: d.card.image,
        alt: d.card.alt,
        orientation: d.orientation,
        position: position,
        keywords: TE.getCardKeywords(d.card, d.orientation),
        interpretation: interpretation
      };
    });

    const summary = generateReadingSummary(cards, type, context);
    const message = generateFarzanehMessage(cards, type);
    const reflection = generateReflectionSuggestion(cards, type);

    return {
      id: uid(),
      typeId: type.id,
      typeTitle: type.title,
      createdAt: new Date().toISOString(),
      mode: context.mode,
      birthDate: context.birthDate,
      question: context.question,
      cards,
      summary,
      farzanehMessage: message,
      reflection
    };
  }

  /**
   * تفسیر یک کارت با توجه به جهت، موقعیت، نوع فال و دسته.
   */
  function interpretCard(card, orientation, position, readingTypeId, category, question) {
    const meaning = TE.getCardMeaning(card, orientation, category);
    const orientationLabel = orientation === "reversed" ? "به‌صورت معکوس" : "به‌صورت مستقیم";
    let text = `در جایگاه «${position}»، کارت ${card.name_fa} ${orientationLabel} ظاهر شده است. ${meaning}`;
    if (question) {
      text += ` در پیوند با نیتی که در ذهن داری، این کارت می‌تواند دعوتی برای تأمل بیشتر دربارهٔ همین موضوع باشد.`;
    }
    return text;
  }

  /**
   * جمع‌بندی منسجم از کل فال بر اساس کارت‌های واقعی کشیده‌شده.
   */
  function generateReadingSummary(cards, type, context) {
    const names = cards.map((c) => c.name_fa).join("، ");
    const reversedCount = cards.filter((c) => c.orientation === "reversed").length;
    let tone;
    if (reversedCount === 0) {
      tone = "جریانی رو‌به‌جلو و نسبتاً روشن در این خوانش دیده می‌شود.";
    } else if (reversedCount === cards.length) {
      tone = "این خوانش دعوتی قوی به درون‌نگری و بازبینی الگوهای درونی است.";
    } else {
      tone = "ترکیبی از انرژی‌های روشن و چالش‌برانگیز در این خوانش به چشم می‌خورد.";
    }

    let intro;
    if (type.id === "single" || type.id === "daily" || type.id === "intuitive") {
      intro = `کارت ${names} در مرکز این فال قرار گرفته است.`;
    } else {
      intro = `در «${type.title}»، کارت‌های ${names} در کنار هم روایتی از موقعیت فعلی می‌سازند.`;
    }

    return `${intro} ${tone} در خوانش نمادین این فال، این ترکیب می‌تواند به روندی اشاره کند که با آگاهی و انتخاب آگاهانه، قابل هدایت است — نه سرنوشتی از پیش‌نوشته‌شده.`;
  }

  const FARZANEH_MESSAGES = [
    "هر کارت آینه‌ای است رو‌به‌روی ذهن تو، نه پنجره‌ای رو‌به‌آینده.",
    "پیام امروز فرزانه: به‌جای پرسیدن «چه اتفاقی می‌افتد؟»، بپرس «من چه می‌خواهم بسازم؟»",
    "کارت‌ها راه را نشان می‌دهند؛ قدم‌برداشتن همیشه با توست.",
    "گاهی روشن‌ترین پاسخ‌ها در سکوتی کوتاه پیش از تصمیم پنهان‌اند.",
    "تاروت نقشه نیست؛ چراغی است برای دیدن بهترِ مسیری که خود انتخاب می‌کنی.",
    "امروز، اجازه بده نمادها با تو حرف بزنند، نه این‌که برایت حکم صادر کنند.",
    "هر پایانی که در کارت‌ها می‌بینی، بذر آغازی تازه هم هست."
  ];

  function generateFarzanehMessage(cards, type) {
    const seedBase = cards.map((c) => c.cardId + c.orientation).join("|") + type.id;
    const idx = Math.abs(PE.hashString(seedBase)) % FARZANEH_MESSAGES.length;
    return FARZANEH_MESSAGES[idx];
  }

  const REFLECTIONS = [
    "امروز چند دقیقه بنویس: این کارت چه بخشی از زندگی‌ات را به یاد تو آورد؟",
    "پیش از خواب، یک بار دیگر به نام این کارت فکر کن و ببین چه احساسی در تو بیدار می‌شود.",
    "یک قدم کوچک و عملی برای امروز از دل این کارت پیدا کن و همان را انجام بده.",
    "با یک نفر مورد اعتماد دربارهٔ پیام این کارت گفت‌وگو کن، بدون این‌که نتیجه را قطعی بدانی.",
    "یک نماد یا رنگ از این کارت را در طول روز مقابل چشمت نگه دار تا یادآور پیام آن باشد."
  ];

  function generateReflectionSuggestion(cards, type) {
    const seedBase = cards.map((c) => c.cardId).join("|") + type.id + "-reflect";
    const idx = Math.abs(PE.hashString(seedBase)) % REFLECTIONS.length;
    return REFLECTIONS[idx];
  }

  global.ReadingsEngine = {
    READING_TYPES,
    buildPersonalizedReading,
    buildRandomReading,
    buildDailyReading,
    buildIntuitiveReading,
    interpretCard,
    generateReadingSummary
  };
})(window);
