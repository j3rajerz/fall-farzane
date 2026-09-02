/**
 * FAL FARZANEH — js/kabbalah.js
 * رندر تعاملی «درخت حیات فرزانه» و اجزای وابسته (شیت اطلاعات، منابع، گماتریا).
 * این ماژول مستقل است و فقط از KabbalahData و TarotEngine استفاده می‌کند.
 */

(function (global) {
  "use strict";

  const KD = global.KabbalahData;
  const TE = global.TarotEngine;

  const NS = "http://www.w3.org/2000/svg";

  function svgEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach((k) => el.setAttribute(k, attrs[k]));
    return el;
  }

  /**
   * لیستی از شمارهٔ مسیرهای شخصی کاربر (بر پایهٔ کارت‌های تولد/انرژی/روز)
   * personalCardIds: آرایه‌ای از cardId های آرکانای کبیر
   */
  function buildTreeSVG(options) {
    options = options || {};
    const personalCardIds = options.personalCardIds || [];
    const personalPaths = personalCardIds
      .map((id) => KD.pathForCardId(id))
      .filter(Boolean)
      .map((p) => p.path);

    const svg = svgEl("svg", {
      class: "tree-svg" + (options.animate ? " animate-in" : ""),
      viewBox: "0 0 340 520",
      xmlns: NS
    });

    const pathsGroup = svgEl("g", { class: "tree-paths" });
    const nodesGroup = svgEl("g", { class: "tree-nodes" });

    KD.PATHS.forEach((p) => {
      const from = KD.sefirahById(p.from);
      const to = KD.sefirahById(p.to);
      const isPersonal = personalPaths.includes(p.path);
      const line = svgEl("line", {
        x1: from.x, y1: from.y, x2: to.x, y2: to.y,
        class: "tree-path-line" + (isPersonal ? " tp-personal" : ""),
        "data-path": p.path
      });
      pathsGroup.appendChild(line);

      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const letter = KD.letterByName(p.letterName);
      const label = svgEl("text", { x: midX, y: midY, class: "tree-letter-label" });
      label.textContent = letter.letter;
      pathsGroup.appendChild(label);
    });

    KD.SEFIROT.forEach((s) => {
      const isPersonal = personalCardIds.length > 0 && KD.PATHS.some(
        (p) => personalPaths.includes(p.path) && (p.from === s.id || p.to === s.id)
      );
      const g = svgEl("g", { class: "tree-sefirah-g" + (isPersonal ? " ts-personal" : ""), "data-sefirah": s.id });
      const circle = svgEl("circle", { cx: s.x, cy: s.y, r: 26, class: "tree-sefirah-circle" });
      const label = svgEl("text", { x: s.x, y: s.y - 1, class: "tree-sefirah-label" });
      label.textContent = s.fa;
      const sub = svgEl("text", { x: s.x, y: s.y + 11, class: "tree-sefirah-sub" });
      sub.textContent = s.fa_meaning;
      g.appendChild(circle);
      g.appendChild(label);
      g.appendChild(sub);
      nodesGroup.appendChild(g);
    });

    svg.appendChild(pathsGroup);
    svg.appendChild(nodesGroup);
    return svg;
  }

  // ---------------- شیت اطلاعات مسیر/سفیروت ----------------

  function openInfoSheet(titleHtml, bodyHtml) {
    const overlay = document.createElement("div");
    overlay.className = "sheet-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    const panel = document.createElement("div");
    panel.className = "sheet-panel";
    panel.innerHTML = `
      <div class="sheet-handle"></div>
      ${titleHtml}
      <div style="margin-top:10px;">${bodyHtml}</div>
      <button type="button" class="btn-ghost" id="qab-sheet-close" style="width:100%;text-align:center;margin-top:14px;">بستن</button>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    function close() { overlay.remove(); }
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    panel.querySelector("#qab-sheet-close").addEventListener("click", close);
    return close;
  }

  function pathSheetBody(path) {
    const letter = KD.letterByName(path.letterName);
    const from = KD.sefirahById(path.from);
    const to = KD.sefirahById(path.to);
    const card = TE.getCardById(path.cardId);
    return `
      <div style="text-align:center;margin-bottom:10px;">
        <div class="qab-hebrew">${letter.letter}</div>
        <div style="font-size:13px;color:var(--text-muted);">${letter.name} — ${letter.fa}</div>
      </div>
      <div class="qab-grid">
        <div class="qab-row"><b>مسیر</b><span>${path.path} (${from.fa} ← ${to.fa})</span></div>
        <div class="qab-row"><b>کارت آرکانای کبیر</b><span>${card ? card.name_fa : "—"}</span></div>
        <div class="qab-row"><b>سفیروت مبدأ</b><span>${from.fa} — ${from.fa_meaning}</span></div>
        <div class="qab-row"><b>سفیروت مقصد</b><span>${to.fa} — ${to.fa_meaning}</span></div>
        <div class="qab-row"><b>تطبیق هرمتیک</b><span>${path.assoc}</span></div>
      </div>
      <div class="qab-source-tag">منبع این تطبیق: ${KD.TRADITION_LABEL}</div>
    `;
  }

  function sefirahSheetBody(sefirah) {
    const relatedPaths = KD.PATHS.filter((p) => p.from === sefirah.id || p.to === sefirah.id);
    return `
      <div style="text-align:center;margin-bottom:10px;">
        <div class="qab-hebrew">${sefirah.heb}</div>
        <div style="font-size:13px;color:var(--text-muted);">${sefirah.en} — ${sefirah.fa}</div>
      </div>
      <div class="qab-grid">
        <div class="qab-row"><b>معنای نمادین</b><span>${sefirah.fa_meaning}</span></div>
        <div class="qab-row"><b>ستون</b><span>${KD.PILLARS[sefirah.pillar].fa}</span></div>
        <div class="qab-row"><b>تعداد مسیرهای متصل</b><span>${relatedPaths.length}</span></div>
      </div>
      <div class="qab-source-tag">منبع: سنت قبالای یهودی (Sefer Yetzirah) و بازخوانی نمادین قبالای هرمتیک</div>
    `;
  }

  function attachTreeInteractivity(svg) {
    svg.querySelectorAll(".tree-path-line").forEach((line) => {
      line.addEventListener("click", () => {
        const pathNum = Number(line.dataset.path);
        const path = KD.pathByNumber(pathNum);
        if (!path) return;
        const letter = KD.letterByName(path.letterName);
        openInfoSheet(
          `<h3 class="screen-title" style="font-size:16px;text-align:center;">مسیر ${pathNum} — ${letter.fa}</h3>`,
          pathSheetBody(path)
        );
      });
    });
    svg.querySelectorAll(".tree-sefirah-g").forEach((g) => {
      g.addEventListener("click", () => {
        const s = KD.sefirahById(g.dataset.sefirah);
        if (!s) return;
        openInfoSheet(
          `<h3 class="screen-title" style="font-size:16px;text-align:center;">${s.fa} — سفیروت</h3>`,
          sefirahSheetBody(s)
        );
      });
    });
  }

  // ---------------- لایهٔ قبالایی برای صفحهٔ جزئیات کارت ----------------

  function cardQabalahHtml(cardId) {
    const info = KD.qabalisticInfoForCard(cardId);
    if (!info) return null;
    return `
      <div style="text-align:center;margin-bottom:10px;">
        <div class="qab-hebrew">${info.hebrewLetter}</div>
        <div style="font-size:12.5px;color:var(--text-muted);">${info.hebrewName} — ${info.hebrewNameFa} <span style="opacity:.7;">(${info.letterCategory})</span></div>
      </div>
      <div class="qab-grid">
        <div class="qab-row"><b>مسیر درخت حیات</b><span>مسیر ${info.pathNumber}</span></div>
        <div class="qab-row"><b>سفیروت مبدأ</b><span>${info.fromSephirah.fa} — ${info.fromSephirah.fa_meaning}</span></div>
        <div class="qab-row"><b>سفیروت مقصد</b><span>${info.toSephirah.fa} — ${info.toSephirah.fa_meaning}</span></div>
        <div class="qab-row"><b>تطبیق هرمتیک</b><span>${info.association}</span></div>
      </div>
      <button class="btn-secondary qab-open-tree" id="qab-view-tree" data-path="${info.pathNumber}" style="width:100%;">مشاهده در درخت حیات</button>
      <div class="qab-source-tag">منبع این تطبیق: ${info.tradition}</div>
    `;
  }

  // ---------------- گماتریا ----------------

  function renderGematria(container, hebrewWord) {
    const result = KD.gematriaOf(hebrewWord);
    container.innerHTML = `
      <div class="gematria-box">
        ${result.breakdown.map((b) => `<div class="gematria-chip"><div class="gc-letter">${b.letter}</div><div class="gc-value">${b.value}</div></div>`).join("")}
      </div>
      <div class="gematria-total">مجموع: ${result.total}</div>
      <div class="qab-source-tag" style="text-align:center;">روش محاسبه: ${result.method}</div>
    `;
  }

  global.Kabbalah = {
    buildTreeSVG,
    attachTreeInteractivity,
    openInfoSheet,
    pathSheetBody,
    sefirahSheetBody,
    cardQabalahHtml,
    renderGematria
  };
})(window);
