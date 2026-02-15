/**
 * Main Application - 名古屋旅遊行程指南
 * NAGOYA TRIP 2026
 */

// 全域變數
let scheduleManager = null;
let currentDayNumber = 1;
let itineraryData = null;

/**
 * 內嵌的行程資料（避免 CORS 問題，可直接開啟 HTML 使用）
 */
const EMBEDDED_ITINERARY_DATA = {
    "trip": {
        "title": "2026年2月 名古屋 5天4夜 慢活家庭旅遊",
        "destination": "日本名古屋",
        "startDate": "2026-02-20",
        "endDate": "2026-02-24"
    },
    "flights": {
        "outbound": {
            "airline": "國泰航空",
            "flightNumber": "CX530",
            "departure": { "airport": "TPE", "city": "台北桃園", "time": "12:00", "date": "2026-02-20" },
            "arrival": { "airport": "NGO", "city": "名古屋中部", "time": "15:35", "date": "2026-02-20" },
            "reminder": "建議 09:30 抵達桃園機場第一航廈報到"
        },
        "return": {
            "airline": "國泰航空",
            "flightNumber": "CX531",
            "departure": { "airport": "NGO", "city": "名古屋中部", "time": "16:40", "date": "2026-02-24" },
            "arrival": { "airport": "TPE", "city": "台北桃園", "time": "19:15", "date": "2026-02-24" }
        }
    },
    "hotel": {
        "name": "名古屋日航尚格酒店",
        "nameEn": "Nikko Style Nagoya",
        "address": "5-20-13 Meieki, Nakamura-ku, Nagoya",
        "coordinates": { "lat": 35.1706, "lng": 136.8816 }
    },
    "days": [
        {
            "day": 1, "date": "2026-02-20", "dayOfWeek": "五", "theme": "抵達與頂級燒肉",
            "events": [
                { "id": "d1-e1", "time": "15:35", "endTime": "16:30", "title": "抵達中部國際機場", "titleEn": "Arrive at Chubu Centrair Airport", "description": "搭乘 μ-SKY 列車 (約 28 分鐘) 直達名古屋車站", "icon": "<i data-lucide='plane'></i>", "category": "transport", "coordinates": { "lat": 34.8584, "lng": 136.8074 } },
                { "id": "d1-e2", "time": "17:00", "endTime": "17:30", "title": "飯店 Check-in", "titleEn": "Hotel Check-in", "description": "轉乘計程車 (約 5 分鐘) 前往飯店「名古屋日航尚格酒店」 Check-in 與休息", "icon": "<i data-lucide='bed-double'></i>", "category": "hotel", "coordinates": { "lat": 35.16985781333653, "lng": 136.8909969625687 } },
                { "id": "d1-e3", "time": "18:30", "endTime": "20:30", "title": "晚餐：牛ざんまい 納屋橋", "titleEn": "Dinner: Gyuzanmai Nayabashi", "description": "飛騨牛燒肉，位於納屋橋河畔，氣氛極佳，高 CP 值", "icon": "<i data-lucide='beef'></i>", "category": "food", "coordinates": { "lat": 35.16821783963066, "lng": 136.89187242080152 } }
            ]
        },
        {
            "day": 2, "date": "2026-02-21", "dayOfWeek": "六", "theme": "歷史巡禮與備長鰻魚飯",
            "events": [
                { "id": "d2-e1", "time": "09:30", "endTime": "12:00", "title": "名古屋城", "titleEn": "Nagoya Castle", "description": "參觀本丸御殿（金碧輝煌的壁畫）。城內部分碎石路，建議推車走鋪設步道。", "icon": "<i data-lucide='castle'></i>", "category": "attraction", "coordinates": { "lat": 35.1856, "lng": 136.8994 } },
                { "id": "d2-e2", "time": "12:00", "endTime": "13:30", "title": "午餐：金鯱橫丁", "titleEn": "Lunch: Kinshachi Yokocho", "description": "名古屋城正門外美食街。推薦：矢場炸豬排或鳥開總本家親子丼", "icon": "<i data-lucide='utensils'></i>", "category": "food", "coordinates": { "lat": 35.1851, "lng": 136.8998 } },
                { "id": "d2-e3", "time": "14:00", "endTime": "16:30", "title": "豐田產業技術紀念館", "titleEn": "Toyota Commemorative Museum", "description": "紡織機械實演、Technoland 兒童體驗區讓小孩放電。館內有咖啡廳可休息。", "icon": "<i data-lucide='car'></i>", "category": "attraction", "coordinates": { "lat": 35.1825623623133, "lng": 136.87598176915102 } },
                { "id": "d2-e4", "time": "17:00", "endTime": "19:00", "title": "晚餐：備長鰻魚飯", "titleEn": "Dinner: Bincho Unagi", "description": "【已訂位 17:00】大名古屋大廈 3F。正宗炭烤三吃鰻魚飯。", "icon": "<i data-lucide='fish-symbol'></i>", "category": "food", "isReserved": true, "coordinates": { "lat": 35.17188484585684, "lng": 136.8843005937487 } }
            ]
        },
        {
            "day": 3, "date": "2026-02-22", "dayOfWeek": "日", "theme": "樂園狂歡與壽司之夜",
            "events": [
                { "id": "d3-e1", "time": "10:00", "endTime": "14:00", "title": "LEGOLAND Japan", "titleEn": "LEGOLAND Japan", "description": "適合 2-12 歲，設施溫和。推薦「得寶谷 (Duplo Valley)」給 2 歲兒子。", "icon": "<i data-lucide='blocks'></i>", "category": "attraction", "coordinates": { "lat": 35.0505, "lng": 136.8435 } },
                { "id": "d3-e2", "time": "12:00", "endTime": "13:00", "title": "午餐：Knight's Table", "titleEn": "Lunch: Knight's Table", "description": "樂高樂園內餐廳，空間大，有兒童餐。", "icon": "<i data-lucide='utensils'></i>", "category": "food", "coordinates": { "lat": 35.0505, "lng": 136.8435 } },
                { "id": "d3-e3", "time": "14:30", "endTime": "16:30", "title": "磁浮鐵道館", "titleEn": "SCMAGLEV and Railway Park", "description": "樂高樂園對面。歷代新幹線實車展示、巨大鐵道模型場景。", "icon": "<i data-lucide='tram-front'></i>", "category": "attraction", "coordinates": { "lat": 35.0494, "lng": 136.8517 } },
                { "id": "d3-e4", "time": "18:00", "endTime": "19:30", "title": "晚餐：壽司郎 榮店", "titleEn": "Dinner: Sushiro Sakae", "description": "Maruei Galleria 1F，迴轉壽司。請務必先用 App 預約時段。", "icon": "<i data-lucide='disc'></i>", "category": "food", "coordinates": { "lat": 35.1684, "lng": 136.9053 } }
            ]
        },
        {
            "day": 4, "date": "2026-02-23", "dayOfWeek": "一", "theme": "水族館與購物盛典", "note": "國定假日",
            "events": [
                { "id": "d4-e1", "time": "09:30", "endTime": "12:00", "title": "名古屋港水族館", "titleEn": "Port of Nagoya Aquarium", "description": "日本最大水槽、虎鯨與海豚表演。假日人多，建議 09:30 開館前抵達。", "icon": "<i data-lucide='fish'></i>", "category": "attraction", "coordinates": { "lat": 35.0906, "lng": 136.8782 } },
                { "id": "d4-e2", "time": "12:30", "endTime": "13:30", "title": "午餐：LaLaport 美食街", "titleEn": "Lunch: LaLaport Food Court", "description": "LaLaport 名古屋港 3F 美食街，選擇多樣。", "icon": "<i data-lucide='sandwich'></i>", "category": "food", "coordinates": { "lat": 35.1089, "lng": 136.8832 } },
                { "id": "d4-e3", "time": "14:00", "endTime": "17:00", "title": "LaLaport 購物 & 阿卡將", "titleEn": "Shopping at LaLaport & Akachan", "description": "採買兒童用品、藥妝、伴手禮。阿卡將在 3F。", "icon": "<i data-lucide='shopping-cart'></i>", "category": "shopping", "coordinates": { "lat": 35.1089, "lng": 136.8832 } },
                { "id": "d4-e4", "time": "17:30", "endTime": "19:00", "title": "晚餐：利久牛舌 / 雞三和", "titleEn": "Dinner: Rikyu / Torisanwa", "description": "LaLaport 館內用餐，包車載戰利品回飯店。", "icon": "<i data-lucide='drumstick'></i>", "category": "food", "coordinates": { "lat": 35.1089, "lng": 136.8832 } }
            ]
        },
        {
            "day": 5, "date": "2026-02-24", "dayOfWeek": "二", "theme": "神宮參拜與返台",
            "events": [
                { "id": "d5-e1", "time": "09:00", "endTime": "11:00", "title": "熱田神宮", "titleEn": "Atsuta Shrine", "description": "日本三大神宮之一，參天古樹。地面多碎石，包車司機可停在離本殿最近入口。", "icon": "<i data-lucide='landmark'></i>", "category": "attraction", "coordinates": { "lat": 35.1280, "lng": 136.9088 } },
                { "id": "d5-e2", "time": "11:30", "endTime": "12:30", "title": "午餐：宮きしめん", "titleEn": "Lunch: Miya Kishimen", "description": "神宮境內。在樹林下吃寬扁麵，湯頭清爽，別有風味。", "icon": "<i data-lucide='soup'></i>", "category": "food", "coordinates": { "lat": 35.1280, "lng": 136.9088 } },
                { "id": "d5-e3", "time": "13:00", "endTime": "14:40", "title": "拿行李出發去機場", "titleEn": "Pick up Luggage & Head to Airport", "description": "回飯店拿行李後，搭計程車出發去機場", "icon": "<i data-lucide='car-taxi-front'></i>", "category": "transport", "coordinates": { "lat": 34.8584, "lng": 136.8074 } },
                { "id": "d5-e4", "time": "16:40", "endTime": "19:15", "title": "返程航班 CX531", "titleEn": "Return Flight CX531", "description": "名古屋 16:40 起飛 → 台北 19:15 抵達", "icon": "<i data-lucide='plane'></i>", "category": "transport", "coordinates": { "lat": 34.8584, "lng": 136.8074 } }
            ]
        }
    ],
    "weather": {
        "temperature": "3℃ - 10℃",
        "description": "乾冷，海邊風大",
        "tips": ["防風防水厚羽絨外套（有連帽）", "發熱衣（長輩與小孩必備）", "圍巾、毛帽、手套、厚毛襪", "推車防風罩或厚毛毯"]
    }
};

