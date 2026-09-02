# FAL FARZANEH — scripts/download-cards.ps1
#
# نسخهٔ ویندوزی اسکریپت دانلود تصاویر کارت‌ها از ویکی‌مدیا کامنز.
#
# اجرا (در PowerShell، داخل پوشهٔ پروژه):
#   powershell -ExecutionPolicy Bypass -File .\scripts\download-cards.ps1

$ErrorActionPreference = "SilentlyContinue"
$OutDir = Join-Path $PSScriptRoot "..\assets\cards"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$Base = "https://commons.wikimedia.org/wiki/Special:FilePath"
$OkCount = 0
$FailList = @()

function Download-Card($WikiFile, $TargetId) {
    $url = "$Base/$WikiFile"
    $out = Join-Path $OutDir "$TargetId.jpg"
    Write-Host "در حال دانلود: $TargetId  <-  $WikiFile"
    try {
        Invoke-WebRequest -Uri $url -OutFile $out -ErrorAction Stop
        $script:OkCount++
    } catch {
        Write-Host "  ناموفق: $WikiFile" -ForegroundColor Yellow
        $script:FailList += "$TargetId ($WikiFile)"
        if (Test-Path $out) { Remove-Item $out }
    }
}

Write-Host "=== آرکانای کبیر ==="
Download-Card "RWS_Tarot_00_Fool.jpg" "major-00"
Download-Card "RWS_Tarot_01_Magician.jpg" "major-01"
Download-Card "RWS_Tarot_02_High_Priestess.jpg" "major-02"
Download-Card "RWS_Tarot_03_Empress.jpg" "major-03"
Download-Card "RWS_Tarot_04_Emperor.jpg" "major-04"
Download-Card "RWS_Tarot_05_Hierophant.jpg" "major-05"
Download-Card "RWS_Tarot_06_Lovers.jpg" "major-06"
Download-Card "RWS_Tarot_07_Chariot.jpg" "major-07"
Download-Card "RWS_Tarot_08_Strength.jpg" "major-08"
Download-Card "RWS_Tarot_09_Hermit.jpg" "major-09"
Download-Card "RWS_Tarot_10_Wheel_of_Fortune.jpg" "major-10"
Download-Card "RWS_Tarot_11_Justice.jpg" "major-11"
Download-Card "RWS_Tarot_12_Hanged_Man.jpg" "major-12"
Download-Card "RWS_Tarot_13_Death.jpg" "major-13"
Download-Card "RWS_Tarot_14_Temperance.jpg" "major-14"
Download-Card "RWS_Tarot_15_Devil.jpg" "major-15"
Download-Card "RWS_Tarot_16_Tower.jpg" "major-16"
Download-Card "RWS_Tarot_17_Star.jpg" "major-17"
Download-Card "RWS_Tarot_18_Moon.jpg" "major-18"
Download-Card "RWS_Tarot_19_Sun.jpg" "major-19"
Download-Card "RWS_Tarot_20_Judgement.jpg" "major-20"
Download-Card "RWS_Tarot_21_World.jpg" "major-21"

Write-Host "=== چوبدست‌ها ==="
$wandsRanks = @("ace","2","3","4","5","6","7","8","9","10","page","knight","queen","king")
for ($i = 0; $i -lt 14; $i++) {
    $num = "{0:D2}" -f ($i + 1)
    Download-Card "Wands$num.jpg" "wands-$($wandsRanks[$i])"
}

Write-Host "=== جام‌ها ==="
for ($i = 0; $i -lt 14; $i++) {
    $num = "{0:D2}" -f ($i + 1)
    Download-Card "Cups$num.jpg" "cups-$($wandsRanks[$i])"
}

Write-Host "=== شمشیرها ==="
for ($i = 0; $i -lt 14; $i++) {
    $num = "{0:D2}" -f ($i + 1)
    Download-Card "Swords$num.jpg" "swords-$($wandsRanks[$i])"
}

Write-Host "=== سکه‌ها ==="
for ($i = 0; $i -lt 14; $i++) {
    $num = "{0:D2}" -f ($i + 1)
    Download-Card "Pents$num.jpg" "pentacles-$($wandsRanks[$i])"
}

Write-Host ""
Write-Host "=================================================="
Write-Host "نتیجه: $OkCount از 78 تصویر با موفقیت دانلود شد."
if ($FailList.Count -gt 0) {
    Write-Host ""
    Write-Host "این موارد دانلود نشدند — به‌صورت دستی از صفحهٔ زیر بررسی کن:"
    Write-Host "https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck"
    $FailList | ForEach-Object { Write-Host "  - $_" }
}
Write-Host "=================================================="
