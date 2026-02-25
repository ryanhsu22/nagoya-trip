# Visual Design System Overhaul

基於參考範例 (ThePod) 的設計分析與實作計畫。

---

## 參考設計分析

![Reference](file:///C:/Users/Ryan/.gemini/antigravity/brain/4b06d38c-5d70-4083-9f29-309306c155ae/uploaded_media_1770441837476.png)

| 特徵 | 分析 |
|------|------|
| **字體** | 大標題用 Serif 斜體、內文用清爽 Sans-serif |
| **層次** | Display 極大、副標題小、對比鮮明 |
| **色彩** | 暖色漸層背景、深藍導航列、黃/青點綴 |
| **留白** | 大量空間、不擁擠 |
| **卡片** | 圓角、白底、簡潔 icon |

---

## 1. Typography 字體

### 新字體搭配

| 用途 | 字體 | 說明 |
|------|------|------|
| **Display** | Playfair Display (Italic) | 優雅 Serif，強調標題 |
| **Heading** | Inter | 現代 Sans-serif |
| **Body** | Noto Sans TC | 中文內文 |
| **Mono** | JetBrains Mono | 時間/數字 |

### Type Scale (1.5 比例)

| 層級 | Size | 用途 |
|------|------|------|
| Display | 3.5rem | 主標/倒數 |
| H1 | 2rem | 頁面標題 |
| H2 | 1.25rem | 卡片標題 |
| Body | 1rem | 內文 |
| Caption | 0.8rem | 輔助文字 |

---

## 2. Color Palette

| Token | Color | 用途 |
|-------|-------|------|
| `--bg-warm` | #FDF8F3 | 主背景 |
| `--bg-gradient` | cream → lavender | 漸層 |
| `--accent-gold` | #E9A23B | 強調色 |
| `--accent-teal` | #5BBFBA | 輔助色 |
| `--text-dark` | #1A1A2E | 導航/標題 |

---

## 3. Spacing

| Token | Value |
|-------|-------|
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 32px |
| `--space-xl` | 48px |
| `--space-2xl` | 64px |

重點調整：卡片 padding 24px、卡片間距 24px、頁面邊距 48px

---

## 4. 圖示系統

- 導入 **Lucide Icons** CDN
- 統一大小 20-24px
- 移除所有 Emoji

---

## 檔案變更清單

| 檔案 | 變更 |
|------|------|
| [style.css](file:///D:/AntiWorkspace/nagoya-trip/css/style.css) | 更新 CSS 變數、字體、間距 |
| [index.html](file:///D:/AntiWorkspace/nagoya-trip/index.html) | 更新 Fonts、引入 Lucide |
| [pages.js](file:///D:/AntiWorkspace/nagoya-trip/js/pages.js) | Emoji → Icon |