/**
 * 載入行程資料（直接使用內嵌資料，無需伺服器）
 */
function loadItineraryData() {
    itineraryData = EMBEDDED_ITINERARY_DATA;
    window.itineraryData = itineraryData;
    console.log('✅ 行程資料載入成功（使用內嵌資料）');
    return itineraryData;
}



/**
 * 計算距離出發的天數
 */
function getDaysUntilDeparture() {
    const now = new Date();
    const startDate = new Date('2026-02-20T00:00:00+08:00');
    const diffTime = startDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * 判斷旅程是否已開始
 */
function isTripStarted() {
    const now = new Date();
    const startDate = new Date('2026-02-20T00:00:00+08:00');
    return now >= startDate;
}

/**
 * 判斷旅程是否已結束
 */
function isTripEnded() {
    const now = new Date();
    const endDate = new Date('2026-02-24T23:59:59+08:00');
    return now > endDate;
}

/**
 * 取得當前是旅程的第幾天 (1-5)
 */
function getCurrentTripDayNumber() {
    const now = new Date();
    const startDate = new Date('2026-02-20T00:00:00+08:00');

    if (now < startDate) return 0;

    const diffTime = now - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > 5) return -1; // 旅程結束
    return diffDays;
}

/**
 * 更新倒數計時或進度顯示
 */
