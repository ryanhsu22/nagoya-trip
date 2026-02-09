/**
 * Map Management - 互動式地圖功能 (Google Maps API)
 */

// Lucide icon SVG paths (24x24 viewBox)
const LUCIDE_ICONS = {
    // Transport
    'plane': '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    'train': '<path d="M8 3.5S6.5 3 6 3.5S5 5 5 5.5S5 7 5.5 7.5S7 8 7 8"/><path d="M16 3.5s1.5-.5 2 0s1 1.5 1 2s0 1.5-.5 2S17 8 17 8"/><rect width="10" height="12" x="7" y="8" rx="1"/><path d="M7 8h10"/><path d="M7 13h10"/><path d="m9.5 17-2 3"/><path d="m14.5 17 2 3"/>',

    // Food
    'utensils': '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    'beef': '<circle cx="12.5" cy="8.5" r="2.5"/><path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z"/><path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2.5 6.5 6.5 0 0 1-6.5 6.5"/>',

    // Attractions
    'castle': '<path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M18 11V4H6v7"/><path d="M15 22v-4a3 3 0 0 0-6 0v4"/><path d="M22 11V9"/><path d="M2 11V9"/><path d="M6 4V2"/><path d="M18 4V2"/><path d="M10 4V2"/><path d="M14 4V2"/>',
    'landmark': '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    'building': '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    'torii-gate': '<path d="M3 6h18"/><path d="M3 10h18"/><path d="M3 6v4"/><path d="M21 6v4"/><path d="M6 10v12"/><path d="M18 10v12"/><path d="M12 2v4"/>',

    // Shopping
    'shopping-cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',

    // Hotel
    'hotel': '<path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><path d="M8 7h.01"/><path d="M16 7h.01"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/>',

    // Default
    'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
};

// Map emoji to Lucide icon name
const EMOJI_TO_ICON = {
    '✈️': 'plane',
    '🏨': 'hotel',
    '🥩': 'utensils',
    '🏯': 'castle',
    '🍽️': 'utensils',
    '🏭': 'landmark',
    '🐟': 'utensils',
    '🧱': 'landmark',
    '🍔': 'utensils',
    '🚄': 'train',
    '🍣': 'utensils',
    '🐬': 'landmark',
    '🍜': 'utensils',
    '🛒': 'shopping-cart',
    '🍖': 'utensils',
    '⛩️': 'torii-gate',
    '🛫': 'plane'
};

