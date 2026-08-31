#!/usr/bin/env bash
#
# FAL FARZANEH — scripts/download-cards.sh
#
# دانلود خودکار ۷۸ تصویر دستهٔ رایدر–ویت–اسمیت (چاپ ۱۹۰۹، مالکیت عمومی) از
# ویکی‌مدیا کامنز و ذخیرهٔ آن‌ها با نام دقیق مورد نیاز پروژه در assets/cards/.
#
# اجرا:
#   bash scripts/download-cards.sh
#
# نیازمندی: دستور curl (روی مک/لینوکس معمولاً از قبل نصب است؛ روی ویندوز از
# اسکریپت PowerShell معادل، download-cards.ps1، استفاده کنید یا Git Bash نصب کنید).
#
# منبع تصاویر: https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck_(Roses_%26_Lilies)
# مجوز: Public Domain Mark 1.0 (نویسنده: پاملا کولمن اسمیت، درگذشته ۱۹۵۱ — بیش از ۷۰ سال پیش)

set -uo pipefail

OUT_DIR="$(dirname "$0")/../assets/cards"
mkdir -p "$OUT_DIR"

BASE="https://commons.wikimedia.org/wiki/Special:FilePath"

FAIL_LIST=()
OK_COUNT=0

download() {
  local wiki_filename="$1"
  local target_id="$2"
  local url="${BASE}/${wiki_filename}"
  local out="${OUT_DIR}/${target_id}.jpg"

  echo "در حال دانلود: ${target_id}  <-  ${wiki_filename}"
  if curl -sfL --retry 3 --retry-delay 2 -o "$out" "$url"; then
    OK_COUNT=$((OK_COUNT + 1))
  else
    echo "  ⚠️  ناموفق: ${wiki_filename}"
    FAIL_LIST+=("$target_id ($wiki_filename)")
    rm -f "$out"
  fi
}

echo "=== آرکانای کبیر (۲۲ کارت) ==="
download "RWS_Tarot_00_Fool.jpg"          "major-00"
download "RWS_Tarot_01_Magician.jpg"      "major-01"
download "RWS_Tarot_02_High_Priestess.jpg" "major-02"
download "RWS_Tarot_03_Empress.jpg"       "major-03"
download "RWS_Tarot_04_Emperor.jpg"       "major-04"
download "RWS_Tarot_05_Hierophant.jpg"    "major-05"
download "RWS_Tarot_06_Lovers.jpg"        "major-06"
download "RWS_Tarot_07_Chariot.jpg"       "major-07"
download "RWS_Tarot_08_Strength.jpg"      "major-08"
download "RWS_Tarot_09_Hermit.jpg"        "major-09"
download "RWS_Tarot_10_Wheel_of_Fortune.jpg" "major-10"
download "RWS_Tarot_11_Justice.jpg"       "major-11"
download "RWS_Tarot_12_Hanged_Man.jpg"    "major-12"
download "RWS_Tarot_13_Death.jpg"         "major-13"
download "RWS_Tarot_14_Temperance.jpg"    "major-14"
download "RWS_Tarot_15_Devil.jpg"         "major-15"
download "RWS_Tarot_16_Tower.jpg"         "major-16"
download "RWS_Tarot_17_Star.jpg"          "major-17"
download "RWS_Tarot_18_Moon.jpg"          "major-18"
download "RWS_Tarot_19_Sun.jpg"           "major-19"
download "RWS_Tarot_20_Judgement.jpg"     "major-20"
download "RWS_Tarot_21_World.jpg"         "major-21"

echo "=== چوبدست‌ها (Wands) ==="
download "Wands01.jpg" "wands-ace"
download "Wands02.jpg" "wands-2"
download "Wands03.jpg" "wands-3"
download "Wands04.jpg" "wands-4"
download "Wands05.jpg" "wands-5"
download "Wands06.jpg" "wands-6"
download "Wands07.jpg" "wands-7"
download "Wands08.jpg" "wands-8"
download "Wands09.jpg" "wands-9"
download "Wands10.jpg" "wands-10"
download "Wands11.jpg" "wands-page"
download "Wands12.jpg" "wands-knight"
download "Wands13.jpg" "wands-queen"
download "Wands14.jpg" "wands-king"

echo "=== جام‌ها (Cups) ==="
download "Cups01.jpg" "cups-ace"
download "Cups02.jpg" "cups-2"
download "Cups03.jpg" "cups-3"
download "Cups04.jpg" "cups-4"
download "Cups05.jpg" "cups-5"
download "Cups06.jpg" "cups-6"
download "Cups07.jpg" "cups-7"
download "Cups08.jpg" "cups-8"
download "Cups09.jpg" "cups-9"
download "Cups10.jpg" "cups-10"
download "Cups11.jpg" "cups-page"
download "Cups12.jpg" "cups-knight"
download "Cups13.jpg" "cups-queen"
download "Cups14.jpg" "cups-king"

echo "=== شمشیرها (Swords) ==="
download "Swords01.jpg" "swords-ace"
download "Swords02.jpg" "swords-2"
download "Swords03.jpg" "swords-3"
download "Swords04.jpg" "swords-4"
download "Swords05.jpg" "swords-5"
download "Swords06.jpg" "swords-6"
download "Swords07.jpg" "swords-7"
download "Swords08.jpg" "swords-8"
download "Swords09.jpg" "swords-9"
download "Swords10.jpg" "swords-10"
download "Swords11.jpg" "swords-page"
download "Swords12.jpg" "swords-knight"
download "Swords13.jpg" "swords-queen"
download "Swords14.jpg" "swords-king"

echo "=== سکه‌ها (Pentacles) ==="
download "Pents01.jpg" "pentacles-ace"
download "Pents02.jpg" "pentacles-2"
download "Pents03.jpg" "pentacles-3"
download "Pents04.jpg" "pentacles-4"
download "Pents05.jpg" "pentacles-5"
download "Pents06.jpg" "pentacles-6"
download "Pents07.jpg" "pentacles-7"
download "Pents08.jpg" "pentacles-8"
download "Pents09.jpg" "pentacles-9"
download "Pents10.jpg" "pentacles-10"
download "Pents11.jpg" "pentacles-page"
download "Pents12.jpg" "pentacles-knight"
download "Pents13.jpg" "pentacles-queen"
download "Pents14.jpg" "pentacles-king"

echo ""
echo "=================================================="
echo "نتیجه: ${OK_COUNT} از ۷۸ تصویر با موفقیت دانلود شد."
if [ ${#FAIL_LIST[@]} -gt 0 ]; then
  echo ""
  echo "این موارد دانلود نشدند (احتمالاً نام فایل در ویکی‌مدیا کمی فرق دارد؛"
  echo "برای هرکدام صفحهٔ زیر را باز کن، نام دقیق فایل را ببین و به‌صورت دستی دانلود کن):"
  echo "https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck"
  for item in "${FAIL_LIST[@]}"; do
    echo "  - $item"
  done
fi
echo "=================================================="
