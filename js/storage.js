/**
 * FAL FARZANEH — js/storage.js
 *
 * تمام داده‌ها فقط به‌صورت محلی (localStorage) ذخیره می‌شوند.
 * هیچ داده‌ای به هیچ سروری ارسال نمی‌شود. (بخش ۴۴ و ۴۵ سند)
 */

(function (global) {
  "use strict";

  const KEYS = {
    profile: "falfarzaneh:profile:v1",
    people: "falfarzaneh:people:v1",
    history: "falfarzaneh:history:v1",
    settings: "falfarzaneh:settings:v1"
  };

  function isStorageAvailable() {
    try {
      const testKey = "__falfarzaneh_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  const AVAILABLE = isStorageAvailable();
  // حافظهٔ موقت برای زمانی که localStorage در دسترس نیست (بخش ۵۷)
  const memoryFallback = {};

  function safeGet(key) {
    try {
      if (!AVAILABLE) return memoryFallback[key] || null;
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      if (!AVAILABLE) { memoryFallback[key] = value; return true; }
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      if (!AVAILABLE) { delete memoryFallback[key]; return; }
      window.localStorage.removeItem(key);
    } catch (e) { /* نادیده گرفتن خطا */ }
  }

  function parseJsonSafe(str, fallback) {
    if (!str) return fallback;
    try {
      const parsed = JSON.parse(str);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (e) {
      // دادهٔ خراب — بازگرداندن مقدار پیش‌فرض به‌جای کرش کردن (بخش ۵۷)
      console.warn("دادهٔ ذخیره‌شده خراب بود و نادیده گرفته شد:", str);
      return fallback;
    }
  }

  // ---------------- پروفایل ----------------

  function getProfile() {
    return parseJsonSafe(safeGet(KEYS.profile), null);
  }

  function saveProfile(profile) {
    return safeSet(KEYS.profile, JSON.stringify(profile));
  }

  function clearProfile() {
    safeRemove(KEYS.profile);
  }

  // ---------------- افراد دیگر (بخش فال گرفتن برای دیگران) ----------------
  // این لیست، پروفایل‌های موقتِ اشخاص دیگر (غیر از خودِ کاربر) را نگه می‌دارد
  // تا کاربر بتواند بدون پاک‌کردن تاریخ تولد خودش، برای چند نفر فال بگیرد.

  function getPeople() {
    const list = parseJsonSafe(safeGet(KEYS.people), []);
    return Array.isArray(list) ? list : [];
  }

  function savePerson(person) {
    const list = getPeople();
    const idx = list.findIndex((p) => p.id === person.id);
    if (idx >= 0) { list[idx] = person; } else { list.unshift(person); }
    // محدودکردن تعداد افراد ذخیره‌شده برای جلوگیری از شلوغی/پرشدن حافظه
    const trimmed = list.slice(0, 30);
    safeSet(KEYS.people, JSON.stringify(trimmed));
    return trimmed;
  }

  function removePerson(id) {
    const list = getPeople().filter((p) => p.id !== id);
    safeSet(KEYS.people, JSON.stringify(list));
    return list;
  }

  // ---------------- تاریخچه ----------------

  function getHistory() {
    const list = parseJsonSafe(safeGet(KEYS.history), []);
    return Array.isArray(list) ? list : [];
  }

  function addHistoryEntry(entry) {
    const list = getHistory();
    list.unshift(entry);
    // محدودکردن اندازهٔ تاریخچه برای عملکرد بهتر
    const trimmed = list.slice(0, 200);
    safeSet(KEYS.history, JSON.stringify(trimmed));
    return trimmed;
  }

  function removeHistoryEntry(id) {
    const list = getHistory().filter((e) => e.id !== id);
    safeSet(KEYS.history, JSON.stringify(list));
    return list;
  }

  function clearHistory() {
    safeSet(KEYS.history, JSON.stringify([]));
  }

  // ---------------- تنظیمات ----------------

  function getSettings() {
    return parseJsonSafe(safeGet(KEYS.settings), { reducedMotion: false, skipIntro: false });
  }

  function saveSettings(settings) {
    return safeSet(KEYS.settings, JSON.stringify(settings));
  }

  global.Storage = {
    isAvailable: AVAILABLE,
    getProfile,
    saveProfile,
    clearProfile,
    getPeople,
    savePerson,
    removePerson,
    getHistory,
    addHistoryEntry,
    removeHistoryEntry,
    clearHistory,
    getSettings,
    saveSettings
  };
})(window);
