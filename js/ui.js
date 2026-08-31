/**
 * FAL FARZANEH — js/ui.js
 * قطعات رابط کاربری قابل‌استفادهٔ مجدد: کارت، شیت انتخاب تاریخ، ناوبری، اکاردئون.
 */

(function (global) {
  "use strict";

  const JD = global.JalaliDate;

  // نگاشت نمادهای عمومی (یونیکد، بدون کپی‌رایت) برای هر کارت — بخش ۵۸: طراحی جایگزین زیبا
  const MAJOR_GLYPHS = {
    0: "🌀", 1: "✨", 2: "🌙", 3: "🌿", 4: "🏛️", 5: "🕊️", 6: "💫", 7: "🐎",
    8: "🦁", 9: "🏮", 10: "☸️", 11: "⚖️", 12: "🌀", 13: "🥀", 14: "🌊",
    15: "🔗", 16: "⚡", 17: "⭐", 18: "🌙", 19: "☀️", 20: "📯", 21: "🌍"
  };
  const SUIT_GLYPHS = { wands: "🔥", cups: "💧", swords: "🗡️", pentacles: "🪙" };

  function glyphFor(card) {
    if (card.arcana === "major") return MAJOR_GLYPHS[card.number] || "✨";
    return SUIT_GLYPHS[card.suit] || "✨";
  }

  function suitClass(card) {
    if (card.arcana === "major") return "suit-major";
    return "suit-" + card.suit;
  }

  // پسوندهای رایجی که برای تصاویر واقعی کارت امتحان می‌شوند (بخش ۵۸ سند: سقوط زیبا)
  const REAL_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

  function tryRealImage(card, faceEl, extIndex) {
    extIndex = extIndex || 0;
    if (extIndex >= REAL_IMAGE_EXTENSIONS.length) return; // هیچ تصویری پیدا نشد؛ طرح CSS باقی می‌ماند
    const ext = REAL_IMAGE_EXTENSIONS[extIndex];
    const img = new Image();
    img.onload = function () {
      const realImg = document.createElement("img");
      realImg.src = img.src;
      realImg.alt = card.alt || card.name_fa;
      realImg.className = "cf-real-image";
      realImg.loading = "lazy";
      const fallback = faceEl.querySelector(".cf-fallback");
      if (fallback) fallback.style.display = "none";
      faceEl.insertBefore(realImg, faceEl.firstChild);
    };
    img.onerror = function () {
      tryRealImage(card, faceEl, extIndex + 1);
    };
    img.src = `assets/cards/${card.id}.${ext}`;
  }

  /**
   * ساخت المان DOM یک کارت تاروت با پشت و رو (قابل فلیپ).
   * options: { size: 'normal'|'mini', orientation: 'upright'|'reversed', faceUp: bool, flippable: bool }
   */
  function buildCardElement(card, options) {
    options = options || {};
    const wrap = document.createElement("div");
    wrap.className = "tarot-card" + (options.size === "mini" ? " mini-card" : "") + (options.faceUp ? " flipped" : "");
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", card.alt || card.name_fa);
    wrap.dataset.cardId = card.id;

    const inner = document.createElement("div");
    inner.className = "tarot-card-inner";

    const back = document.createElement("div");
    back.className = "card-back";
    back.innerHTML = `<div class="back-emblem"><span class="back-star">✦</span></div>`;

    const face = document.createElement("div");
    face.className = "card-face" + (options.orientation === "reversed" ? " reversed" : "");
    const reversedTag = options.orientation === "reversed"
      ? `<span class="cf-orientation-tag">معکوس</span>` : "";
    face.innerHTML = `
      ${reversedTag}
      <div class="cf-inner-flip cf-fallback" style="display:flex;flex-direction:column;height:100%;">
        <div class="cf-number">${card.arcana === "major" ? JD.toPersianDigits(card.number) : ""}</div>
        <div class="cf-glyph ${suitClass(card)}">${glyphFor(card)}</div>
        <div class="cf-name-fa">${card.name_fa}</div>
        <div class="cf-name-en">${card.name_en}</div>
      </div>
    `;

    // اگر تصویر واقعی کارت در assets/cards/ موجود باشد، جایگزین طرح CSS می‌شود؛
    // در غیر این صورت، طرح CSS اصلی همچنان نمایش داده می‌شود (بدون شکستن UI).
    tryRealImage(card, face);

    inner.appendChild(back);
    inner.appendChild(face);
    wrap.appendChild(inner);
    return wrap;
  }

  // ---------------- شیت تقویم شمسی ----------------

  function openJalaliDatePicker(onConfirm) {
    const today = JD.todayJalali();
    let state = { year: today.jy, month: today.jm, day: null };

    const overlay = document.createElement("div");
    overlay.className = "sheet-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const panel = document.createElement("div");
    panel.className = "sheet-panel";
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    function close() {
      overlay.remove();
    }
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    function render() {
      const daysInMonth = JD.daysInJalaliMonth(state.year, state.month);
      const monthOptions = JD.PERSIAN_MONTHS.map((m, i) =>
        `<option value="${i + 1}" ${i + 1 === state.month ? "selected" : ""}>${m}</option>`
      ).join("");

      const years = [];
      for (let y = today.jy - 90; y <= today.jy; y += 1) years.push(y);
      const yearOptions = years.reverse().map((y) =>
        `<option value="${y}" ${y === state.year ? "selected" : ""}>${JD.toPersianDigits(y)}</option>`
      ).join("");

      const firstWeekday = JD.weekdayOfJalali(state.year, state.month, 1);
      let dayCells = "";
      for (let i = 0; i < firstWeekday; i += 1) dayCells += `<div></div>`;
      for (let d = 1; d <= daysInMonth; d += 1) {
        const selected = state.day === d ? "selected" : "";
        dayCells += `<button type="button" class="cal-day ${selected}" data-day="${d}">${JD.toPersianDigits(d)}</button>`;
      }

      panel.innerHTML = `
        <div class="sheet-handle"></div>
        <h3 class="screen-title" style="font-size:17px;text-align:center;margin-bottom:14px;">تاریخ تولد</h3>
        <div style="display:flex;gap:8px;margin-bottom:14px;">
          <select id="cal-month" class="cal-select">${monthOptions}</select>
          <select id="cal-year" class="cal-select">${yearOptions}</select>
        </div>
        <div class="cal-weekdays">
          ${JD.WEEKDAYS_FA.map((w) => `<span>${w[0]}</span>`).join("")}
        </div>
        <div class="cal-grid">${dayCells}</div>
        <div class="cal-preview">${state.day ? JD.formatJalali(state.year, state.month, state.day) : "روزی را انتخاب کن"}</div>
        <button type="button" class="btn-primary" id="cal-confirm" ${state.day ? "" : "disabled"}>تأیید تاریخ</button>
        <button type="button" class="btn-ghost" id="cal-cancel" style="width:100%;text-align:center;margin-top:6px;">انصراف</button>
      `;

      panel.querySelector("#cal-month").addEventListener("change", (e) => {
        state.month = Number(e.target.value);
        const max = JD.daysInJalaliMonth(state.year, state.month);
        if (state.day && state.day > max) state.day = null;
        render();
      });
      panel.querySelector("#cal-year").addEventListener("change", (e) => {
        state.year = Number(e.target.value);
        const max = JD.daysInJalaliMonth(state.year, state.month);
        if (state.day && state.day > max) state.day = null;
        render();
      });
      panel.querySelectorAll(".cal-day").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.day = Number(btn.dataset.day);
          render();
        });
      });
      panel.querySelector("#cal-cancel").addEventListener("click", close);
      const confirmBtn = panel.querySelector("#cal-confirm");
      if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
          if (!state.day) return;
          if (!JD.isValidJalaliDate(state.year, state.month, state.day)) return;
          onConfirm({ year: state.year, month: state.month, day: state.day });
          close();
        });
      }
    }

    render();
  }

  // ---------------- اکاردئون ----------------

  function buildAccordionItem(title, bodyHtml) {
    const item = document.createElement("div");
    item.className = "accordion-item";
    item.innerHTML = `
      <button type="button" class="accordion-header">
        <span>${title}</span>
        <span class="chev">⌄</span>
      </button>
      <div class="accordion-body"><div style="padding:0 2px;">${bodyHtml}</div></div>
    `;
    const header = item.querySelector(".accordion-header");
    const body = item.querySelector(".accordion-body");
    header.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      body.style.maxHeight = isOpen ? body.scrollHeight + "px" : "0px";
    });
    return item;
  }

  global.UI = {
    glyphFor,
    buildCardElement,
    openJalaliDatePicker,
    buildAccordionItem
  };
})(window);
