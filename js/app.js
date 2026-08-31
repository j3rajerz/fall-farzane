/**
 * FAL FARZANEH — js/app.js
 * نقطهٔ ورود برنامه: مسیریابی، رندر صفحات و اتصال موتورها به رابط کاربری.
 */

(function () {
  "use strict";

  const TE = window.TarotEngine;
  const PE = window.PersonalizationEngine;
  const RE = window.ReadingsEngine;
  const JD = window.JalaliDate;
  const ST = window.Storage;
  const UI = window.UI;

  const viewRoot = document.getElementById("view-root");
  const bottomNav = document.getElementById("bottom-nav");

  let lastGeneratedReading = null; // برای نمایش سریع پس از ساخت، بدون نیاز به ذخیره/بازخوانی فوری

  // ---------------------------------------------------------------
  // مسیریابی سبک مبتنی بر hash
  // ---------------------------------------------------------------

  const NAV_ITEMS = [
    { key: "home", label: "خانه", icon: "🏠", hash: "#/home" },
    { key: "fal", label: "فال", icon: "🔮", hash: "#/fal" },
    { key: "library", label: "کارت‌ها", icon: "🃏", hash: "#/library" },
    { key: "history", label: "تاریخچه", icon: "📖", hash: "#/history" },
    { key: "about", label: "درباره", icon: "✦", hash: "#/about" }
  ];

  function renderBottomNav(activeKey) {
    bottomNav.innerHTML = NAV_ITEMS.map((item) => `
      <button class="nav-item ${item.key === activeKey ? "active" : ""}" data-hash="${item.hash}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </button>
    `).join("");
    bottomNav.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => { location.hash = btn.dataset.hash; });
    });
  }

  function parseHash() {
    const raw = location.hash.replace(/^#\//, "");
    const parts = raw.split("/").filter(Boolean);
    return { route: parts[0] || "home", param: parts[1] || null };
  }

  function navigate(hash) { location.hash = hash; }

  window.addEventListener("hashchange", render);

  function render() {
    const { route, param } = parseHash();
    viewRoot.scrollTop = 0;
    window.scrollTo(0, 0);

    switch (route) {
      case "home": renderBottomNav("home"); renderHome(); break;
      case "fal": renderBottomNav("fal"); renderFalMenu(); break;
      case "flow": renderBottomNav("fal"); renderFlow(param); break;
      case "result": renderBottomNav("fal"); renderResult(param); break;
      case "library": renderBottomNav("library"); renderLibrary(); break;
      case "card": renderBottomNav("library"); renderCardDetail(param); break;
      case "history": renderBottomNav("history"); renderHistory(); break;
      case "about": renderBottomNav("about"); renderAbout(); break;
      case "profile": renderBottomNav("home"); renderProfileScreen(); break;
      case "tree": renderBottomNav("home"); renderTreeOfLife(param); break;
      case "palm": renderBottomNav("fal"); renderPalmCapture(); break;
      case "palm-result": renderBottomNav("fal"); renderPalmResult(param); break;
      default: renderBottomNav("home"); renderHome();
    }
  }

  // ---------------------------------------------------------------
  // ابزارهای مشترک صفحات
  // ---------------------------------------------------------------

  function screenEl(innerHtml) {
    viewRoot.innerHTML = `<div class="screen">${innerHtml}</div>`;
    return viewRoot.querySelector(".screen");
  }

  function topBar(title) {
    return `
      <div class="top-bar">
        <div>
          <div class="brand-title" style="font-size:20px;">${title}</div>
        </div>
        <div class="logo-mark">✦</div>
      </div>
    `;
  }

  function disclaimerFooter() {
    return `<div class="disclaimer-footer">فال فرزانه تجربه‌ای نمادین برای خودشناسی، تأمل و سرگرمی است و نتیجهٔ آن پیش‌بینی قطعی یا علمی آینده نیست.</div>`;
  }

  // ---------------------------------------------------------------
  // صفحهٔ خانه
  // ---------------------------------------------------------------

  function renderHome() {
    const profile = ST.getProfile();
    const screen = screenEl(`
      ${topBar("")}
      <div style="text-align:center;margin:10px 0 26px;">
        <div class="logo-mark" style="font-size:34px;margin:0 auto 10px;width:auto;">🔮</div>
        <div class="brand-title">فال فرزانه</div>
        <div class="brand-tagline">هر کارت، روایتی برای اندیشیدن</div>
      </div>

      <div class="glass-panel" style="text-align:center;margin-bottom:18px;">
        <h2 style="font-size:17px;font-weight:800;margin-bottom:8px;">آماده‌ای پیام کارت‌ها را بشنوی؟</h2>
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.9;margin-bottom:16px;">نیتت را مشخص کن و بگذار نمادهای تاروت داستان خود را روایت کنند.</p>
        <button class="btn-primary" id="btn-start-fal">✨ شروع فال</button>
      </div>

      <div id="daily-block"></div>

      <div class="section-heading">مسیرهای فرزانه</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button class="glass-card-btn" data-hash="#/flow/birth">
          <span class="icon-badge">🌙</span>
          <span><span class="label-main">فال شخصی با تاریخ تولد</span><br><span class="label-sub">بر پایهٔ تاریخ تولد شمسی تو</span></span>
        </button>
        <button class="glass-card-btn" data-hash="#/flow/intuitive">
          <span class="icon-badge">🎴</span>
          <span><span class="label-main">انتخاب کارت با شهود</span><br><span class="label-sub">کدام کارت تو را صدا می‌زند؟</span></span>
        </button>
        <button class="glass-card-btn" data-hash="#/library">
          <span class="icon-badge">📚</span>
          <span><span class="label-main">کتابخانهٔ کارت‌ها</span><br><span class="label-sub">مرور هر ۷۸ کارت تاروت</span></span>
        </button>
        <button class="glass-card-btn" data-hash="#/tree">
          <span class="icon-badge">🌳</span>
          <span><span class="label-main">درخت حیات فرزانه</span><br><span class="label-sub">لایهٔ نمادین قبالا و حروف عبری</span></span>
        </button>
        <button class="glass-card-btn" data-hash="#/history">
          <span class="icon-badge">📖</span>
          <span><span class="label-main">تاریخچهٔ فال‌ها</span><br><span class="label-sub">دفتر اسرار فرزانه</span></span>
        </button>
      </div>
      ${disclaimerFooter()}
    `);

    screen.querySelector("#btn-start-fal").addEventListener("click", () => navigate("#/fal"));
    screen.querySelectorAll("[data-hash]").forEach((el) => {
      el.addEventListener("click", () => navigate(el.dataset.hash));
    });

    const dailyBlock = screen.querySelector("#daily-block");
    if (profile) {
      dailyBlock.innerHTML = `
        <div class="glass-panel" style="margin-bottom:20px;display:flex;align-items:center;gap:14px;">
          <span style="font-size:26px;">☀️</span>
          <div style="flex:1;">
            <div style="font-weight:700;font-size:14px;">سلام، آماده‌ای فال امروزت را ببینی؟</div>
            <button class="btn-secondary" id="btn-daily" style="margin-top:10px;">فال امروز من</button>
          </div>
        </div>
      `;
      dailyBlock.querySelector("#btn-daily").addEventListener("click", () => {
        const reading = RE.buildDailyReading(profile);
        lastGeneratedReading = reading;
        ST.addHistoryEntry(reading);
        navigate("#/result/last");
      });
    } else {
      dailyBlock.innerHTML = `
        <div class="glass-panel" style="margin-bottom:20px;text-align:center;">
          <div style="font-weight:700;font-size:14px;margin-bottom:10px;">برای شروع، تاریخ تولدت را انتخاب کن</div>
          <button class="btn-secondary" id="btn-pick-birth">انتخاب تاریخ تولد</button>
        </div>
      `;
      dailyBlock.querySelector("#btn-pick-birth").addEventListener("click", () => {
        openBirthDateFlow(() => navigate("#/profile"));
      });
    }
  }

  // ---------------------------------------------------------------
  // آیین تولد کیهانی (بخش ۳۶)
  // ---------------------------------------------------------------

  function openBirthDateFlow(onDone) {
    UI.openJalaliDatePicker((date) => {
      if (!JD.isValidJalaliDate(date.year, date.month, date.day)) {
        alert("تاریخ واردشده معتبر نیست.");
        return;
      }
      const numerology = PE.computeBirthProfile(date);
      const profile = { date, numerology, createdAt: new Date().toISOString() };
      ST.saveProfile(profile);
      playBirthCeremony(profile, onDone);
    });
  }

  function playBirthCeremony(profile, onDone) {
    const settings = ST.getSettings();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || settings.skipIntro;

    if (reduced) { onDone(); return; }

    const overlay = document.createElement("div");
    overlay.className = "birth-ceremony";
    const birthCard = PE.majorNumberToCard(profile.numerology.personalTarotNumber);
    overlay.innerHTML = `
      <div class="bc-stage">
        <div class="bc-ring ring1"></div>
        <div class="bc-ring ring2"></div>
        <div class="bc-ring ring3"></div>
      </div>
      <div class="bc-number">${JD.formatJalali(profile.date.year, profile.date.month, profile.date.day)}</div>
      <div class="bc-card-wrap"></div>
      <div class="bc-caption">آسمان تولدت در حال شکل‌گیری است...</div>
      <button class="bc-skip">رد کردن</button>
    `;
    document.body.appendChild(overlay);
    const cardWrap = overlay.querySelector(".bc-card-wrap");
    cardWrap.appendChild(UI.buildCardElement(birthCard, { faceUp: true, orientation: "upright" }));

    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      overlay.remove();
      onDone();
    }
    overlay.querySelector(".bc-skip").addEventListener("click", finish);
    setTimeout(finish, 4800);
  }

  // ---------------------------------------------------------------
  // پروفایل تاروت من
  // ---------------------------------------------------------------

  function renderProfileScreen() {
    const profile = ST.getProfile();
    if (!profile) { navigate("#/home"); return; }

    const birthCard = PE.majorNumberToCard(profile.numerology.personalTarotNumber);
    const energyCard = PE.majorNumberToCard(profile.numerology.energyNumber);
    const dayCard = PE.majorNumberToCard(profile.numerology.dayNumber);
    const monthCard = PE.majorNumberToCard(profile.numerology.monthNumber);
    const pathCard = PE.majorNumberToCard(profile.numerology.pathNumber);

    const items = [
      { title: "کارت تولد", card: birthCard, desc: "نماد اصلی و بنیادین شخصیت نمادین تو." },
      { title: "کارت انرژی", card: energyCard, desc: "انرژی ثانویه‌ای که در پس‌زمینهٔ مسیر تو جریان دارد." },
      { title: "کارت روز تولد", card: dayCard, desc: "برگرفته از روز تولد تو در تقویم شمسی." },
      { title: "کارت ماه تولد", card: monthCard, desc: "بازتاب نمادین ماه تولدت." },
      { title: "مسیر نمادین", card: pathCard, desc: "برآمده از ترکیب کامل تاریخ تولدت." }
    ];

    const screen = screenEl(`
      ${topBar("پروفایل تاروت من")}
      <div class="glass-panel" style="text-align:center;margin-bottom:18px;">
        <div style="font-size:12.5px;color:var(--text-secondary);">تاریخ تولد</div>
        <div style="font-size:18px;font-weight:800;color:var(--gold-bright);margin:4px 0 10px;">${JD.formatJalali(profile.date.year, profile.date.month, profile.date.day)}</div>
        <div style="font-size:12px;color:var(--text-muted);line-height:1.9;">فال فرزانه از یک سیستم عددشناختی اختصاصی برای ارتباط نمادین تاریخ تولد شمسی با کارت‌های تاروت استفاده می‌کند.</div>
      </div>

      <div class="section-heading">آسمان تولد تو</div>
      <div id="profile-cards" style="display:flex;flex-direction:column;gap:14px;"></div>

      <button class="btn-primary" id="btn-birth-reading" style="margin-top:22px;">فال تولد کامل من</button>
      <button class="btn-secondary" id="btn-my-tree" style="margin-top:10px;">🌳 درخت حیات من</button>
      <button class="btn-ghost" id="btn-reset-profile" style="width:100%;text-align:center;margin-top:10px;">تغییر تاریخ تولد</button>
      ${disclaimerFooter()}
    `);

    const container = screen.querySelector("#profile-cards");
    items.forEach((it) => {
      const row = document.createElement("div");
      row.className = "glass-panel";
      row.style.display = "flex";
      row.style.gap = "12px";
      row.style.alignItems = "center";
      const cardWrap = document.createElement("div");
      cardWrap.style.width = "64px";
      cardWrap.appendChild(UI.buildCardElement(it.card, { faceUp: true, orientation: "upright", size: "mini" }));
      row.appendChild(cardWrap);
      const info = document.createElement("div");
      info.innerHTML = `
        <div style="font-size:12px;color:var(--gold-bright);font-weight:700;">${it.title}</div>
        <div style="font-size:14px;font-weight:800;margin:2px 0 4px;">${it.card.name_fa}</div>
        <div style="font-size:11.5px;color:var(--text-muted);line-height:1.8;">${it.desc}</div>
      `;
      row.appendChild(info);
      container.appendChild(row);
    });

    screen.querySelector("#btn-birth-reading").addEventListener("click", () => {
      const reading = RE.buildPersonalizedReading("birth", profile);
      lastGeneratedReading = reading;
      ST.addHistoryEntry(reading);
      navigate("#/result/last");
    });
    screen.querySelector("#btn-my-tree").addEventListener("click", () => navigate("#/tree"));
    screen.querySelector("#btn-reset-profile").addEventListener("click", () => {
      if (confirm("تاریخ تولد فعلی پاک شود و تاریخ تازه‌ای انتخاب کنی؟")) {
        ST.clearProfile();
        openBirthDateFlow(() => navigate("#/profile"));
      }
    });
  }

  // ---------------------------------------------------------------
  // منوی فال
  // ---------------------------------------------------------------

  const FLOW_META = {
    single: { icon: "🎴", desc: "یک کارت برای تأمل امروز" },
    three: { icon: "🕰️", desc: "گذشته، حال و مسیر پیش رو" },
    love: { icon: "💞", desc: "نگاهی نمادین به احساسات و رابطه" },
    career: { icon: "💼", desc: "کار، فرصت‌ها و موانع پیش رو" },
    intention: { icon: "🕯️", desc: "فالی همراه با نیت یا پرسش تو" },
    birth: { icon: "🌌", desc: "پنج‌کارتی، بر پایهٔ تاریخ تولد" },
    intuitive: { icon: "🎴", desc: "کدام کارت تو را صدا می‌زند؟" },
    tree: { icon: "🌳", desc: "چیدمان نمادین ده‌کارتی بر پایهٔ درخت حیات" }
  };

  function renderFalMenu() {
    const types = RE.READING_TYPES;
    const screen = screenEl(`
      ${topBar("فال فرزانه")}
      <p class="screen-subtitle" style="margin-bottom:18px;">نوع فالی را که امروز با آن هم‌آواتر هستی انتخاب کن.</p>
      <div style="display:flex;flex-direction:column;gap:10px;" id="fal-list"></div>
      ${disclaimerFooter()}
    `);
    const list = screen.querySelector("#fal-list");

    // فال کف‌بینی نمادین با دوربین — یک مسیر جداگانه (بدون کارت تاروت)
    const palmBtn = document.createElement("button");
    palmBtn.className = "glass-card-btn";
    palmBtn.innerHTML = `
      <span class="icon-badge">🖐️</span>
      <span><span class="label-main">کف‌بینی نمادین</span><br><span class="label-sub">با دوربین گوشی، کف دستت را اسکن کن</span></span>
    `;
    palmBtn.addEventListener("click", () => navigate("#/palm"));
    list.appendChild(palmBtn);

    Object.values(types).filter((t) => t.id !== "daily").forEach((t) => {
      const meta = FLOW_META[t.id] || { icon: "✨", desc: "" };
      const btn = document.createElement("button");
      btn.className = "glass-card-btn";
      btn.innerHTML = `
        <span class="icon-badge">${meta.icon}</span>
        <span><span class="label-main">${t.title}</span><br><span class="label-sub">${meta.desc}</span></span>
      `;
      btn.addEventListener("click", () => navigate(`#/flow/${t.id}`));
      list.appendChild(btn);
    });
  }

  // ---------------------------------------------------------------
  // جریان اجرای یک فال (انتخاب حالت، نیت، سپس ساخت)
  // ---------------------------------------------------------------

  function renderFlow(typeId) {
    const type = RE.READING_TYPES[typeId];
    if (!type) { navigate("#/fal"); return; }

    if (typeId === "intuitive") { renderIntuitiveFlow(); return; }

    const profile = ST.getProfile();

    if (typeId === "birth") {
      if (!profile) {
        openBirthDateFlow(() => navigate("#/profile"));
      } else {
        navigate("#/profile");
      }
      return;
    }

    // فیلد نیت/سؤال برای همهٔ انواع فال نمایش داده می‌شود؛ در «فال نیت» عنوان و پیام کمی متفاوت‌تر است
    const needsQuestion = true;
    const isDedicatedIntention = typeId === "intention";

    const screen = screenEl(`
      ${topBar(type.title)}
      <p class="screen-subtitle" style="margin-bottom:16px;">با آرامش چند نفس عمیق بکش و ذهنت را برای این خوانش آماده کن.</p>
      ${typeId === "tree" ? `
        <div class="glass-panel" style="margin-bottom:16px;">
          <p style="font-size:12.5px;line-height:1.9;color:var(--text-secondary);">یک خوانش نمادین بر پایهٔ کارت‌های تاروت و ساختار درخت حیات. این چیدمان یک آیین سنتی قبالای یهودی نیست؛ ترکیبی نمادین و مدرن در فال فرزانه است. هر کارت در جایگاه یکی از ده سفیروت قرار می‌گیرد.</p>
        </div>
      ` : ""}

      ${needsQuestion ? `
        <div style="margin-bottom:18px;">
          <span class="field-label">${isDedicatedIntention ? "نیت یا سؤال خود را در ذهن نگه دار" : "اگر دوست داری، نیت یا سؤالی برای این خوانش بنویس (اختیاری)"}</span>
          <textarea class="intention-input" id="intention-text" placeholder="اگر دوست داری، سؤالت را اینجا بنویس..."></textarea>
        </div>
      ` : ""}

      <div class="section-heading">شیوهٔ فال‌گیری</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
        <button class="glass-card-btn" id="mode-random">
          <span class="icon-badge">🎲</span>
          <span><span class="label-main">فال تصادفی</span><br><span class="label-sub">چینشی کاملاً تصادفی از کل دسته</span></span>
        </button>
        <button class="glass-card-btn" id="mode-personal" ${profile ? "" : "style='opacity:0.5;'"}>
          <span class="icon-badge">🌙</span>
          <span><span class="label-main">فال شخصی با تاریخ تولد</span><br><span class="label-sub">${profile ? "بر پایهٔ پروفایل تاروت تو" : "ابتدا باید تاریخ تولدت را ثبت کنی"}</span></span>
        </button>
      </div>
    `);

    function runReading(mode) {
      const question = needsQuestion ? (screen.querySelector("#intention-text")?.value || "").trim() : null;
      let reading;
      if (mode === "personal") {
        if (!profile) {
          openBirthDateFlow(() => {
            const freshProfile = ST.getProfile();
            reading = RE.buildPersonalizedReading(typeId, freshProfile, { question });
            lastGeneratedReading = reading;
            ST.addHistoryEntry(reading);
            navigate("#/result/last");
          });
          return;
        }
        reading = RE.buildPersonalizedReading(typeId, profile, { question });
      } else {
        reading = RE.buildRandomReading(typeId, { question });
      }
      lastGeneratedReading = reading;
      ST.addHistoryEntry(reading);
      navigate("#/result/last");
    }

    screen.querySelector("#mode-random").addEventListener("click", () => runReading("random"));
    screen.querySelector("#mode-personal").addEventListener("click", () => runReading("personal"));
  }

  function renderIntuitiveFlow() {
    const deck = TE.getAllCards();
    // ۹ کارت تصادفیِ نمایشی برای انتخاب شهودی
    const shuffled = deck.slice().sort(() => Math.random() - 0.5).slice(0, 9);

    const screen = screenEl(`
      ${topBar("انتخاب با شهود")}
      <p class="screen-subtitle" style="text-align:center;margin-bottom:6px;">کدام کارت تو را صدا می‌زند؟</p>
      <p style="text-align:center;font-size:12px;color:var(--text-muted);margin-bottom:16px;">با آرامش یک کارت انتخاب کن</p>
      <div class="intuitive-grid" id="intuitive-grid"></div>
    `);

    const grid = screen.querySelector("#intuitive-grid");
    let locked = false;

    shuffled.forEach((card) => {
      const slot = document.createElement("div");
      slot.className = "intuitive-slot";
      const cardEl = UI.buildCardElement(card, { orientation: Math.random() < 0.3 ? "reversed" : "upright" });
      slot.appendChild(cardEl);
      slot.addEventListener("click", () => {
        if (locked) return;
        locked = true;
        slot.classList.add("risen");
        cardEl.classList.add("glow-pulse");
        setTimeout(() => {
          cardEl.classList.add("flipped");
        }, 350);
        setTimeout(() => {
          const orientation = cardEl.querySelector(".card-face").classList.contains("reversed") ? "reversed" : "upright";
          const reading = RE.buildIntuitiveReading(card.id, orientation);
          lastGeneratedReading = reading;
          ST.addHistoryEntry(reading);
          navigate("#/result/last");
        }, 1300);
      });
      grid.appendChild(slot);
    });
  }

  // ---------------------------------------------------------------
  // صفحهٔ نتیجهٔ فال
  // ---------------------------------------------------------------

  function renderResult(param) {
    let reading;
    if (param === "last" && lastGeneratedReading) {
      reading = lastGeneratedReading;
    } else {
      reading = ST.getHistory().find((r) => r.id === param);
    }
    if (!reading) { navigate("#/history"); return; }
    if (reading.kind === "palm") { navigate(`#/palm-result/${param}`); return; }

    const screen = screenEl(`
      ${topBar("فال شما")}
      <div style="text-align:center;margin-bottom:6px;">
        <div class="pill active">${reading.typeTitle}</div>
      </div>
      ${reading.question ? `<p style="text-align:center;font-size:12.5px;color:var(--text-muted);margin:10px 0;">نیت تو: «${escapeHtml(reading.question)}»</p>` : ""}
      <div id="result-cards" style="margin-top:16px;"></div>

      <div class="glass-panel fade-in-text" style="margin-top:8px;">
        <div class="section-heading" style="margin-top:0;">جمع‌بندی</div>
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);">${reading.summary}</p>
      </div>

      <div class="glass-panel fade-in-text" style="margin-top:14px;">
        <div class="section-heading" style="margin-top:0;">پیام فرزانه</div>
        <p style="font-size:14px;line-height:2;color:var(--gold-bright);font-weight:700;">${reading.farzanehMessage}</p>
      </div>

      <div class="glass-panel fade-in-text" style="margin-top:14px;">
        <div class="section-heading" style="margin-top:0;">پیشنهاد برای تأمل</div>
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);">${reading.reflection}</p>
      </div>

      <button class="btn-secondary" id="btn-back-fal" style="margin-top:22px;">بازگشت به فال‌ها</button>
      ${disclaimerFooter()}
    `);

    const cardsContainer = screen.querySelector("#result-cards");
    reading.cards.forEach((c, i) => {
      const card = TE.getCardById(c.cardId);
      const slot = document.createElement("div");
      slot.className = "reading-card-slot card-lift-in";
      slot.style.animationDelay = (i * 0.12) + "s";
      const visual = document.createElement("div");
      visual.className = "reading-card-visual";
      visual.appendChild(UI.buildCardElement(card, { faceUp: true, orientation: c.orientation }));
      slot.innerHTML = `<div class="position-label">${c.position}</div>`;
      slot.appendChild(visual);
      const info = document.createElement("div");
      info.className = "glass-panel";
      info.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
          <span style="font-weight:800;font-size:14.5px;">${c.name_fa}</span>
          <span style="font-size:10.5px;color:var(--text-muted);">${c.name_en}</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
          ${c.keywords.map((k) => `<span class="pill">${k}</span>`).join("")}
        </div>
        <p style="font-size:13px;line-height:2;color:var(--text-secondary);">${c.interpretation}</p>
      `;
      slot.appendChild(info);
      cardsContainer.appendChild(slot);
    });

    screen.querySelector("#btn-back-fal").addEventListener("click", () => navigate("#/fal"));
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------
  // کف‌بینی نمادین با دوربین
  // ---------------------------------------------------------------

  let activePalmStream = null;

  function stopPalmStream() {
    if (activePalmStream) {
      activePalmStream.getTracks().forEach((t) => t.stop());
      activePalmStream = null;
    }
  }

  // هر بار مسیر عوض شد، اگر دوربین کف‌بینی روشن بود خاموشش کن (جلوگیری از مصرف باتری/دوربین در پس‌زمینه)
  window.addEventListener("hashchange", stopPalmStream);

  function renderPalmCapture() {
    const screen = screenEl(`
      ${topBar("کف‌بینی نمادین")}
      <p class="screen-subtitle" style="margin-bottom:14px;">کف دستت را جلوی دوربین بگیر، در نور کافی و بدون لرزش، سپس عکس بگیر.</p>

      <div class="glass-panel" style="margin-bottom:16px;">
        <p style="font-size:12px;line-height:1.9;color:var(--text-secondary);">کف‌بینی یک روش علمی برای پیش‌بینی آینده نیست. آنچه دریافت می‌کنی یک تفسیر نمادین و سرگرم‌کننده بر پایهٔ خطوط سنتی کف دست است، درست مثل فال تاروت در همین برنامه — نه تشخیص پزشکی یا پیش‌گویی قطعی.</p>
      </div>

      <div id="palm-camera-wrap" class="palm-camera-wrap">
        <video id="palm-video" playsinline autoplay muted></video>
        <div class="palm-hand-guide" aria-hidden="true">🖐️</div>
      </div>
      <div id="palm-fallback-wrap" style="display:none;"></div>

      <div style="margin:18px 0;">
        <span class="field-label">اگر دوست داری، نیت یا سؤالی برای این کف‌بینی بنویس (اختیاری)</span>
        <textarea class="intention-input" id="palm-intention-text" placeholder="مثلاً: دربارهٔ مسیر شغلی‌ام..."></textarea>
      </div>

      <button class="btn-primary" id="btn-palm-capture" disabled>📷 در حال آماده‌سازی دوربین...</button>
      <button class="btn-secondary" id="btn-palm-upload" style="margin-top:10px;">🖼️ انتخاب عکس از گالری</button>
      <input type="file" accept="image/*" capture="environment" id="palm-file-input" style="display:none;" />

      ${disclaimerFooter()}
    `);

    const video = screen.querySelector("#palm-video");
    const cameraWrap = screen.querySelector("#palm-camera-wrap");
    const fallbackWrap = screen.querySelector("#palm-fallback-wrap");
    const captureBtn = screen.querySelector("#btn-palm-capture");
    const uploadBtn = screen.querySelector("#btn-palm-upload");
    const fileInput = screen.querySelector("#palm-file-input");

    function finishWithImage(imgSourceEl, naturalW, naturalH) {
      // تبدیل عکس (از ویدیو یا فایل) به کانواس با اندازهٔ محدود برای کارایی و حجم ذخیره‌سازی بهتر
      const maxSide = 640;
      const scale = Math.min(1, maxSide / Math.max(naturalW, naturalH));
      const w = Math.max(1, Math.round(naturalW * scale));
      const h = Math.max(1, Math.round(naturalH * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgSourceEl, 0, 0, w, h);

      stopPalmStream();

      const stats = window.PalmEngine.analyzeImageData(ctx, w, h);
      let dataUrl = null;
      try {
        dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      } catch (e) {
        dataUrl = null; // مثلاً به‌خاطر محدودیت مرورگر؛ خوانش بدون تصویر هم قابل‌نمایش است
      }

      const question = (screen.querySelector("#palm-intention-text")?.value || "").trim();
      const reading = window.PalmEngine.buildPalmReading(dataUrl, stats, { question: question || null });
      lastGeneratedReading = reading;
      ST.addHistoryEntry(reading);
      navigate("#/palm-result/last");
    }

    captureBtn.addEventListener("click", () => {
      if (!video.srcObject) return;
      finishWithImage(video, video.videoWidth || 480, video.videoHeight || 640);
    });

    uploadBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => finishWithImage(img, img.naturalWidth, img.naturalHeight);
      img.onerror = () => alert("این فایل قابل‌خواندن نبود؛ لطفاً عکس دیگری انتخاب کن.");
      const reader = new FileReader();
      reader.onload = () => { img.src = reader.result; };
      reader.readAsDataURL(file);
    });

    // تلاش برای روشن‌کردن دوربین؛ در صورت نبود دسترسی، فقط حالت آپلود از گالری فعال می‌ماند
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then((stream) => {
          activePalmStream = stream;
          video.srcObject = stream;
          captureBtn.disabled = false;
          captureBtn.textContent = "📷 گرفتن عکس";
        })
        .catch(() => {
          cameraWrap.style.display = "none";
          fallbackWrap.style.display = "block";
          fallbackWrap.innerHTML = `<div class="empty-state"><div class="empty-icon">📷</div><p>دسترسی به دوربین ممکن نشد. می‌توانی از دکمهٔ «انتخاب عکس از گالری» استفاده کنی.</p></div>`;
          captureBtn.style.display = "none";
        });
    } else {
      cameraWrap.style.display = "none";
      fallbackWrap.style.display = "block";
      fallbackWrap.innerHTML = `<div class="empty-state"><div class="empty-icon">📷</div><p>مرورگر تو از دوربین در وب پشتیبانی نمی‌کند. از دکمهٔ «انتخاب عکس از گالری» استفاده کن.</p></div>`;
      captureBtn.style.display = "none";
    }
  }

  function renderPalmResult(param) {
    let reading;
    if (param === "last" && lastGeneratedReading && lastGeneratedReading.kind === "palm") {
      reading = lastGeneratedReading;
    } else {
      reading = ST.getHistory().find((r) => r.id === param);
    }
    if (!reading || reading.kind !== "palm") { navigate("#/history"); return; }

    const screen = screenEl(`
      ${topBar("کف‌بینی نمادین")}
      <div style="text-align:center;margin-bottom:6px;">
        <div class="pill active">${reading.typeTitle}</div>
      </div>
      ${reading.question ? `<p style="text-align:center;font-size:12.5px;color:var(--text-muted);margin:10px 0;">نیت تو: «${escapeHtml(reading.question)}»</p>` : ""}

      ${reading.image ? `
        <div class="palm-photo-frame">
          <img src="${reading.image}" alt="عکس کف دست" />
        </div>
      ` : ""}

      <div class="glass-panel fade-in-text" style="margin-top:16px;">
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);">${reading.summary}</p>
      </div>

      <div id="palm-lines" style="margin-top:14px;display:flex;flex-direction:column;gap:10px;"></div>

      <div class="glass-panel fade-in-text" style="margin-top:14px;">
        <div class="section-heading" style="margin-top:0;">پیام فرزانه</div>
        <p style="font-size:14px;line-height:2;color:var(--gold-bright);font-weight:700;">${reading.farzanehMessage}</p>
      </div>

      <div class="glass-panel fade-in-text" style="margin-top:14px;">
        <div class="section-heading" style="margin-top:0;">پیشنهاد برای تأمل</div>
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);">${reading.reflection}</p>
      </div>

      <button class="btn-secondary" id="btn-back-fal" style="margin-top:22px;">بازگشت به فال‌ها</button>
      ${disclaimerFooter()}
    `);

    const linesContainer = screen.querySelector("#palm-lines");
    reading.lines.forEach((line, i) => {
      const item = document.createElement("div");
      item.className = "glass-panel card-lift-in";
      item.style.animationDelay = (i * 0.12) + "s";
      item.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <span class="icon-badge" style="font-size:18px;">${line.icon}</span>
          <div>
            <div style="font-weight:800;font-size:14.5px;">${line.title}</div>
            <div style="font-size:11px;color:var(--text-muted);">${line.domain}</div>
          </div>
        </div>
        <p style="font-size:13px;line-height:2;color:var(--text-secondary);">${line.text}</p>
      `;
      linesContainer.appendChild(item);
    });

    screen.querySelector("#btn-back-fal").addEventListener("click", () => navigate("#/fal"));
  }

  // ---------------------------------------------------------------
  // کتابخانهٔ کارت‌ها
  // ---------------------------------------------------------------

  const LIBRARY_FILTERS = [
    { key: "all", label: "همه" },
    { key: "major", label: "آرکانای کبیر" },
    { key: "wands", label: "چوبدست‌ها" },
    { key: "cups", label: "جام‌ها" },
    { key: "swords", label: "شمشیرها" },
    { key: "pentacles", label: "سکه‌ها" }
  ];

  let libraryState = { filter: "all", query: "" };

  function renderLibrary() {
    const screen = screenEl(`
      ${topBar("کتابخانهٔ کارت‌ها")}
      <div class="search-box">
        <span>🔎</span>
        <input type="text" id="lib-search" placeholder="جست‌وجوی نام کارت..." value="${escapeHtml(libraryState.query)}" />
      </div>
      <div class="chip-row" id="lib-filters"></div>
      <div class="library-grid" id="lib-grid"></div>
    `);

    const filterRow = screen.querySelector("#lib-filters");
    LIBRARY_FILTERS.forEach((f) => {
      const chip = document.createElement("button");
      chip.className = "chip-btn" + (libraryState.filter === f.key ? " active" : "");
      chip.textContent = f.label;
      chip.addEventListener("click", () => { libraryState.filter = f.key; renderLibrary(); });
      filterRow.appendChild(chip);
    });

    screen.querySelector("#lib-search").addEventListener("input", (e) => {
      libraryState.query = e.target.value;
      renderGrid();
    });

    function renderGrid() {
      const grid = screen.querySelector("#lib-grid");
      grid.innerHTML = "";
      let cards = TE.filterCards(libraryState.filter);
      if (libraryState.query.trim()) {
        const q = libraryState.query.trim().toLowerCase();
        cards = cards.filter((c) => c.name_fa.toLowerCase().includes(q) || c.name_en.toLowerCase().includes(q));
      }
      if (cards.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">🌌</div><p>کارتی با این مشخصات یافت نشد.</p></div>`;
        return;
      }
      cards.forEach((c) => {
        const el = UI.buildCardElement(c, { faceUp: true, orientation: "upright", size: "mini" });
        el.addEventListener("click", () => navigate(`#/card/${c.id}`));
        grid.appendChild(el);
      });
    }
    renderGrid();
  }

  function renderCardDetail(cardId) {
    const card = TE.getCardById(cardId);
    if (!card) { navigate("#/library"); return; }

    const screen = screenEl(`
      ${topBar(card.name_fa)}
      <div style="width:52%;margin:0 auto 18px;" id="detail-card-visual"></div>
      <div style="text-align:center;margin-bottom:6px;">
        <div style="font-size:19px;font-weight:800;">${card.name_fa}</div>
        <div style="font-size:12px;color:var(--text-muted);">${card.name_en}</div>
      </div>
      <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin:12px 0 20px;">
        ${card.keywords_upright.map((k) => `<span class="pill">${k}</span>`).join("")}
      </div>
      <div class="glass-panel" id="detail-accordion"></div>
      <button class="btn-secondary" id="btn-back-lib" style="margin-top:20px;">بازگشت به کتابخانه</button>
    `);

    screen.querySelector("#detail-card-visual").appendChild(
      UI.buildCardElement(card, { faceUp: true, orientation: "upright" })
    );

    const accordion = screen.querySelector("#detail-accordion");
    accordion.appendChild(UI.buildAccordionItem("معنای مستقیم", `
      <p style="margin-bottom:8px;">${card.upright.general}</p>
      <p><strong>عشق:</strong> ${card.upright.love}</p>
      <p><strong>کار:</strong> ${card.upright.career}</p>
      <p><strong>مالی:</strong> ${card.upright.finance}</p>
      <p><strong>معنوی:</strong> ${card.upright.spiritual}</p>
    `));
    accordion.appendChild(UI.buildAccordionItem("معنای معکوس", `
      <p style="margin-bottom:8px;">${card.reversed.general}</p>
      <p><strong>عشق:</strong> ${card.reversed.love}</p>
      <p><strong>کار:</strong> ${card.reversed.career}</p>
      <p><strong>مالی:</strong> ${card.reversed.finance}</p>
      <p><strong>معنوی:</strong> ${card.reversed.spiritual}</p>
    `));
    accordion.appendChild(UI.buildAccordionItem("نمادشناسی", `<p>${card.symbolism}</p>`));
    accordion.appendChild(UI.buildAccordionItem("عنصر، اختربینی و عددشناسی", `
      <p><strong>عنصر:</strong> ${card.element}</p>
      <p><strong>اختربینی:</strong> ${card.astrology}</p>
      <p><strong>عددشناسی:</strong> ${card.numerology}</p>
    `));

    if (card.arcana === "major" && window.Kabbalah && window.KabbalahData) {
      const qabHtml = window.Kabbalah.cardQabalahHtml(card.id);
      if (qabHtml) {
        const qabItem = UI.buildAccordionItem("لایهٔ قبالایی", qabHtml);
        accordion.appendChild(qabItem);
        const btn = qabItem.querySelector("#qab-view-tree");
        if (btn) btn.addEventListener("click", () => navigate("#/tree/" + btn.dataset.path));
      }
    }

    screen.querySelector("#btn-back-lib").addEventListener("click", () => navigate("#/library"));
  }

  // ---------------------------------------------------------------
  // درخت حیات فرزانه — ماژول قبالا / درخت حیات / حروف عبری
  // ---------------------------------------------------------------

  function renderTreeOfLife(pathParam) {
    const KB = window.Kabbalah;
    const KD = window.KabbalahData;
    const profile = ST.getProfile();

    let personalCardIds = [];
    let personalNote = "";
    if (profile) {
      const n = profile.numerology;
      personalCardIds = [n.personalTarotNumber, n.energyNumber, n.dayNumber, n.monthNumber, n.pathNumber]
        .map((num) => PE.majorNumberToCard(num))
        .filter(Boolean)
        .map((c) => c.id);
      personalNote = `مسیرهای درخشان روی درخت، مسیرهای نمادین کارت‌های شخصی توست — یکی از محورهای تأمل شخصی تو، نه سرنوشتی قطعی.`;
    } else {
      personalNote = `برای دیدن «درخت حیات من» با مسیرهای شخصی‌سازی‌شده، ابتدا تاریخ تولدت را ثبت کن.`;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const screen = screenEl(`
      ${topBar("درخت حیات فرزانه")}
      <div class="tradition-badge">نمایش نمادین درخت حیات</div>
      <div class="glass-panel" style="margin-bottom:14px;">
        <p style="font-size:12.5px;line-height:1.9;color:var(--text-secondary);">تاروت و قبالا در اصل دو سنت تاریخی یکسان نیستند. قبالای یهودی سنتی بسیار قدیمی‌تر است و پیوند مستقیم میان تاروت و حروف عبری عمدتاً در جریان‌های باطنی غربی سدهٔ نوزدهم شکل گرفت. فال فرزانه این دو سنت را به‌عنوان یک لایهٔ تطبیقی و نمادین در کنار یکدیگر ارائه می‌کند.</p>
      </div>

      <div class="tree-wrap" id="tree-wrap"></div>
      <div class="pillar-tags">
        <span>${KD.PILLARS.left.fa}</span>
        <span>${KD.PILLARS.middle.fa}</span>
        <span>${KD.PILLARS.right.fa}</span>
      </div>
      <div class="tree-legend">
        <span><i style="background:var(--gold);"></i> مسیر عادی</span>
        ${profile ? `<span><i style="background:var(--accent-violet);"></i> مسیر شخصی تو</span>` : ""}
      </div>

      <div class="glass-panel" style="margin-bottom:16px;">
        <p style="font-size:12px;line-height:1.9;color:var(--text-muted);">${personalNote}</p>
      </div>

      <div class="section-heading">فال درخت حیات</div>
      <button class="glass-card-btn" id="btn-tree-spread">
        <span class="icon-badge">🌳</span>
        <span><span class="label-main">چیدمان نمادین درخت حیات در فال فرزانه</span><br><span class="label-sub">یک کارت برای هر سفیروت</span></span>
      </button>

      <div class="section-heading">عدد حروف عبری (گماتریا)</div>
      <div class="glass-panel" style="margin-bottom:18px;">
        <p style="font-size:11.5px;line-height:1.8;color:var(--text-muted);margin-bottom:10px;">یک ویژگی آموزشی و نمادین — برای پیش‌بینی قطعی مالی، پزشکی یا سرنوشت استفاده نمی‌شود.</p>
        <div class="chip-row" id="gematria-letters" style="margin-bottom:8px;"></div>
        <div style="display:flex;gap:8px;">
          <span id="gematria-word" style="flex:1;font-size:20px;text-align:center;min-height:28px;color:var(--gold-bright);"></span>
        </div>
        <button class="btn-ghost" id="gematria-clear" style="width:100%;text-align:center;margin-top:6px;">پاک کردن</button>
        <div id="gematria-result"></div>
      </div>

      <div class="section-heading">منابع و سنت</div>
      <div class="glass-panel" id="tree-sources"></div>

      ${disclaimerFooter()}
    `);

    const wrap = screen.querySelector("#tree-wrap");
    const svg = KB.buildTreeSVG({ personalCardIds, animate: !reduced });
    wrap.appendChild(svg);
    KB.attachTreeInteractivity(svg);

    if (pathParam) {
      const pathNum = Number(pathParam);
      const line = svg.querySelector(`.tree-path-line[data-path="${pathNum}"]`);
      if (line) setTimeout(() => line.dispatchEvent(new Event("click")), 250);
    }

    screen.querySelector("#btn-tree-spread").addEventListener("click", () => navigate("#/flow/tree"));

    // --- گماتریا ---
    let composed = "";
    const lettersRow = screen.querySelector("#gematria-letters");
    KD.HEBREW_LETTERS.forEach((l) => {
      const chip = document.createElement("button");
      chip.className = "chip-btn";
      chip.textContent = l.letter;
      chip.title = l.name;
      chip.addEventListener("click", () => {
        composed += l.letter;
        updateGematria();
      });
      lettersRow.appendChild(chip);
    });
    function updateGematria() {
      screen.querySelector("#gematria-word").textContent = composed;
      const resultEl = screen.querySelector("#gematria-result");
      if (!composed) { resultEl.innerHTML = ""; return; }
      KB.renderGematria(resultEl, composed);
    }
    screen.querySelector("#gematria-clear").addEventListener("click", () => {
      composed = "";
      updateGematria();
    });

    // --- منابع ---
    screen.querySelector("#tree-sources").innerHTML = `
      <div class="tradition-split">
        <div class="tradition-item">
          <b>قبالای یهودی</b>
          <p>سنت عرفانی تاریخی یهودی؛ منابع اصلی: سفر یصیرا (ספר יצירה) و زوهر (ספר הזוהר).</p>
        </div>
        <div class="tradition-item">
          <b>قبالای هرمتیک</b>
          <p>نظام باطنی غربی، برگرفته از آثار الیفاس لوی و طریقت گلدن داون (Hermetic Order of the Golden Dawn).</p>
        </div>
        <div class="tradition-item">
          <b>تاروت رایدر–ویت–اسمیت</b>
          <p>سنت طراحی و تفسیر کارت‌های تاروت که مبنای کتابخانهٔ فال فرزانه است.</p>
        </div>
        <div class="tradition-item">
          <b>شخصی‌سازی فال فرزانه</b>
          <p>الگوریتم نمادین اختصاصی این برنامه برای پیوند تاریخ تولد شمسی با کارت‌ها و مسیرهای درخت حیات.</p>
        </div>
      </div>
      <button class="btn-ghost" id="btn-more-sources" style="width:100%;text-align:center;margin-top:12px;">منبع این اطلاعات</button>
    `;
    screen.querySelector("#btn-more-sources").addEventListener("click", () => navigate("#/about"));
  }

  // ---------------------------------------------------------------
  // تاریخچه — دفتر اسرار فرزانه
  // ---------------------------------------------------------------

  function renderHistory() {
    const history = ST.getHistory();
    const screen = screenEl(`
      ${topBar("دفتر اسرار فرزانه")}
      ${history.length ? `<button class="btn-ghost" id="btn-clear-all" style="margin-bottom:12px;">پاک کردن همه 🗑️</button>` : ""}
      <div id="history-list" style="display:flex;flex-direction:column;gap:10px;"></div>
    `);

    const list = screen.querySelector("#history-list");
    if (history.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">📖</div><p>هنوز فالی در دفتر اسرار تو ثبت نشده است.<br>یک فال تازه بگیر تا اینجا نمایش داده شود.</p></div>`;
    } else {
      history.forEach((entry) => {
        const d = new Date(entry.createdAt);
        const item = document.createElement("div");
        item.className = "glass-panel";
        const isPalm = entry.kind === "palm";
        const subLine = isPalm ? "۴ خط نمادین کف دست" : `${(entry.cards || []).length} کارت`;
        item.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-weight:700;font-size:13.5px;">${entry.typeTitle}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:3px;">${d.toLocaleDateString("fa-IR")} — ${subLine}</div>
            </div>
            <div style="display:flex;gap:8px;">
              <button class="btn-icon" data-view="${entry.id}" data-kind="${isPalm ? "palm" : "tarot"}" title="مشاهده">👁️</button>
              <button class="btn-icon" data-del="${entry.id}" title="حذف">🗑️</button>
            </div>
          </div>
        `;
        list.appendChild(item);
      });
      list.querySelectorAll("[data-view]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const target = btn.dataset.kind === "palm" ? "#/palm-result/" : "#/result/";
          navigate(target + btn.dataset.view);
        });
      });
      list.querySelectorAll("[data-del]").forEach((btn) => {
        btn.addEventListener("click", () => {
          ST.removeHistoryEntry(btn.dataset.del);
          renderHistory();
        });
      });
    }

    const clearBtn = screen.querySelector("#btn-clear-all");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("همهٔ تاریخچهٔ فال‌ها برای همیشه پاک شود؟")) {
          ST.clearHistory();
          renderHistory();
        }
      });
    }
  }

  // ---------------------------------------------------------------
  // درباره
  // ---------------------------------------------------------------

  function renderAbout() {
    const screen = screenEl(`
      ${topBar("دربارهٔ فال فرزانه")}
      <div class="glass-panel" style="margin-bottom:14px;">
        <div class="section-heading" style="margin-top:0;">تاروت چیست؟</div>
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);">تاروت مجموعه‌ای از ۷۸ کارت نمادین است که قرن‌ها در سنت‌های مختلف برای تأمل، خودشناسی و روایت‌گری استفاده شده است. فال فرزانه از ساختار سنتی رایدر-ویت-اسمیت (RWS) به‌عنوان چارچوب اصلی خود بهره می‌برد.</p>
      </div>
      <div class="glass-panel" style="margin-bottom:14px;">
        <div class="section-heading" style="margin-top:0;">سیستم شخصی‌سازی فرزانه</div>
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);">فال فرزانه از یک سیستم عددشناختی اختصاصی برای ارتباط نمادین تاریخ تولد شمسی با کارت‌های تاروت استفاده می‌کند. این سیستم، سنتی تاریخی یا قاعده‌ای علمی نیست؛ بلکه الگوریتمی مستند و قطعی است که مختص همین برنامه طراحی شده است.</p>
      </div>
      <div class="glass-panel" style="margin-bottom:14px;">
        <div class="section-heading" style="margin-top:0;">تقویم شمسی</div>
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);">تمام محاسبات تاریخ تولد بر پایهٔ تقویم هجری شمسی (جلالی) انجام می‌شود تا تجربه‌ای کاملاً بومی و دقیق برای کاربر فارسی‌زبان فراهم شود.</p>
      </div>
      <div class="glass-panel" style="margin-bottom:14px;">
        <div class="section-heading" style="margin-top:0;">حریم خصوصی</div>
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);">هیچ داده‌ای از تاریخ تولد، سؤال‌ها یا تاریخچهٔ فال‌های تو به هیچ سروری ارسال نمی‌شود. همه‌چیز فقط در همین مرورگر و روی همین دستگاه ذخیره می‌شود.</p>
      </div>
      <div class="glass-panel" style="margin-bottom:14px;">
        <div class="section-heading" style="margin-top:0;">محدودیت‌ها</div>
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);">فال فرزانه از نمادهای تاروت برای یک تجربهٔ شخصی، سرگرم‌کننده و تأمل‌برانگیز استفاده می‌کند. این برنامه ادعای پیش‌بینی علمی یا قطعی آینده را ندارد.</p>
      </div>
      <div class="glass-panel" style="margin-bottom:14px;">
        <div class="section-heading" style="margin-top:0;">درخت حیات فرزانه — تفکیک سنت‌ها</div>
        <p style="font-size:13.5px;line-height:2;color:var(--text-secondary);margin-bottom:10px;">تاروت و قبالا در اصل دو سنت تاریخی یکسان نیستند. قبالای یهودی سنتی بسیار قدیمی‌تر است و پیوند مستقیم میان تاروت و حروف عبری عمدتاً در جریان‌های باطنی غربی سدهٔ نوزدهم شکل گرفت. فال فرزانه این دو سنت را به‌عنوان یک لایهٔ تطبیقی و نمادین در کنار یکدیگر ارائه می‌کند.</p>
        <button class="btn-secondary" id="btn-about-tree" style="width:100%;">مشاهدهٔ درخت حیات فرزانه</button>
      </div>
      ${disclaimerFooter()}
    `);
    screen.querySelector("#btn-about-tree").addEventListener("click", () => navigate("#/tree"));
  }

  // ---------------------------------------------------------------
  // پس‌زمینهٔ کیهانی — ستارگان (بخش ۶)
  // ---------------------------------------------------------------

  function initCosmicBackground() {
    const canvas = document.getElementById("cosmic-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = Math.min(140, Math.floor((window.innerWidth * window.innerHeight) / 9000));
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005
    }));

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f3efe6";
      stars.forEach((s) => {
        const twinkle = reduced ? 0.6 : (0.4 + 0.6 * Math.abs(Math.sin(s.phase + t * s.speed)));
        ctx.globalAlpha = twinkle * 0.9;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (!reduced) requestAnimationFrame(draw);
    }
    draw(0);
  }

  // ---------------------------------------------------------------
  // مقداردهی اولیه
  // ---------------------------------------------------------------

  function init() {
    initCosmicBackground();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
