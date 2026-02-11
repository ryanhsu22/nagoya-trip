/**
 * Map Management - 互動式地圖功能 (Google Maps API)
 */

// Lucide icon SVG paths (24x24 viewBox) - 官方版本
const LUCIDE_ICONS = {
    // Transport
    'plane': '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    'plane-landing': '<path d="M2 22h20"/><path d="M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s0 1.25 0 1.25L10 5l1.5 1.5L9 10H7l-.5 1-2.73-1.73Z"/><path d="M15.5 17H22l-2-4.5-5.5 1.5"/>',
    'plane-takeoff': '<path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55c.55-.28 1.25-.25 1.8 0l.17.1 4.93-2.47 1.5 1.5-6.5 5.82Z"/><path d="M22 6l-2 2-5-.5-4-4-1 1 3.5 4.5-5.5 3"/>',
    'train-front': '<path d="M8 3.5S6.5 3 6 3.5S5 5 5 5.5S5 7 5.5 7.5S7 8 7 8"/><path d="M16 3.5s1.5-.5 2 0s1 1.5 1 2s0 1.5-.5 2S17 8 17 8"/><rect width="10" height="12" x="7" y="8" rx="1"/><path d="M7 8h10"/><path d="M7 13h10"/><path d="m9.5 17-2 3"/><path d="m14.5 17 2 3"/>',
    'tram-front': '<rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/>',
    'car': '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.8-1.8-.8H5c-.6 0-1.1.2-1.4.6L1.3 10.4c-.2.3-.3.6-.3 1v5.7c0 .5.4.9.9.9H4"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    'car-taxi-front': '<path d="M10 2h4"/><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.354a2 2 0 0 0-1.854 1.3L5 10 3 8"/><path d="M21 14H3"/><path d="M3 17h18v4H3z"/><path d="M6 21v-4"/><path d="M18 21v-4"/>',

    // Food
    'utensils': '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    'beef': '<circle cx="12.5" cy="8.5" r="2.5"/><path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z"/><path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2.5 6.5 6.5 0 0 1-6.5 6.5"/>',
    'fish': '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/>',
    'fish-symbol': '<path d="M2 16s9-15 20-4C11 23 2 8 2 8"/>',
    'sandwich': '<path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3"/><path d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83"/><path d="m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z"/><path d="M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z"/>',
    'drumstick': '<path d="M15.45 15.4c-2.13.65-4.3.32-5.7-1.1-2.29-2.27-1.76-6.5 1.17-9.42 2.93-2.93 7.15-3.46 9.43-1.18 1.41 1.41 1.74 3.57 1.1 5.71-1.4-.51-3.26-.02-4.64 1.36-1.38 1.38-1.87 3.23-1.36 4.63Z"/><path d="m11.25 15.6-2.16 2.16a2.5 2.5 0 1 1-4.56 1.73 2.49 2.49 0 0 1-1.41-4.24 2.5 2.5 0 0 1 3.14-.32l2.16-2.16"/>',
    'soup': '<path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 21h10"/><path d="M19.5 12 22 6"/><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"/><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"/><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"/>',
    'disc': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/>',

    // Attractions
    'castle': '<path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M18 11V4H6v7"/><path d="M15 22v-4a3 3 0 0 0-6 0v4"/><path d="M22 11V9"/><path d="M2 11V9"/><path d="M6 4V2"/><path d="M18 4V2"/><path d="M10 4V2"/><path d="M14 4V2"/>',
    'landmark': '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    'blocks': '<rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/>',

    // Shopping
    'shopping-cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',

    // Hotel
    'bed-double': '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>',

    // Default
    'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
};

/**
 * 從 icon HTML 字串中解析 Lucide icon 名稱
 * @param {string} iconHtml - 例如 "<i data-lucide='plane-landing'></i>"
 * @returns {string} - icon 名稱，例如 "plane-landing"
 */