function updateCountdownOrProgress() {
    const countdownSection = document.getElementById('countdownSection');
    const progressSection = document.getElementById('progressSection');

    if (!countdownSection || !progressSection) return;

    const tripStarted = isTripStarted();
    const showProgress = tripStarted;

    if (showProgress) {
        // 顯示進度區塊
        countdownSection.classList.add('hidden');
        progressSection.classList.remove('hidden');
        updateTripProgress();
    } else {
        // 顯示倒數區塊
        countdownSection.classList.remove('hidden');
        progressSection.classList.add('hidden');
        updateCountdown();
    }
}

/**
 * 更新倒數計時顯示
 */
function updateCountdown() {
    const daysUntil = getDaysUntilDeparture();

    // 更新天數
    const countdownDaysEl = document.getElementById('countdownDays');
    if (countdownDaysEl) {
        countdownDaysEl.textContent = Math.max(0, daysUntil);
    }

    // 更新台灣和日本時間
    updateAllTimes();
}

/**
 * 更新旅程進度（以天為單位，每天 20%）
 */
function updateTripProgress() {
    const currentDay = getCurrentTripDayNumber();

    // 計算進度 (每天 20%)
    let progress = 0;
    if (currentDay > 0 && currentDay <= 5) {
        progress = currentDay * 20;
    } else if (currentDay > 5 || isTripEnded()) {
        progress = 100;
    }

    // 更新進度條
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const progressStatus = document.getElementById('progressStatus');

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressPercent) progressPercent.textContent = `${progress}%`;

    // 更新狀態文字
    if (progressStatus) {
        if (currentDay > 0 && currentDay <= 5) {
            progressStatus.textContent = `Day ${currentDay} 進行中`;
        } else if (isTripEnded()) {
            progressStatus.textContent = '旅程已結束';
        }
    }

    // 更新天數指示器
    document.querySelectorAll('.day-indicator').forEach(indicator => {
        const day = parseInt(indicator.dataset.day);
        indicator.classList.remove('active', 'completed');

        if (day === currentDay) {
            indicator.classList.add('active');
        } else if (day < currentDay) {
            indicator.classList.add('completed');
        }
    });

    // 更新時間顯示
    updateProgressTimes();
}