class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.infoWindow = null;
        this.routeLine = null;
        this.isInitialized = false;
        this.bounds = null;
    }

    /**
     * 初始化地圖
     */
    init() {
        if (this.isInitialized) return;

        // 名古屋市中心座標
        const nagoyaCenter = { lat: 35.1709, lng: 136.8815 };

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: nagoyaCenter,
            zoom: 12,
            mapId: 'nagoya_trip_map',
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.icon",
                    "stylers": [{ "visibility": "on" }]
                }
            ]
        });

        this.infoWindow = new google.maps.InfoWindow({
            disableAutoPan: false,
            maxWidth: 250
        });
        this.bounds = new google.maps.LatLngBounds();
        this.isInitialized = true;
    }

    /**
     * 建立自訂圖標 SVG (包含 Lucide Icon)
     * @param {string} emoji - Emoji icon from data
     * @param {string} category - Event category (food, attraction, transport, etc.)
     */
    createMarkerIcon(emoji, category = 'attraction') {
        // 根據類別設定顏色
        let bgColor;
        switch (category) {
            case 'food':
                bgColor = '#DA7756';
                break;
            case 'attraction':
            case 'shopping':
            case 'transport':
            case 'hotel':
            default:
                bgColor = '#E9A23B';
                break;
        }

        // 取得對應的 Lucide icon path
        const iconName = EMOJI_TO_ICON[emoji] || 'map-pin';
        const iconPath = LUCIDE_ICONS[iconName] || LUCIDE_ICONS['map-pin'];

        // 創建 SVG 標記 (含白色 Lucide icon)
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="${bgColor}" stroke="white" stroke-width="2"/>
                <g transform="translate(8, 8)" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${iconPath}
                </g>
            </svg>
        `;

        return {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
        };
    }

    /**
     * 清除所有標記
     */
    clearMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];

        if (this.routeLine) {
            this.routeLine.setMap(null);
            this.routeLine = null;
        }

        if (this.bounds) {
            this.bounds = new google.maps.LatLngBounds();
        }
    }

    /**
     * 載入當天所有景點
     */
    loadDayEvents(events, currentEventId = null) {
        this.clearMarkers();

        const coordinates = [];

        events.forEach((event, index) => {
            if (!event.coordinates) return;

            const position = { lat: event.coordinates.lat, lng: event.coordinates.lng };
            const icon = this.createMarkerIcon(event.icon, event.category);

            const marker = new google.maps.Marker({
                position: position,
                map: this.map,
                icon: icon,
                title: event.title,
                animation: google.maps.Animation.DROP
            });

            // 建立彈出視窗內容 (緊湊型)
            const popupContent = `
                <div class="gm-popup">
                    <div class="gm-popup-title">${event.title}</div>
                    <div class="gm-popup-time">${event.time} - ${event.endTime}</div>
                </div>
            `;

            // 點擊標記時顯示 InfoWindow
            marker.addListener('click', () => {
                this.infoWindow.setContent(popupContent);
                this.infoWindow.open(this.map, marker);
            });

            // 儲存事件 ID 到 marker
            marker.eventId = event.id;

            this.markers.push(marker);
            this.bounds.extend(position);
            coordinates.push(position);
        });

        // 繪製路線
        if (coordinates.length > 1) {
            this.routeLine = new google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                strokeColor: '#FF4500',
                strokeOpacity: 0.7,
                strokeWeight: 3,
                icons: [{
                    icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        scale: 3
                    },
                    offset: '0',
                    repeat: '15px'
                }]
            });
            this.routeLine.setMap(this.map);
        }

        // 調整視野以顯示所有標記
        if (this.markers.length > 0) {
            this.map.fitBounds(this.bounds, {
                top: 50, right: 50, bottom: 50, left: 50
            });
        }
    }

    /**
     * 聚焦到特定事件
     */
    focusEvent(eventId) {
        const marker = this.markers.find(m => m.eventId === eventId);
        if (marker) {
            this.map.setZoom(15);
            this.map.panTo(marker.getPosition());

            // 觸發標記點擊事件
            google.maps.event.trigger(marker, 'click');
        }
    }

    /**
     * 顯示/隱藏地圖面板
     */
    toggle() {
        const mapSection = document.getElementById('mapSection');
        const pageContainer = document.querySelector('.page-container');

        mapSection.classList.toggle('hidden');

        if (!mapSection.classList.contains('hidden')) {
            // 確保地圖初始化
            if (!this.isInitialized) {
                this.init();
            }
            // 重新整理地圖尺寸
            setTimeout(() => {
                google.maps.event.trigger(this.map, 'resize');
            }, 300);

            // 添加 padding 讓內容可以滾動
            if (pageContainer) {
                pageContainer.classList.add('map-open');
            }
        } else {
            // 移除 padding
            if (pageContainer) {
                pageContainer.classList.remove('map-open');
            }
        }
    }

    /**
     * 隱藏地圖面板
     */
    hide() {
        const mapSection = document.getElementById('mapSection');
        const pageContainer = document.querySelector('.page-container');

        mapSection.classList.add('hidden');

        if (pageContainer) {
            pageContainer.classList.remove('map-open');
        }
    }
}

// 全域地圖管理器實例
window.mapManager = new MapManager();

/**
 * 在地圖上顯示特定事件
 */
function showEventOnMap(eventId) {
    const mapSection = document.getElementById('mapSection');

    // 如果地圖隱藏，先顯示並載入標記
    if (mapSection.classList.contains('hidden')) {
        mapManager.toggle();

        // 載入當日事件（使用全域變數）
        const dayNumber = window.currentDayNumber || 1;
        const dayData = window.scheduleManager?.getDayData(dayNumber) ||
            window.itineraryData?.days?.find(d => d.day === dayNumber);

        if (dayData && dayData.events) {
            // 等待地圖初始化完成後載入標記
            setTimeout(() => {
                mapManager.loadDayEvents(dayData.events);
                // 再等待標記載入後聚焦
                setTimeout(() => {
                    mapManager.focusEvent(eventId);
                }, 300);
            }, 350);
        } else {
            // 如果沒有資料，至少嘗試聚焦
            setTimeout(() => {
                mapManager.focusEvent(eventId);
            }, 400);
        }
    } else {
        mapManager.focusEvent(eventId);
    }
}

