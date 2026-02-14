/**
 * Drawer Tips Module - 抽屜選單貼心訊息提醒
 * NAGOYA TRIP 2026
 * 
 * 三大分類：
 * 1. 行前貼心提醒（特定日期 70% / 通用 50%）
 * 2. 名古屋冷知識（隨機輪播，附配圖）
 * 3. 名古屋美食筆記（隨機輪播，附配圖）
 */

// ============================================
//  提醒資料
// ============================================

// 旅程日期設定（與 schedule.js 一致）
const TRIP_START = new Date('2026-02-20T00:00:00+09:00');

/**
 * 計算當前是旅程第幾天（0 = 尚未出發, 1-5 = Day 1~5, 6+ = 已回程）
 */
function getTripDayNumber() {
    const now = new Date();
    // 轉為日本時間比較
    const jpNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const jpStart = new Date(TRIP_START.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));

    const diffMs = jpNow - jpStart;
    if (diffMs < 0) return 0; // 尚未出發

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Day 1 = 出發當日
}

// --- 分類 1A：特定日期事項（觸發機率 70%）---
const DATE_REMINDERS = [
    // 旅程開始前
    {
        id: 'r-pre-01',
        title: '護照檢查',
        content: '出發前記得確認護照有效期超過 6 個月。',
        condition: (day) => day === 0
    },
    {
        id: 'r-pre-02',
        title: '行李打包提醒',
        content: '名古屋 2 月氣候乾冷 (3-10°C)，記得帶防風羽絨外套與發熱衣。',
        condition: (day) => day === 0
    },
    {
        id: 'r-pre-03',
        title: '日幣兌換',
        content: '建議出發前兌換適量日幣現金，部分小店與自動販賣機僅收現金。',
        condition: (day) => day === 0
    },
    // Day 1
    {
        id: 'r-day1-01',
        title: '出發日提醒',
        content: '今天搭 CX530，建議 09:30 抵達桃園機場 Terminal 1 報到。',
        condition: (day) => day === 1
    },
    {
        id: 'r-day1-02',
        title: 'μ-SKY 列車',
        content: '抵達中部國際機場後，搭 μ-SKY 列車約 28 分鐘直達名古屋站。',
        condition: (day) => day === 1
    },
    // Day 2
    {
        id: 'r-day2-01',
        title: '備長鰻魚飯已訂位',
        content: '今天 17:00 大名古屋大廈 3F 備長鰻魚飯已訂位，記得準時抵達。',
        condition: (day) => day === 2
    },
    {
        id: 'r-day2-02',
        title: '名古屋城參觀提醒',
        content: '名古屋城內部分碎石路，建議推車走鋪設步道，方便推行。',
        condition: (day) => day === 2
    },
    // Day 3
    {
        id: 'r-day3-01',
        title: 'LEGOLAND 入園提醒',
        content: 'LEGOLAND 假日人多，建議 10:00 開園前抵達，可省排隊時間。',
        condition: (day) => day === 3
    },
    {
        id: 'r-day3-02',
        title: '壽司郎預約提醒',
        content: '晚餐壽司郎 (榮店)，請務必先用手機 App 預約時段。',
        condition: (day) => day === 3
    },
    // Day 4
    {
        id: 'r-day4-01',
        title: '國定假日注意',
        content: '今天是日本國定假日「天皇誕辰」，部分店家可能提早打烊或休息。',
        condition: (day) => day === 4
    },
    {
        id: 'r-day4-02',
        title: '水族館入館提醒',
        content: '名古屋港水族館假日人潮多，建議 09:30 開館前排隊入場。',
        condition: (day) => day === 4
    },
    {
        id: 'r-day4-03',
        title: '阿卡將採購提醒',
        content: 'LaLaport 3F 阿卡將本舖是採購兒童用品的好地方，記得逛一逛。',
        condition: (day) => day === 4
    },
    // Day 5
    {
        id: 'r-day5-01',
        title: '行李重量提醒',
        content: '最後一天！回程前請確認託運行李重量不超過航空公司限額。',
        condition: (day) => day === 5
    },
    {
        id: 'r-day5-02',
        title: '返程航班提醒',
        content: '今天搭 CX531，16:40 起飛，建議 14:40 前抵達機場辦理登機。',
        condition: (day) => day === 5
    },
    {
        id: 'r-day5-03',
        title: '伴手禮確認',
        content: '最後機會！機場免稅店可補買 Uiro、蝦餅等名古屋伴手禮。',
        condition: (day) => day === 5
    }
];

