# 名古屋家庭旅遊行程指南 Web App - 實施計畫

## 專案目標
建立一個響應式網頁應用程式，讓家人在日本名古屋旅行期間（2026.02.20-02.24）可以即時查看行程進度、接收提醒、並透過互動地圖瀏覽景點。

---

## User Review Required

> [!IMPORTANT]
> **關於 Google Docs 匯入**
> 
> 很抱歉，我無法直接連接到您的 Google Drive 存取文件。請您選擇以下方式提供行程資料：
> 
> 1. **複製貼上**：將 Google Docs 的內容直接貼到對話中
> 2. **下載後上傳**：將文件下載為 `.docx` 或 `.txt` 後，提供給我
> 3. **手動輸入**：告訴我每天的行程細節，我來整理

> [!NOTE]
> **目前計畫先建立應用程式框架**
> 
> 我會先用範例資料建立完整的應用程式，待您提供實際行程後再替換內容。

---

## 技術方案

| 項目 | 選擇 | 說明 |
|------|------|------|
| **框架** | 原生 HTML + CSS + JavaScript | 簡單、無需編譯、易於部署 |
| **地圖** | Leaflet.js + OpenStreetMap | 免費、支援離線 |
| **通知** | Web Notifications API | 瀏覽器原生提醒功能 |
| **離線** | Service Worker (PWA) | 支援離線瀏覽 |
| **樣式** | CSS Variables + Flexbox/Grid | 現代響應式設計 |

---

## Proposed Changes

### 專案結構

```
D:\AntiWorkspace\nagoya-trip\
├── index.html          # 主頁面
├── css/
│   └── style.css       # 樣式表
├── js/
│   ├── app.js          # 主程式邏輯
│   ├── schedule.js     # 行程資料與進度
│   ├── map.js          # 地圖功能
│   └── notifications.js # 提醒功能
├── data/
│   └── itinerary.json  # 行程資料 (JSON 格式)
├── assets/
│   └── icons/          # 圖示素材
├── manifest.json       # PWA 設定
└── sw.js               # Service Worker (離線支援)
```

---

### 核心功能

#### [NEW] [index.html](file:///D:/AntiWorkspace/nagoya-trip/index.html)
- 主頁面結構
- 導航列（日期選擇）
- 行程時間軸容器
- 地圖容器
- 進度條顯示

#### [NEW] [style.css](file:///D:/AntiWorkspace/nagoya-trip/css/style.css)
- **Brutalist UI 野獸派風格**
  - 背景色：奶油/米色 `#F5F0E8`
  - 主文字：純黑 `#000000`
  - 強調色：橘紅 `#FF4500`
  - 卡片：粗黑邊框 (2-3px solid black)
- 字體：Archivo Black / Inter（粗體無襯線）
- 響應式斷點（手機 / 平板 / 桌面）
- 時間軸樣式（粗線條、高對比）
- 卡片式行程項目（懸浮陰影效果）

#### [NEW] [app.js](file:///D:/AntiWorkspace/nagoya-trip/js/app.js)
- 應用程式初始化
- 日期切換邏輯
- 即時時間更新
- 當前行程高亮

#### [NEW] [schedule.js](file:///D:/AntiWorkspace/nagoya-trip/js/schedule.js)
- 行程進度計算
- 時間軸渲染
- 當前/已完成/即將進行狀態

#### [NEW] [map.js](file:///D:/AntiWorkspace/nagoya-trip/js/map.js)
- Leaflet 地圖初始化
- 景點大頭針標記
- 點擊顯示景點資訊
- 路線連接

#### [NEW] [notifications.js](file:///D:/AntiWorkspace/nagoya-trip/js/notifications.js)
- 瀏覽器通知權限請求
- 行程開始前 15 分鐘提醒
- 通知開關設定

#### [NEW] [itinerary.json](file:///D:/AntiWorkspace/nagoya-trip/data/itinerary.json)
- JSON 格式的行程資料
- 包含時間、地點、描述、座標

---

## UI 設計預覽

### 設計參考
![用戶提供的設計參考](C:/Users/Ryan/.gemini/antigravity/brain/013763a4-5871-4677-b97c-3f47328e7dea/uploaded_media_1769533805244.png)

### 應用程式介面草圖

```
┌─────────────────────────────────────────────┐
│ ▓▓ NAGOYA TRIP 2026      [🔔] [GET STARTED] │  ← 橘紅按鈕
│─────────────────────────────────────────────│
│  DAY 1 │ DAY 2 │ DAY 3 │ DAY 4 │ DAY 5     │  ← 粗體導航
├─────────────────────────────────────────────┤
│                                             │
│  CURRENT PROGRESS                           │  ← 粗體標題
│  ████████████░░░░░░░░░░░░░░ 45%            │
│                                             │
├─────────────────────────────────────────────┤
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  14:00 - 16:00                         ┃ │  ← 粗邊框卡片
│ ┃  ▓▓ 名古屋城 NAGOYA CASTLE            ┃ │
│ ┃  探索日本三大名城之一                   ┃ │
│ ┃  [📍 MAP]  [⏰ REMIND]                 ┃ │  ← 橘紅按鈕
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                             │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  16:30 - 18:00  (COMING UP)            ┃ │
│ ┃  🛒 大須商店街 OSU SHOPPING            ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                             │
├─────────────────────────────────────────────┤
│  🗺️ INTERACTIVE MAP                        │
│  ┌─────────────────────────────────────┐   │
│  │         [地圖區域]                   │   │
│  │    📍──────📍──────📍               │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

配色: 米色背景 #F5F0E8 | 黑色文字 | 橘紅強調 #FF4500
```

---

## Verification Plan

### Automated Tests

#### 瀏覽器測試
1. **首頁載入測試**
   ```
   開啟 http://localhost:8000
   確認頁面正確顯示所有元素
   ```

2. **響應式設計測試**
   ```
   調整瀏覽器視窗至手機尺寸 (375px)
   確認介面正確適應
   ```

3. **地圖功能測試**
   ```
   點擊景點大頭針
   確認彈出資訊視窗
   ```

### Manual Verification

由使用者執行以下測試：
1. 在手機瀏覽器開啟網頁，確認顯示正常
2. 測試日期切換功能
3. 測試地圖縮放與大頭針互動
4. 測試通知提醒功能（需允許瀏覽器通知）

---

## 開發時程

| 階段 | 內容 | 預估時間 |
|------|------|----------|
| Phase 1 | 基礎框架 + UI 樣式 | 15 分鐘 |
| Phase 2 | 行程時間軸 + 進度顯示 | 15 分鐘 |
| Phase 3 | 互動式地圖 | 15 分鐘 |
| Phase 4 | 通知功能 + PWA | 15 分鐘 |
| Phase 5 | 整合實際行程資料 | 待提供資料 |

---

## 下一步行動

請確認：
1. ✅ 您同意以上實施計畫
2. 📄 請提供您的 Google Docs 行程內容（複製貼上即可）

待您確認後，我將開始建立應用程式！
