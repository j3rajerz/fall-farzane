/**
 * FAL FARZANEH — js/tarot-engine.js
 * ENGINE A — موتور تاروت
 *
 * مسئول: ۷۸ کارت، معانی، متادیتا و منطق سنتی تاروت.
 * این فایل هیچ وابستگی‌ای به تاریخ تولد یا موتور شخصی‌سازی ندارد.
 */

(function (global) {
  "use strict";

  const DECK = global.FAL_FARZANEH_CARDS;
  const SUITS = global.FAL_FARZANEH_SUITS;

  function getAllCards() {
    return DECK.slice();
  }

  function getCardById(id) {
    return DECK.find((c) => c.id === id) || null;
  }

  function getMajorArcana() {
    return DECK.filter((c) => c.arcana === "major");
  }

  function getSuit(suitKey) {
    return DECK.filter((c) => c.suit === suitKey);
  }

  function searchCards(query) {
    if (!query) return getAllCards();
    const q = query.trim().toLowerCase();
    return DECK.filter((c) =>
      c.name_fa.toLowerCase().includes(q) ||
      c.name_en.toLowerCase().includes(q)
    );
  }

  function filterCards(filterKey) {
    if (!filterKey || filterKey === "all") return getAllCards();
    if (filterKey === "major") return getMajorArcana();
    return getSuit(filterKey);
  }

  /**
   * برگرداندن متن تفسیری یک کارت بر اساس جهت (مستقیم/معکوس) و دسته (عمومی، عشق، کار، مالی، معنوی)
   */
  function getCardMeaning(card, orientation, category) {
    const bucket = orientation === "reversed" ? card.reversed : card.upright;
    const cat = category || "general";
    return bucket[cat] || bucket.general;
  }

  function getCardKeywords(card, orientation) {
    return orientation === "reversed" ? card.keywords_reversed : card.keywords_upright;
  }

  function totalCardCount() {
    return DECK.length;
  }

  global.TarotEngine = {
    getAllCards,
    getCardById,
    getMajorArcana,
    getSuit,
    getSuits: () => SUITS.slice(),
    searchCards,
    filterCards,
    getCardMeaning,
    getCardKeywords,
    totalCardCount
  };
})(window);