// --- 分類 1B：通用事項（觸發機率 50%）---
const GENERAL_REMINDERS = [
    {
        id: 'r-gen-01',
        title: '保暖穿搭提醒',
        content: '名古屋 2 月預估 3-10°C，海邊風大，請穿防風防水厚羽絨外套。'
    },
    {
        id: 'r-gen-02',
        title: '幼兒保暖提醒',
        content: '帶寶寶出門前記得穿好發熱衣，並準備推車防風罩或厚毛毯。'
    },
    {
        id: 'r-gen-03',
        title: '推車使用提醒',
        content: '推車過碎石路段時建議由大人抱著寶寶，避免顛簸不適。'
    },
    {
        id: 'r-gen-04',
        title: '補水提醒',
        content: '冬天空氣乾燥，記得隨身攜帶保溫瓶，定時補充溫水。'
    },
    {
        id: 'r-gen-05',
        title: '防曬提醒',
        content: '即使冬天，戶外活動時紫外線仍不可忽視，建議做好基本防曬。'
    },
    {
        id: 'r-gen-06',
        title: '充電器提醒',
        content: '日本電壓 100V，台灣電器可直接使用，但建議攜帶行動電源備用。'
    },
    {
        id: 'r-gen-07',
        title: '垃圾分類提醒',
        content: '日本街上垃圾桶極少，建議隨身攜帶小塑膠袋裝垃圾。'
    },
    {
        id: 'r-gen-08',
        title: 'IC 卡使用提醒',
        content: '搭地鐵、公車與便利商店可使用 IC 卡 (Suica/ICOCA)，非常方便。'
    }
];

// --- 分類 2：名古屋冷知識（附配圖）---
const TRIVIA_TIPS = [
    {
        id: 't-01',
        title: '金鯱傳說',
        content: '名古屋城頂上的金鯱 (きんしゃち) 使用了 88kg 的 18K 金板打造（約等於 66kg 純金），是日本最奢華的城堡裝飾。',
        image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=480&h=270&fit=crop'
    },
    {
        id: 't-02',
        title: '日本的十字路口',
        content: '名古屋是連接東京與大阪的交通樞紐，東海道新幹線在此停靠，被譽為「日本的十字路口」。',
        image: 'https://images.unsplash.com/photo-1536183922588-166604504d5e?w=480&h=270&fit=crop'
    },
    {
        id: 't-03',
        title: 'Morning 喫茶文化',
        content: '名古屋獨特的「Morning」(モーニング) 文化：只要點一杯咖啡，就免費附贈整套吐司早餐！',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=480&h=270&fit=crop'
    },
    {
        id: 't-04',
        title: '草薙劍的守護',
        content: '熱田神宮供奉著日本三大神器之一的「草薙劍」，每年有超過 650 萬人前來參拜。',
        image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=480&h=270&fit=crop'
    },
    {
        id: 't-05',
        title: '汽車工業之都',
        content: '名古屋是豐田汽車的發源地，豐田產業技術紀念館展示了從紡織機到汽車的完整發展歷程。',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=480&h=270&fit=crop'
    },
    {
        id: 't-06',
        title: '日本第四大城',
        content: '名古屋是日本第四大城市，人口超過 230 萬人，中部地區的經濟與文化中心。',
        image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=480&h=270&fit=crop'
    },
    {
        id: 't-07',
        title: '名古屋方言',
        content: '名古屋方言「みゃー」(myā) 非常有特色，「うみゃー」就是「好吃」的意思！',
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=480&h=270&fit=crop'
    },
    {
        id: 't-08',
        title: '地下街王國',
        content: '名古屋站周邊的地下街總面積超過 10 萬平方公尺，是日本密度最高的地下商業區之一。',
        image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?w=480&h=270&fit=crop'
    },
    {
        id: 't-09',
        title: '大須商店街',
        content: '大須商店街擁有超過 400 年歷史，融合了寺廟、潮流商店與多國料理，被稱為「名古屋的秋葉原」。',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=480&h=270&fit=crop'
    },
    {
        id: 't-10',
        title: '天守閣的重建',
        content: '名古屋城原本的天守閣在 1945 年空襲中燒毀，目前正在計畫以全木造方式忠實復原。',
        image: 'https://images.unsplash.com/photo-1578469645742-46cae010e5d6?w=480&h=270&fit=crop'
    }
];

