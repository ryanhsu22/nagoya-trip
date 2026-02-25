# 名古屋家庭旅遊行程指南 Web App - 開發完成報告

## 專案完成摘要

成功建立了一個 **Brutalist UI 風格**的互動式旅遊行程指南 Web App，專為您的 2026 年 2 月名古屋家庭旅行設計。

---

## 專案位置

📁 **D:\AntiWorkspace\nagoya-trip**

---

## 檔案結構

```
nagoya-trip/
├── index.html          # 主頁面
├── manifest.json       # PWA 設定（支援安裝到手機桌面）
├── css/
│   └── style.css       # Brutalist UI 樣式（600+ 行）
├── js/
│   ├── app.js          # 主應用程式邏輯
│   ├── schedule.js     # 行程進度管理
│   ├── map.js          # Leaflet 互動地圖
│   └── notifications.js # 瀏覽器通知提醒
├── data/
│   └── itinerary.json  # 完整 5 天行程資料
└── assets/
    └── icons/          # 應用程式圖示（待新增）
```

---

## 已實作功能

### ✅ 核心功能

| 功能 | 說明 |
|------|------|
| **日期切換導航** | 5 天行程 Tab 切換，自動標記今天 |
| **倒數計時區塊** | 旅程開始前顯示「距離出發還有 X 天」|
| **台灣/日本時間** | 同時顯示兩地時間，每秒更新 |
| **行程進度條** | 旅程開始後顯示，以天為單位 (20% × 5 天) |
| **Day 指示器** | D1-D5 顯示各天完成狀態 |
| **行程時間軸** | 卡片式顯示每個行程，含時間、圖示、描述 |
| **當前行程高亮** | 自動標記目前進行中的活動 (NOW) |
| **互動式地圖** | Leaflet + OpenStreetMap，點擊大頭針顯示資訊 |
| **行程提醒** | 瀏覽器通知，提前 15 分鐘提醒 |
| **航班資訊卡** | Day 1 / Day 5 顯示航班詳情 |
| **測試模式** | 可切換倒數/進度顯示來驗證功能 |

### ✅ 設計特色

- **Brutalist UI 風格**：米色背景、粗黑邊框、橘紅強調色
- **Space Mono 字體**：日期副標題使用等寬字體，更有設計感
- **響應式設計**：手機、平板、桌面皆可使用
- **PWA 支援**：可加入手機桌面（需透過 HTTPS 或 localhost）

---

## 如何執行

### 方法一：直接開啟檔案（最簡單 ✅）

1. 開啟 **檔案總管**
2. 前往 `D:\AntiWorkspace\nagoya-trip`
3. 雙擊 `index.html`

> ✅ **已修復 CORS 問題**：行程資料已直接嵌入 JavaScript 中，可直接開啟使用！

### 方法二：使用本機伺服器（推薦）

如果您有安裝 Node.js：
```powershell
cd D:\AntiWorkspace\nagoya-trip
npx -y http-server -p 8080
```
然後開啟瀏覽器前往：`http://localhost:8080`

如果您有安裝 Python：
```powershell
cd D:\AntiWorkspace\nagoya-trip
python -m http.server 8080
```

### 方法三：使用 VS Code Live Server

1. 用 VS Code 開啟 `D:\AntiWorkspace\nagoya-trip` 資料夾
2. 安裝 **Live Server** 擴充功能
3. 右鍵點擊 `index.html` → **Open with Live Server**

---

## 手動測試檢查清單

請在瀏覽器中測試以下功能：

- [ ] 頁面載入後顯示倒數計時區塊
- [ ] 台灣/日本時間正確顯示且每秒更新
- [ ] 點擊測試模式按鈕可切換至進度條
- [ ] 進度條顯示 Day 3 進行中 (60%)
- [ ] D1-D2 指示器顯示已完成，D3 顯示進行中
- [ ] 點擊 DAY 2、DAY 3 等標籤可切換日期
- [ ] 點擊 MAP 按鈕可開啟地圖
- [ ] 地圖上有景點大頭針標記
- [ ] 點擊行程卡片的 MAP 按鈕可聚焦到該景點
- [ ] 點擊 REMIND 按鈕可設定提醒（需允許通知權限）
- [ ] Day 1 和 Day 5 右下角顯示航班資訊卡
- [ ] 調整視窗大小，介面正確響應

---

## 後續可優化項目

1. **新增 PWA 圖示**：製作 192x192 和 512x512 的應用程式圖示
2. **Service Worker**：實作離線快取功能
3. **多語言支援**：新增日文/英文版本
4. **天氣整合**：串接天氣 API 顯示即時天氣
5. **分享功能**：讓家人可透過連結查看同一份行程

---

## 技術規格

| 項目 | 技術 |
|------|------|
| 前端框架 | 原生 HTML/CSS/JavaScript |
| 地圖 | Leaflet.js + OpenStreetMap |
| 字體 | Archivo Black, Inter, Noto Sans TC, **Space Mono** |
| 通知 | Web Notifications API |
| PWA | Web App Manifest |

---

## 更新紀錄

| 日期 | 更新內容 |
|------|----------|
| 2026-01-27 | 初版完成 |
| 2026-01-28 | 修復 CORS 問題（嵌入 JSON 資料） |
| 2026-01-31 | UI 優化（字體加大、倒數/進度切換、台灣/日本時間） |

---

**祝您名古屋之旅愉快！** 🇯🇵✈️🏯