/**
 * 更新所有時間顯示（台灣 & 日本）
 */
function updateAllTimes() {
    const now = new Date();

    // 台灣時間 (UTC+8)
    const taiwanOptions = {
        timeZone: 'Asia/Taipei',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const taiwanDateOptions = {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    // 日本時間 (UTC+9)
    const japanOptions = {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const japanDateOptions = {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    // 倒數區塊的時間
    const taiwanTimeEl = document.getElementById('taiwanTime');
    const taiwanDateEl = document.getElementById('taiwanDate');
    const japanTimeEl = document.getElementById('japanTime');
    const japanDateEl = document.getElementById('japanDate');

    if (taiwanTimeEl) {
        taiwanTimeEl.textContent = now.toLocaleTimeString('zh-TW', taiwanOptions);
    }
    if (taiwanDateEl) {
        taiwanDateEl.textContent = now.toLocaleDateString('zh-TW', taiwanDateOptions);
    }
    if (japanTimeEl) {
        japanTimeEl.textContent = now.toLocaleTimeString('ja-JP', japanOptions);
    }
    if (japanDateEl) {
        japanDateEl.textContent = now.toLocaleDateString('ja-JP', japanDateOptions);
    }
}

/**
 * 更新進度區塊的時間顯示
 */
function updateProgressTimes() {
    const now = new Date();

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const taiwanTimeEl = document.getElementById('progressTaiwanTime');
    const japanTimeEl = document.getElementById('progressJapanTime');

    if (taiwanTimeEl) {
        taiwanTimeEl.textContent = now.toLocaleTimeString('zh-TW', { ...timeOptions, timeZone: 'Asia/Taipei' });
    }
    if (japanTimeEl) {
        japanTimeEl.textContent = now.toLocaleTimeString('ja-JP', { ...timeOptions, timeZone: 'Asia/Tokyo' });
    }
}

/**
 * 初始化應用程式
 */
function initApp() {
    // 載入資料（同步，使用內嵌資料）
    const data = loadItineraryData();
    if (!data) {
        document.querySelector('.main-content').innerHTML = `
            <div class="error-message">
                <h2>無法載入行程資料</h2>
                <p>請確認 data/itinerary.json 檔案存在且格式正確。</p>
            </div>
        `;
        return;
    }

    // 初始化行程管理器
    scheduleManager = new ScheduleManager(data);

    // 判斷應該顯示哪一天
    const tripDay = scheduleManager.getCurrentTripDay();
    if (tripDay > 0) {
        currentDayNumber = tripDay;
    } else {
        currentDayNumber = 1;
    }
    window.currentDayNumber = currentDayNumber;

    // 初始化 UI
    initDayNavigation();
    switchToDay(currentDayNumber);

    // 初始化倒數/進度顯示
    updateCountdownOrProgress();
    updateAllTimes();

    // 每秒更新時間
    setInterval(() => {
        updateAllTimes();
        if (isTripStarted()) {
            updateProgressTimes();
        }
    }, 1000);

    // 每分鐘檢查是否需要切換倒數/進度
    setInterval(() => {
        updateCountdownOrProgress();
        highlightCurrentEvent();
    }, 60000);

    // 初始化通知
    initNotifications();

    // 初始化地圖
    initMapControls();

    // 初始化頁面系統
    initPages();
}

/**
 * 初始化日期導航
 */
function initDayNavigation() {
    const dayTabs = document.querySelectorAll('.day-tab');
    const tripDay = scheduleManager.getCurrentTripDay();

    dayTabs.forEach(tab => {
        const day = parseInt(tab.dataset.day);

        // 標記今天
        if (day === tripDay) {
            tab.classList.add('today');
        }

        // 點擊事件
        tab.addEventListener('click', () => {
            switchToDay(day);
        });
    });
}

/**
 * 切換到指定天數
 */
function switchToDay(dayNumber) {
    currentDayNumber = dayNumber;
    window.currentDayNumber = dayNumber;

    // 更新導航 active 狀態
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.classList.toggle('active', parseInt(tab.dataset.day) === dayNumber);
    });

    // 更新標題
    const dayData = scheduleManager.getDayData(dayNumber);
    if (dayData) {
        document.getElementById('dayTheme').textContent = dayData.theme;

        const dateObj = new Date(dayData.date);
        const dateStr = dateObj.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        document.getElementById('daySubtitle').textContent = `Day ${dayNumber} · ${dateStr}`;
    }

    // 渲染時間軸
    renderTimeline(scheduleManager, dayNumber);

    // 更新進度
    updateProgress(scheduleManager, dayNumber);

    // 高亮當前事件
    highlightCurrentEvent();

    // 切換日期時清空地圖搜尋
    if (window.mapManager) mapManager.clearSearch();

    if (mapManager.isInitialized) {
        const events = dayData ? dayData.events : [];
        const currentEvent = scheduleManager.getCurrentEvent(dayNumber);
        mapManager.loadDayEvents(events, currentEvent?.id);
    }

    // 更新航班卡片（已移至航班資訊頁面）

    // 渲染 Lucide Icons
    lucide.createIcons();
}

/**
 * 高亮當前進行中的事件
 */
function highlightCurrentEvent() {
    const currentEvent = scheduleManager.getCurrentEvent(currentDayNumber);

    document.querySelectorAll('.event-card').forEach(card => {
        card.classList.remove('current');
    });

    if (currentEvent) {
        const card = document.querySelector(`[data-event-id="${currentEvent.id}"]`);
        if (card) {
            card.classList.add('current');
        }
    }
}

/**
 * 初始化通知功能
 */
async function initNotifications() {
    const hasPermission = await notificationManager.init();

    // 通知按鈕 - 一鍵設定當日所有提醒
    document.getElementById('notificationBtn').addEventListener('click', async () => {
        if (notificationManager.permission === 'granted') {
            // 設定當日所有即將到來的行程提醒
            if (!window.itineraryData || !window.currentDayNumber) {
                alert('無法設定提醒：資料未載入');
                return;
            }

            const dayData = window.itineraryData.days.find(d => d.day === window.currentDayNumber);
            if (!dayData || !dayData.events) {
                alert('無法設定提醒：找不到當日資料');
                return;
            }

            const count = notificationManager.setAllRemindersForDay(dayData.events, dayData.date);
            if (count > 0) {
                alert(`✅ 已設定 ${count} 個行程提醒！\n\n所有即將到來的行程將在開始前 15 分鐘提醒您。`);
            } else {
                alert('目前沒有即將到來的行程可設定提醒。');
            }
        } else {
            notificationManager.showPermissionModal();
        }
    });

    // Modal 按鈕
    document.getElementById('notificationAllow').addEventListener('click', async () => {
        const granted = await notificationManager.requestPermission();
        notificationManager.hidePermissionModal();

        if (granted) {
            alert('✅ 通知已開啟！');
        } else {
            alert('❌ 通知權限被拒絕。您可以在瀏覽器設定中重新開啟。');
        }
    });

    document.getElementById('notificationLater').addEventListener('click', () => {
        notificationManager.hidePermissionModal();
    });
}

/**
 * 初始化地圖控制
 */
function initMapControls() {
    // 地圖切換按鈕
    document.getElementById('mapToggleBtn').addEventListener('click', (e) => {
        mapManager.toggle();

        const btn = e.currentTarget;
        const isHidden = document.getElementById('mapSection').classList.contains('hidden');
        btn.classList.toggle('active', !isHidden);

        // 移除焦點以避免手機版持續顯示背景色
        btn.blur();

        // 載入當日景點
        if (!document.getElementById('mapSection').classList.contains('hidden')) {
            // 開啟時，如果行程中有當前正在進行的項目，讓它的 MAP 按鈕發光
            const currentEvent = scheduleManager.getCurrentEvent(currentDayNumber);
            if (currentEvent) {
                const btn = document.querySelector(`.event-card[data-event-id="${currentEvent.id}"] .btn-map-tech`);
                if (btn) btn.classList.add('map-active');
            }

            const dayData = scheduleManager.getDayData(currentDayNumber);
            if (dayData) {
                const currentEvent = scheduleManager.getCurrentEvent(currentDayNumber);
                mapManager.loadDayEvents(dayData.events, currentEvent?.id);
            }
        } else {
            // 關閉地圖時移除所有狀態
            document.getElementById('mapToggleBtn').classList.remove('active');
            document.querySelectorAll('.btn-map-tech').forEach(btn => btn.classList.remove('map-active'));
            document.querySelectorAll('.event-card').forEach(c => c.classList.remove('focused-float'));
            if (window.mapManager) mapManager.clearSearch();
        }
    });

    // 關閉地圖按鈕
    document.getElementById('mapCloseBtn').addEventListener('click', () => {
        mapManager.hide();
        // 關閉地圖時移除所有狀態
        document.getElementById('mapToggleBtn').classList.remove('active');
        document.getElementById('mapToggleBtn').blur();
        document.querySelectorAll('.btn-map-tech').forEach(btn => btn.classList.remove('map-active'));
        document.querySelectorAll('.event-card').forEach(c => c.classList.remove('focused-float'));
        mapManager.clearSearch();
    });

    // 定位按鈕
    document.getElementById('mapLocateBtn').addEventListener('click', () => {
        // 如果地圖尚未開啟，先開啟
        const mapSection = document.getElementById('mapSection');
        if (mapSection.classList.contains('hidden')) {
            mapManager.toggle();
            document.getElementById('mapToggleBtn').classList.add('active');
            // 等待地圖初始化後再定位
            setTimeout(() => {
                mapManager.locateUser();
            }, 400);
        } else {
            mapManager.locateUser();
        }
    });
}

/**
 * 更新航班資訊卡片
 */
function updateFlightCard() {
    const flightCard = document.getElementById('flightCard');
    const flightCardBody = document.getElementById('flightCardBody');

    // 只在第 1 天和第 5 天顯示
    if (currentDayNumber !== 1 && currentDayNumber !== 5) {
        flightCard.classList.add('hidden');
        return;
    }

    flightCard.classList.remove('hidden');

    const flight = currentDayNumber === 1
        ? itineraryData.flights.outbound
        : itineraryData.flights.return;

    flightCardBody.innerHTML = `
        <div class="flight-route">
            <div class="flight-city">
                <div class="flight-code">${flight.departure.airport}</div>
                <div class="flight-name">${flight.departure.city}</div>
            </div>
            <div class="flight-arrow"><i data-lucide="plane"></i></div>
            <div class="flight-city">
                <div class="flight-code">${flight.arrival.airport}</div>
                <div class="flight-name">${flight.arrival.city}</div>
            </div>
        </div>
        <div class="flight-details">
            <span>${flight.flightNumber}</span>
            <span>${flight.departure.time} → ${flight.arrival.time}</span>
        </div>
        ${flight.reminder ? `<p style="margin-top: 8px; font-size: 0.75rem; color: #FF4500; display: flex; align-items: center; gap: 4px;"><i data-lucide="alert-triangle" style="width: 14px; height: 14px;"></i> ${flight.reminder}</p>` : ''}
    `;
    lucide.createIcons();
}

// 當 DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', initApp);