// --- 分類 3：名古屋美食筆記（附配圖）---
const FOOD_TIPS = [
    {
        id: 'f-01',
        title: '味噌煮込みうどん',
        content: '名古屋冬天的靈魂料理，用八丁味噌慢燉的濃郁烏龍麵，打入生蛋攪拌更是一絕！',
        image: 'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=480&h=270&fit=crop'
    },
    {
        id: 'f-02',
        title: '手羽先炸雞翅',
        content: '名古屋最強下酒菜，「山ちゃん」和「風來坊」是兩大人氣名店，各有擁護者。',
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=480&h=270&fit=crop'
    },
    {
        id: 'f-03',
        title: '巨大炸蝦',
        content: '名古屋的炸蝦 (エビフライ) 份量特別驚人，本地人開玩笑稱名古屋為「蝦炸之城」。',
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=480&h=270&fit=crop'
    },
    {
        id: 'f-04',
        title: '鰻魚飯三吃',
        content: 'ひつまぶし是名古屋必吃：原味享用、加蔥薑山葵、最後加高湯成茶泡飯，三種風味一次滿足。',
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=480&h=270&fit=crop'
    },
    {
        id: 'f-05',
        title: '外郎 Uiro',
        content: '名古屋的代表和菓子，口感 Q 彈似麻糬，抹茶與小豆口味是人氣伴手禮首選。',
        image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=480&h=270&fit=crop'
    },
    {
        id: 'f-06',
        title: 'Komeda 珈琲',
        content: '發源自名古屋的連鎖咖啡店，招牌「シロノワール」是熱丹麥麵包配冰淇淋，甜鹹交融。',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=480&h=270&fit=crop'
    },
    {
        id: 'f-07',
        title: '味噌豬排',
        content: '名古屋式炸豬排淋上甜鹹的八丁味噌醬，矢場炸豬排 (矢場とん) 是最具代表性的名店。',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=480&h=270&fit=crop'
    },
    {
        id: 'f-08',
        title: '台灣拉麵',
        content: '其實是名古屋發明的！「味仙」的台灣拉麵以重辣聞名，辣度遠超一般拉麵。',
        image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=480&h=270&fit=crop'
    },
    {
        id: 'f-09',
        title: '小倉吐司',
        content: '名古屋獨特早餐：烤吐司上塗奶油再鋪滿紅豆餡，鹹甜組合意外地令人上癮。',
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=480&h=270&fit=crop'
    },
    {
        id: 'f-10',
        title: '天むす',
        content: '把小蝦天婦羅包進飯糰裡，是名古屋的經典速食小吃，適合邊走邊吃。',
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=480&h=270&fit=crop'
    }
];


// ============================================
//  顯示邏輯
// ============================================

/**
 * 從陣列中隨機選取一個尚未顯示過的項目
 */
function pickUnshown(items) {
    const shownKey = 'drawerTipsShown';
    let shown = [];
    try {
        shown = JSON.parse(sessionStorage.getItem(shownKey) || '[]');
    } catch (e) {
        shown = [];
    }

    const available = items.filter(item => !shown.includes(item.id));
    if (available.length === 0) {
        // 全部都顯示過了，重置
        const allIds = items.map(i => i.id);
        shown = shown.filter(id => !allIds.includes(id));
        sessionStorage.setItem(shownKey, JSON.stringify(shown));
        return items[Math.floor(Math.random() * items.length)];
    }

    const picked = available[Math.floor(Math.random() * available.length)];
    shown.push(picked.id);
    sessionStorage.setItem(shownKey, JSON.stringify(shown));
    return picked;
}

/**
 * 選取要顯示的提醒
 */
function selectTip() {
    const dayNumber = getTripDayNumber();
    const roll = Math.random();

    // Step 1：檢查特定日期事項
    const matchedDateReminders = DATE_REMINDERS.filter(r => r.condition(dayNumber));

    // Step 2：檢查通用事項
    const generalPool = GENERAL_REMINDERS;

    // Step 3：優先級判斷
    // 特定日期事項 70% 觸發
    if (matchedDateReminders.length > 0 && Math.random() < 0.7) {
        const tip = pickUnshown(matchedDateReminders);
        return { ...tip, type: 'reminder' };
    }

    // 通用事項 50% 觸發
    if (Math.random() < 0.5) {
        const tip = pickUnshown(generalPool);
        return { ...tip, type: 'reminder' };
    }

    // Step 4：隨機選擇冷知識或美食
    if (Math.random() < 0.5) {
        const tip = pickUnshown(TRIVIA_TIPS);
        return { ...tip, type: 'trivia' };
    } else {
        const tip = pickUnshown(FOOD_TIPS);
        return { ...tip, type: 'food' };
    }
}

/**
 * 取得分類標籤文字
 */
function getCategoryLabel(type) {
    switch (type) {
        case 'reminder': return '旅程小助手';
        case 'trivia': return '名古屋冷知識';
        case 'food': return '名古屋美食筆記';
        default: return '旅程小助手';
    }
}

/**
 * 渲染提醒卡片
 */
function renderDrawerTip() {
    const container = document.getElementById('drawerTips');
    if (!container) return;

    const tip = selectTip();
    const label = getCategoryLabel(tip.type);

    // 構建圖片 HTML（僅冷知識與美食有圖）
    let imageHtml = '';
    if (tip.image) {
        imageHtml = `<img class="drawer-tip-image" src="${tip.image}" alt="${tip.title}" loading="lazy" onerror="this.style.display='none'">`;
    }

    container.innerHTML = `
        <div class="drawer-tip-card">
            <div class="drawer-tip-label">${label}</div>
            <div class="drawer-tip-title">${tip.title}</div>
            <div class="drawer-tip-content">${tip.content}</div>
            ${imageHtml}
        </div>
    `;
}

// 匯出給 pages.js 使用
window.renderDrawerTip = renderDrawerTip;