function parseLucideIconName(iconHtml) {
    if (!iconHtml) return 'map-pin';
    const match = iconHtml.match(/data-lucide=['"]([\w-]+)['"]/);
    return match ? match[1] : 'map-pin';
}

class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.infoWindow = null;
        this.routeLine = null;
        this.isInitialized = false;
        this.bounds = null;
        this.currentDayNumber = null; // 追蹤當前顯示的天數
    }

    /**
     * 初始化地圖
     * @param {Object} initialCenter - 可選，初始中心點 {lat, lng}
     * @param {number} initialZoom - 可選，初始 zoom 級別
     */
    init(initialCenter = null, initialZoom = 12) {
        if (this.isInitialized) return;

        // 預設名古屋市中心座標
        const center = initialCenter || { lat: 35.1709, lng: 136.8815 };

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: center,
            zoom: initialZoom,
            mapId: 'nagoya_trip_map',
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
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

        // 預設開啟大眾運輸圖層 (Transit Layer)
        this.transitLayer = new google.maps.TransitLayer();
        this.transitLayer.setMap(this.map);

        this.infoWindow = new google.maps.InfoWindow({
            disableAutoPan: false,
            maxWidth: 250
        });
        this.bounds = new google.maps.LatLngBounds();
        this.isInitialized = true;

        // 初始化搜尋列
        this.initSearch();
    }

    /**
     * 初始化搜尋列 (Autocomplete)
     */
    initSearch() {
        const input = document.getElementById('mapSearchInput');
        if (!input) return;

        // 限制搜尋範圍在名古屋附近 (可選)
        const nagoyaBounds = {
            north: 35.3,
            south: 35.0,
            east: 137.1,
            west: 136.7,
        };

        const autocomplete = new google.maps.places.Autocomplete(input, {
            bounds: nagoyaBounds,
            fields: ['geometry', 'name', 'formatted_address'],
            strictBounds: false,
        });

        // 搜尋結果處理
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                console.error("未找到該地點的座標資訊");
                return;
            }

            // 定位地圖
            if (place.geometry.viewport) {
                this.map.fitBounds(place.geometry.viewport);
            } else {
                this.map.setCenter(place.geometry.location);
                this.map.setZoom(17);
            }

            // 放置臨時搜尋標記
            this.addSearchMarker(place);
        });
    }

    /**
     * 增加搜尋結果標記
     */
    addSearchMarker(place) {
        // 移除舊的搜尋標記 (如果有)
        if (this.searchMarker) {
            this.searchMarker.setMap(null);
        }

        this.searchMarker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name,
            icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: '#FF6B35',
                fillOpacity: 1,
                strokeWeight: 2,   // 恢復外框線
                strokeColor: '#FFFFFF', // 改為白色外框
            },
            animation: google.maps.Animation.DROP
        });

        // 顯示資訊視窗
        const content = `
            <div class="gm-popup">
                <div class="gm-popup-title">${place.name}</div>
                <div class="gm-popup-time">${place.formatted_address || ''}</div>
            </div>
        `;
        this.infoWindow.setContent(content);
        this.infoWindow.open(this.map, this.searchMarker);
    }

    /**
     * 清理搜尋結果與狀態
     */
    clearSearch() {
        // 移除搜尋標記
        if (this.searchMarker) {
            this.searchMarker.setMap(null);
            this.searchMarker = null;
        }

        // 關閉資訊視窗
        if (this.infoWindow) {
            this.infoWindow.close();
        }

        // 清空輸入框
        const input = document.getElementById('mapSearchInput');
        if (input) {
            input.value = '';
            input.blur();
        }
    }

    /**
     * 建立自訂圖標 SVG (包含對應的 Lucide Icon)
     * @param {string} iconHtml - Icon HTML 字串 (例如 "<i data-lucide='castle'></i>")
     * @param {string} category - Event category (food, attraction, transport, etc.)
     */
    createMarkerIcon(iconHtml, category = 'attraction') {
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

        // 解析 Lucide icon 名稱
        const iconName = parseLucideIconName(iconHtml);
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
     * @param {Array} events - 事件陣列
     * @param {string} focusEventId - 如果指定，會直接聚焦到該事件而不是 fitBounds
     */
    loadDayEvents(events, focusEventId = null) {
        this.clearMarkers();

        const coordinates = [];
        let focusMarker = null;
        let focusPosition = null;

        // 追蹤座標以進行偏移
        const positionTracker = {};

        events.forEach((event, index) => {
            if (!event.coordinates) return;

            let lat = event.coordinates.lat;
            let lng = event.coordinates.lng;
            const posKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;

            // 如果有重複座標，進行偏移
            if (positionTracker[posKey] !== undefined) {
                positionTracker[posKey]++;
                const offset = positionTracker[posKey] * 0.0008; // 約 80 公尺偏移
                // 交錯偏移方向
                if (positionTracker[posKey] % 2 === 1) {
                    lat += offset;
                    lng += offset * 0.5;
                } else {
                    lat -= offset * 0.5;
                    lng += offset;
                }
            } else {
                positionTracker[posKey] = 0;
            }

            const position = { lat: lat, lng: lng };
            const icon = this.createMarkerIcon(event.icon, event.category);

            // 不使用 DROP 動畫，讓標記直接出現
            const marker = new google.maps.Marker({
                position: position,
                map: this.map,
                icon: icon,
                title: event.title
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

            // 記錄要聚焦的 marker
            if (event.id === focusEventId) {
                focusMarker = marker;
                focusPosition = position;
            }

            this.markers.push(marker);
            this.bounds.extend(position);
            coordinates.push(position);
        });

        // 繪製虛線路線
        if (coordinates.length > 1) {
            this.routeLine = new google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                strokeColor: '#FF4500',
                strokeOpacity: 0,  // 設為 0，用 icons 繪製虛線
                strokeWeight: 3,
                icons: [{
                    icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        strokeColor: '#FF4500',
                        scale: 3
                    },
                    offset: '0',
                    repeat: '12px'
                }]
            });
            this.routeLine.setMap(this.map);
        }

        // 如果有指定聚焦的事件，直接定位到該事件
        if (focusEventId && focusMarker && focusPosition) {
            // 先立即設定中心點（無動畫），再 zoom in
            this.map.setCenter(focusPosition);
            this.map.setZoom(15);

            // 讓 marker 彈跳與 InfoWindow 同時開啟，並統一步位時間
            setTimeout(() => {
                focusMarker.setAnimation(google.maps.Animation.BOUNCE);
                google.maps.event.trigger(focusMarker, 'click');

                // 0.6s 後停止彈跳，對齊 InfoWindow 的動畫呈現
                setTimeout(() => {
                    focusMarker.setAnimation(null);
                }, 600);
            }, 100);
        } else if (this.markers.length > 0) {
            // 沒有指定聚焦，則 fitBounds 顯示所有標記
            this.map.fitBounds(this.bounds, {
                top: 50, right: 50, bottom: 50, left: 50
            });
        }
    }

    /**
     * 聚焦到特定事件（平滑動畫）
     */
    focusEvent(eventId) {
        const marker = this.markers.find(m => m.eventId === eventId);
        if (marker) {
            const position = marker.getPosition();
            const currentZoom = this.map.getZoom();

            // 如果當前 zoom 較小（全域視角），先平滑移動再 zoom in
            if (currentZoom < 14) {
                // 先移動到目標位置（有動畫）
                this.map.panTo(position);
                // 等待移動完成後同時觸發
                setTimeout(() => {
                    this.map.setZoom(15);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    google.maps.event.trigger(marker, 'click');

                    setTimeout(() => {
                        marker.setAnimation(null);
                    }, 600);
                }, 300);
            } else {
                // 已經在較近的 zoom，直接定位並同步觸發
                this.map.setCenter(position);
                this.map.setZoom(15);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                google.maps.event.trigger(marker, 'click');

                setTimeout(() => {
                    marker.setAnimation(null);
                }, 600);
            }
        }
    }

    /**
     * 顯示/隱藏地圖面板
     * @param {Object} initialCenter - 可選，初始中心點 {lat, lng}
     * @param {number} initialZoom - 可選，初始 zoom 級別
     */
    toggle(initialCenter = null, initialZoom = 15) {
        const mapSection = document.getElementById('mapSection');
        const pageContainer = document.querySelector('.page-container');

        mapSection.classList.toggle('hidden');

        if (!mapSection.classList.contains('hidden')) {
            // 確保地圖初始化
            if (!this.isInitialized) {
                this.init(initialCenter, initialZoom);
            } else if (initialCenter) {
                // 地圖已初始化，但需要重新定位到新的中心點（避免跳轉）
                this.map.setCenter(initialCenter);
                this.map.setZoom(initialZoom);
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
    const dayNumber = window.currentDayNumber || 1;
    const dayData = window.scheduleManager?.getDayData(dayNumber) ||
        window.itineraryData?.days?.find(d => d.day === dayNumber);

    // 找到目標事件的座標
    let targetCenter = null;
    let targetEvent = null;
    if (dayData && dayData.events) {
        targetEvent = dayData.events.find(e => e.id === eventId);
        if (targetEvent && targetEvent.coordinates) {
            targetCenter = {
                lat: targetEvent.coordinates.lat,
                lng: targetEvent.coordinates.lng
            };
        }
    }

    // 同步：點擊特定卡片時，讓該卡片「浮起來」並捲動到上方區域正中央
    const focusedCard = document.querySelector(`.event-card[data-event-id=\"${eventId}\"]`);
    if (focusedCard) {
        // 移除其他卡片的 Focus 樣式
        document.querySelectorAll('.event-card').forEach(c => c.classList.remove('focused-float'));

        // 加入浮動樣式
        focusedCard.classList.add('focused-float');

        // 延遲一下捲動，確保地圖開啟的間距已由 CSS 更新
        setTimeout(() => {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            const mapHeight = mapSection.classList.contains('hidden') ? 0 : mapSection.offsetHeight;
            const viewAreaHeight = window.innerHeight - headerHeight - mapHeight;

            const cardRect = focusedCard.getBoundingClientRect();
            const scrollOffset = window.pageYOffset + cardRect.top - headerHeight - (viewAreaHeight / 2) + (cardRect.height / 2);

            window.scrollTo({
                top: scrollOffset,
                behavior: 'smooth'
            });
        }, 150); // 速度略快，速度感更好
    }

    // 只為當前點選的卡片的 MAP 按鈕添加 map-active 狀態
    document.querySelectorAll('.btn-map-tech').forEach(btn => btn.classList.remove('map-active'));
    if (focusedCard) {
        const btn = focusedCard.querySelector('.btn-map-tech');
        if (btn) btn.classList.add('map-active');
    }

    // 如果地圖隱藏，先找到目標事件的座標，再初始化地圖
    if (mapSection.classList.contains('hidden')) {
        // 以目標座標初始化地圖
        mapManager.toggle(targetCenter, 15);

        if (dayData && dayData.events) {
            // 等待地圖初始化完成後載入標記
            setTimeout(() => {
                mapManager.currentDayNumber = dayNumber;
                mapManager.loadDayEvents(dayData.events, eventId);
            }, 350);
        }
    } else {
        // 地圖已開啟，檢查是否需要重新載入標記（切換了 Day Tab）
        if (mapManager.currentDayNumber !== dayNumber) {
            // 天數變了，先定位到目標位置，再重新載入標記
            if (targetCenter) {
                mapManager.map.setCenter(targetCenter);
                mapManager.map.setZoom(15);
            }
            if (dayData && dayData.events) {
                mapManager.currentDayNumber = dayNumber;
                mapManager.loadDayEvents(dayData.events, eventId);
            }
        } else {
            // 同一天，直接聚焦（使用平滑動畫）
            mapManager.focusEvent(eventId);
        }
    }
}
