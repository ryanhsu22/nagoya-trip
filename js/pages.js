/**
 * Pages Module - 頁面切換與 Layer 2 內容渲染
 * NAGOYA TRIP 2026
 */

// 當前頁面
let currentPage = 'itinerary';

/**
 * 初始化側邊選單
 */
function initSideDrawer() {
    const menuBtn = document.getElementById('menuBtn');
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const closeBtn = document.getElementById('drawerCloseBtn');

    // 開啟選單
    menuBtn.addEventListener('click', () => {
        document.body.classList.add('drawer-open');
        // 每次打開抽屜時渲染一則貼心提醒
        if (typeof renderDrawerTip === 'function') {
            renderDrawerTip();
        }
    });

    // 關閉選單
    const closeDrawer = () => {
        document.body.classList.remove('drawer-open');
    };

    overlay.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    // 選單項目點擊
    document.querySelectorAll('.drawer-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            switchPage(pageId);
            closeDrawer();
        });
    });
}

/**
 * 切換頁面
 */
function switchPage(pageId) {
    currentPage = pageId;

    // 更新選單 active 狀態
    document.querySelectorAll('.drawer-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });

    // 隱藏所有頁面，顯示目標頁面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 渲染 Layer 2 頁面內容
    switch (pageId) {
        case 'flight':
            renderFlightPage();
            break;
        case 'weather':
            renderWeatherPage();
            break;
        case 'hotel':
            renderHotelPage();
            break;
        case 'transport':
            renderTransportPage();
            break;
        case 'medical':
            renderMedicalPage();
            break;
        case 'baby':
            renderBabyPage();
            break;
    }

    // 初始化動態渲染的 Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * 渲染航班與行李資訊頁面
 */
function renderFlightPage() {
    const container = document.getElementById('flightContent');
    if (container.querySelector('.info-card')) return;

    container.innerHTML = `
        <div class="info-card highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">去程航班</h3>
            </div>
            <div class="flight-display">
                <div class="flight-endpoint">
                    <div class="flight-code">TPE</div>
                    <div class="flight-city">台北桃園</div>
                    <div class="flight-time">12:00</div>
                </div>
                <div class="flight-arrow-large">→</div>
                <div class="flight-endpoint">
                    <div class="flight-code">NGO</div>
                    <div class="flight-city">名古屋中部</div>
                    <div class="flight-time">15:35</div>
                </div>
            </div>
            <div class="info-row">
                <span class="info-label">日期</span>
                <span class="info-value">2026年2月20日 (週五)</span>
            </div>
            <div class="info-row">
                <span class="info-label">航班</span>
                <span class="info-value">國泰航空 CX530</span>
            </div>
            <div class="info-row">
                <span class="info-label">航廈</span>
                <span class="info-value">桃園 T1 → 中部 T1</span>
            </div>
            <div class="info-alert warning">
                建議 09:30 抵達桃園機場 T1 報到
            </div>
        </div>

        <div class="info-card highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">回程航班</h3>
            </div>
            <div class="flight-display">
                <div class="flight-endpoint">
                    <div class="flight-code">NGO</div>
                    <div class="flight-city">名古屋中部</div>
                    <div class="flight-time">16:40</div>
                </div>
                <div class="flight-arrow-large">→</div>
                <div class="flight-endpoint">
                    <div class="flight-code">TPE</div>
                    <div class="flight-city">台北桃園</div>
                    <div class="flight-time">19:15</div>
                </div>
            </div>
            <div class="info-row">
                <span class="info-label">日期</span>
                <span class="info-value">2026年2月24日 (週二)</span>
            </div>
            <div class="info-row">
                <span class="info-label">航班</span>
                <span class="info-value">國泰航空 CX531</span>
            </div>
            <div class="info-row">
                <span class="info-label">航廈</span>
                <span class="info-value">中部 T1 → 桃園 T1</span>
            </div>
            <div class="info-alert warning">
                建議 14:00 抵達中部機場報到
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">行李規定</h3>
            </div>
            <div class="info-list">
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>託運行李</strong>
                        <span>每人 23kg (成人與小孩皆同)</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>隨身行李</strong>
                        <span>不超過 7kg</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>嬰兒推車</strong>
                        <span>可機邊託運 (Gate Check)</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">電子用品注意</h3>
            </div>
            <div class="info-list">
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>筆電/平板</strong>
                        <span>建議隨身攜帶</span>
                    </div>
                </div>
                <div class="info-list-item important">
                    <div class="info-list-content">
                        <strong>行動電源</strong>
                        <span>必須隨身攜帶 (禁止託運)</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染天氣與穿衣建議頁面
 */
function renderWeatherPage() {
    const container = document.getElementById('weatherContent');
    if (container.querySelector('.info-card')) return;

    container.innerHTML = `
        <div class="info-card highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">2月名古屋氣溫</h3>
            </div>
            <div class="weather-display">
                <div class="temp-range">
                    <span class="temp-low">0°C</span>
                    <div class="temp-bar"></div>
                    <span class="temp-high">11°C</span>
                </div>
                <div class="weather-desc">平均 5-6°C｜乾冷、偶有降雪、海邊風大</div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">成人穿搭建議</h3>
            </div>
            <div class="clothing-layers">
                <div class="clothing-layer">
                    <span class="layer-label">內層</span>
                    <span class="layer-content">發熱衣</span>
                </div>
                <div class="clothing-layer">
                    <span class="layer-label">中層</span>
                    <span class="layer-content">長袖毛衣 / 針織衫</span>
                </div>
                <div class="clothing-layer">
                    <span class="layer-label">外層</span>
                    <span class="layer-content">厚羽絨外套 (有連帽)</span>
                </div>
                <div class="clothing-layer">
                    <span class="layer-label">下身</span>
                    <span class="layer-content">厚長褲</span>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">必備配件</h3>
            </div>
            <div class="accessory-grid">
                <div class="accessory-item">圍巾</div>
                <div class="accessory-item">毛帽</div>
                <div class="accessory-item">手套</div>
                <div class="accessory-item">厚毛襪</div>
            </div>
        </div>

        <div class="info-card baby-highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">幼兒穿搭建議</h3>
            </div>
            <div class="info-list">
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>發熱衣必備</strong>
                        <span>建議多帶，方便替換</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>推車防風罩</strong>
                        <span>或厚毛毯包裹保暖</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">室內注意</h3>
            </div>
            <p class="info-text">
                日本室內、電車、商場皆有暖氣，建議多層次穿搭方便穿脫，避免過熱流汗後吹到冷風著涼。
            </p>
        </div>
    `;
}

/**
 * 渲染住宿與商圈頁面
 */
function renderHotelPage() {
    const container = document.getElementById('hotelContent');
    if (container.querySelector('.info-card')) return;

    container.innerHTML = `
        <div class="info-card highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">入住飯店</h3>
            </div>
            <div class="hotel-name">名古屋日航尚格酒店</div>
            <div class="hotel-name-en">Nikko Style Nagoya</div>
            <div class="info-row">
                <span class="info-label">地址</span>
                <span class="info-value">5-20-13 Meieki, Nakamura-ku, Nagoya</span>
            </div>
            <div class="info-row">
                <span class="info-label">位置</span>
                <span class="info-value">步行 5 分鐘至名古屋車站</span>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">周邊購物</h3>
            </div>
            <div class="shop-grid">
                <div class="shop-item">
                    <span class="shop-name">高島屋</span>
                    <span class="shop-desc">百貨公司</span>
                </div>
                <div class="shop-item">
                    <span class="shop-name">名鐵百貨</span>
                    <span class="shop-desc">百貨公司</span>
                </div>
                <div class="shop-item">
                    <span class="shop-name">KITTE</span>
                    <span class="shop-desc">購物中心</span>
                </div>
                <div class="shop-item">
                    <span class="shop-name">ESCA 地下街</span>
                    <span class="shop-desc">美食/伴手禮</span>
                </div>
                <div class="shop-item">
                    <span class="shop-name">Bic Camera</span>
                    <span class="shop-desc">電器行</span>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">周邊美食</h3>
            </div>
            <div class="food-list">
                <div class="food-item">
                    <span class="food-name">蓬萊軒鰻魚飯</span>
                </div>
                <div class="food-item">
                    <span class="food-name">矢場味噌炸豬排</span>
                </div>
                <div class="food-item">
                    <span class="food-name">世界的山將雞翅</span>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">藥妝採購</h3>
            </div>
            <div class="info-list">
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>千里馬藥局</strong>
                        <span>價格實惠、有中文店員</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>大國藥妝</strong>
                        <span>品項齊全</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card baby-highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">嬰幼兒用品</h3>
            </div>
            <p class="info-text">
                周邊有阿卡將本舖、西松屋可購買嬰幼兒用品，詳見「幼兒注意事項」頁面。
            </p>
        </div>
    `;
}

/**
 * 渲染交通資訊頁面
 */
function renderTransportPage() {
    const container = document.getElementById('transportContent');
    if (container.querySelector('.info-card')) return;

    container.innerHTML = `
        <div class="info-card highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">機場 → 飯店</h3>
            </div>
            <div class="transport-route">
                <div class="route-step">
                    <span class="step-text">中部國際機場</span>
                </div>
                <div class="route-arrow">↓ μ-SKY (28分鐘 ¥1,230)</div>
                <div class="route-step">
                    <span class="step-text">名古屋車站</span>
                </div>
                <div class="route-arrow">↓ 計程車 (5分鐘)</div>
                <div class="route-step">
                    <span class="step-text">Nikko Style Nagoya</span>
                </div>
            </div>
        </div>

        <div class="info-card highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">Day 4 全日包車</h3>
            </div>
            <div class="info-row">
                <span class="info-label">日期</span>
                <span class="info-value">2/23 (日) 已預訂</span>
            </div>
            <p class="info-text">
                當日行程：水族館 → LaLaport 購物，包車方便載運戰利品回飯店。
            </p>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">市區交通</h3>
            </div>
            <p class="info-text">
                其餘日程預計搭乘計程車移動：
            </p>
            <div class="info-list">
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>飯店叫車</strong>
                        <span>請櫃台協助叫車</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>Uber Japan</strong>
                        <span>App 叫車，可顯示目的地</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">票券參考 (備用)</h3>
            </div>
            <div class="ticket-list">
                <div class="ticket-item">
                    <span class="ticket-name">地鐵 24H 券</span>
                    <span class="ticket-price">¥760</span>
                </div>
                <div class="ticket-item">
                    <span class="ticket-name">巴士+地鐵一日券</span>
                    <span class="ticket-price">¥870</span>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">推薦 App</h3>
            </div>
            <div class="app-grid">
                <div class="app-item">Google Maps</div>
                <div class="app-item">乗換案内</div>
                <div class="app-item">Uber Japan</div>
            </div>
        </div>

        <div class="info-card baby-highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">幼兒推車</h3>
            </div>
            <p class="info-text">
                計程車後車廂可放推車；包車當日空間充裕，不需擔心推車收納問題。
            </p>
        </div>
    `;
}

/**
 * 渲染醫療資訊頁面
 */
function renderMedicalPage() {
    const container = document.getElementById('medicalContent');
    if (container.querySelector('.info-card')) return;

    container.innerHTML = `
        <div class="info-card emergency">
            <div class="info-card-header">
                <h3 class="info-card-title">緊急電話</h3>
            </div>
            <div class="emergency-numbers">
                <div class="emergency-item">
                    <span class="emergency-number">119</span>
                    <span class="emergency-desc">消防/救護車</span>
                </div>
                <div class="emergency-item">
                    <span class="emergency-number">110</span>
                    <span class="emergency-desc">警察</span>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">依嚴重程度處理</h3>
            </div>
            <div class="severity-list">
                <div class="severity-item mild">
                    <div class="severity-header">
                        <span class="severity-label">輕微不適</span>
                    </div>
                    <p>藥局購買成藥 (感冒藥、腸胃藥、退燒藥)</p>
                </div>
                <div class="severity-item moderate">
                    <div class="severity-header">
                        <span class="severity-label">需要看診</span>
                    </div>
                    <p>搜尋「あいち救急医療ガイド」找診所 (支援多語言)</p>
                </div>
                <div class="severity-item severe">
                    <div class="severity-header">
                        <span class="severity-label">緊急/嚴重</span>
                    </div>
                    <p>立即撥打 <strong>119</strong> 叫救護車</p>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">醫療支援服務</h3>
            </div>
            <div class="info-list">
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>あいち医療通訳システム</strong>
                        <span>24H 電話口譯 (中/英)</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>名古屋共立醫院</strong>
                        <span>JMIP 認證，中/英預約口譯</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>藥局查詢</strong>
                        <span>医療情報ネット (NAVII) 搜尋外語支援藥局</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">旅平險</h3>
            </div>
            <p class="info-text">
                隨身攜帶保險卡與緊急聯絡電話，發生意外時可聯繫保險公司協助。
            </p>
        </div>

        <div class="info-card baby-highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">幼兒 (2歲4個月) 醫療注意</h3>
            </div>
            <div class="info-list">
                <div class="info-list-item important">
                    <div class="info-list-content">
                        <strong>常備藥品</strong>
                        <span>攜帶台灣醫師開立的退燒藥、止瀉藥、過敏藥</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>發燒處理</strong>
                        <span>38°C↓ 先物理降溫；38.5°C↑ 服用退燒藥</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>腹瀉/嘔吐</strong>
                        <span>補充電解質液 (藥局可購 OS-1)，持續 24H 須就醫</span>
                    </div>
                </div>
                <div class="info-list-item important">
                    <div class="info-list-content">
                        <strong>過敏反應</strong>
                        <span>嚴重過敏 (呼吸困難、腫脹) 立即撥 119</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>就醫語言</strong>
                        <span>準備中文病況卡片，搭配翻譯 App</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染幼兒注意事項頁面
 */
function renderBabyPage() {
    const container = document.getElementById('babyContent');
    if (container.querySelector('.info-card')) return;

    container.innerHTML = `
        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">必備物品清單</h3>
            </div>
            <div class="checklist-section">
                <h4 class="checklist-category">衛生用品</h4>
                <div class="checklist-items">
                    <label class="checklist-item"><input type="checkbox"> 紙尿布 (每日 6-8 片 × 5 天)</label>
                    <label class="checklist-item"><input type="checkbox"> 濕紙巾</label>
                    <label class="checklist-item"><input type="checkbox"> 屁屁膏</label>
                </div>
            </div>
            <div class="checklist-section">
                <h4 class="checklist-category">飲食用品</h4>
                <div class="checklist-items">
                    <label class="checklist-item"><input type="checkbox"> 奶粉 / 母乳袋</label>
                    <label class="checklist-item"><input type="checkbox"> 副食品</label>
                    <label class="checklist-item"><input type="checkbox"> 零食</label>
                    <label class="checklist-item"><input type="checkbox"> 水壺</label>
                    <label class="checklist-item"><input type="checkbox"> 圍兜</label>
                    <label class="checklist-item"><input type="checkbox"> 餐具組</label>
                </div>
            </div>
            <div class="checklist-section">
                <h4 class="checklist-category">衣物</h4>
                <div class="checklist-items">
                    <label class="checklist-item"><input type="checkbox"> 發熱衣 × 3</label>
                    <label class="checklist-item"><input type="checkbox"> 換洗衣物 × 5 套</label>
                    <label class="checklist-item"><input type="checkbox"> 睡衣</label>
                    <label class="checklist-item"><input type="checkbox"> 厚外套</label>
                </div>
            </div>
            <div class="checklist-section">
                <h4 class="checklist-category">外出用品</h4>
                <div class="checklist-items">
                    <label class="checklist-item"><input type="checkbox"> 揹巾</label>
                    <label class="checklist-item"><input type="checkbox"> 推車防風罩</label>
                    <label class="checklist-item"><input type="checkbox"> 厚毛毯</label>
                </div>
            </div>
            <div class="checklist-section">
                <h4 class="checklist-category">安撫物品</h4>
                <div class="checklist-items">
                    <label class="checklist-item"><input type="checkbox"> 安撫玩具</label>
                    <label class="checklist-item"><input type="checkbox"> 繪本</label>
                    <label class="checklist-item"><input type="checkbox"> 平板 (下載離線影片)</label>
                </div>
            </div>
            <div class="checklist-section">
                <h4 class="checklist-category">醫療用品</h4>
                <div class="checklist-items">
                    <label class="checklist-item"><input type="checkbox"> 退燒藥</label>
                    <label class="checklist-item"><input type="checkbox"> 止瀉藥</label>
                    <label class="checklist-item"><input type="checkbox"> OK繃</label>
                    <label class="checklist-item"><input type="checkbox"> 體溫計</label>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">餐廳注意事項</h3>
            </div>
            <div class="info-list">
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>選擇適合餐廳</strong>
                        <span>有兒童座椅 (ベビーチェア) 的餐廳</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>自備餐具</strong>
                        <span>攜帶餐具組和圍兜，避免弄髒衣物</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>準備零食</strong>
                        <span>應付等餐時間</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>行程餐廳</strong>
                        <span>已規劃的餐廳皆適合幼兒</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">作息注意事項</h3>
            </div>
            <div class="info-list">
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>午睡時間</strong>
                        <span>配合幼兒午睡安排交通移動</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>彈性休息</strong>
                        <span>建議 12:00-14:00 為彈性時段</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>晚餐時間</strong>
                        <span>建議 17:00-18:00，避免過晚影響就寢</span>
                    </div>
                </div>
                <div class="info-list-item">
                    <div class="info-list-content">
                        <strong>時差</strong>
                        <span>維持台灣作息即可 (日本僅快 1 小時)</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">哭鬧處理建議</h3>
            </div>
            <div class="situation-list">
                <div class="situation-item">
                    <span class="situation-label">公共場所</span>
                    <p>移動至安靜角落安撫，避免干擾他人</p>
                </div>
                <div class="situation-item">
                    <span class="situation-label">交通工具</span>
                    <p>準備零食、玩具、平板轉移注意力</p>
                </div>
                <div class="situation-item">
                    <span class="situation-label">疲累哭鬧</span>
                    <p>揹巾安撫或推車讓其休息</p>
                </div>
                <div class="situation-item">
                    <span class="situation-label">餐廳哭鬧</span>
                    <p>其中一人先帶離至戶外走動</p>
                </div>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">幼兒用品採買店家</h3>
            </div>
            <div class="shop-list">
                <div class="shop-detail">
                    <div class="shop-header">
                        <span class="shop-name">阿卡將本舖</span>
                        <span class="shop-location">LaLaport 3F</span>
                    </div>
                    <p class="shop-feature">品項最齊全</p>
                </div>
                <div class="shop-detail">
                    <div class="shop-header">
                        <span class="shop-name">赤ちゃんデパート水谷</span>
                        <span class="shop-location">AEON Mall 名古屋港</span>
                    </div>
                    <p class="shop-feature">尿布價格實惠</p>
                </div>
                <div class="shop-detail">
                    <div class="shop-header">
                        <span class="shop-name">千里馬藥局</span>
                        <span class="shop-location">名古屋車站附近 3F</span>
                    </div>
                    <p class="shop-feature">嬰兒用品 + 有中文店員</p>
                </div>
                <div class="shop-detail">
                    <div class="shop-header">
                        <span class="shop-name">西松屋</span>
                        <span class="shop-location">各地分店</span>
                    </div>
                    <p class="shop-feature">平價嬰幼兒服飾</p>
                </div>
            </div>
        </div>

        <div class="info-card highlight">
            <div class="info-card-header">
                <h3 class="info-card-title">建議日本採買物品</h3>
            </div>
            <div class="recommend-grid">
                <div class="recommend-item">
                    <span class="recommend-name">花王 Merries 尿布</span>
                </div>
                <div class="recommend-item">
                    <span class="recommend-name">貝親 Pigeon 奶瓶</span>
                </div>
                <div class="recommend-item">
                    <span class="recommend-name">和光堂副食品</span>
                </div>
                <div class="recommend-item">
                    <span class="recommend-name">PABRON 兒童感冒藥</span>
                </div>
                <div class="recommend-item">
                    <span class="recommend-name">池田模範堂止癢貼</span>
                </div>
                <div class="recommend-item">
                    <span class="recommend-name">幼兒零食 (米餅/小饅頭)</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 初始化頁面系統
 */
function initPages() {
    initSideDrawer();

    // 為每個頁面按鈕添加點擊切換事件
    document.querySelectorAll('.drawer-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            if (pageId) {
                switchPage(pageId);
            }
        });
    });
}

// Export for app.js
window.initPages = initPages;
window.switchPage = switchPage;
