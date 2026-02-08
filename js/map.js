/**
 * Map Management - 互動式地圖功能
 */

class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.markerGroup = null;
        this.routeLine = null;
        this.isInitialized = false;
    }

    /**
     * 初始化地圖
     */
    init() {
        if (this.isInitialized) return;

        // 名古屋市中心座標
        const nagoyaCenter = [35.1709, 136.8815];

        this.map = L.map('map', {
            center: nagoyaCenter,
            zoom: 12,
            zoomControl: true
        });

        // 使用 CartoDB Voyager (現代風格，穩定可靠)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(this.map);

        this.markerGroup = L.featureGroup().addTo(this.map);
        this.isInitialized = true;
    }

    /**
     * 清除所有標記
     */
    clearMarkers() {
        if (this.markerGroup) {
            this.markerGroup.clearLayers();
        }
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
            this.routeLine = null;
        }
        this.markers = [];
    }

    /**
     * 建立自訂圖標 (支援 Lucide Icons 和類別配色)
     * @param {string} iconHtml - Lucide icon HTML
     * @param {string} category - Event category (food, attraction, transport, etc.)
     */
    createCustomIcon(iconHtml, category = 'attraction') {
        const size = 36;
        const iconSize = 18;

        // 根據類別設定顏色
        let bgColor, borderColor, iconColor;
        switch (category) {
            case 'food':
                // 用餐: 橘色 (Claude 品牌色)
                bgColor = '#DA7756';
                borderColor = '#1A1A2E';
                iconColor = '#FFFFFF';
                break;
            case 'attraction':
            case 'transport':
            default:
                // 景點/機場: 金色
                bgColor = '#E9A23B';
                borderColor = '#1A1A2E';
                iconColor = '#1A1A2E';
                break;
        }

        return L.divIcon({
            className: 'custom-marker',
            html: `<div class="map-marker" style="
                width: ${size}px;
                height: ${size}px;
                background: ${bgColor};
                border: 3px solid ${borderColor};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 2px 2px 0 rgba(0,0,0,0.3);
                color: ${iconColor};
            "><span class="marker-icon" style="
                width: ${iconSize}px;
                height: ${iconSize}px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">${iconHtml}</span></div>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
        });
    }

    /**
     * 載入當天所有景點
     */
    loadDayEvents(events, currentEventId = null) {
        this.clearMarkers();

        const coordinates = [];

        events.forEach((event, index) => {
            if (!event.coordinates) return;

            const isActive = event.id === currentEventId;
            const icon = this.createCustomIcon(event.icon, event.category);

            const marker = L.marker(
                [event.coordinates.lat, event.coordinates.lng],
                { icon: icon }
            );

            // 建立彈出視窗
            const popupContent = `
                <div class="marker-popup">
                    <div class="marker-popup-title">${event.icon} ${event.title}</div>
                    <div class="marker-popup-time">${event.time} - ${event.endTime}</div>
                </div>
            `;
            marker.bindPopup(popupContent);

            // 儲存事件 ID 到 marker
            marker.eventId = event.id;

            this.markerGroup.addLayer(marker);
            this.markers.push(marker);
            coordinates.push([event.coordinates.lat, event.coordinates.lng]);
        });

        // 繪製路線
        if (coordinates.length > 1) {
            this.routeLine = L.polyline(coordinates, {
                color: '#FF4500',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10'
            }).addTo(this.map);
        }

        // 調整視野以顯示所有標記
        if (this.markers.length > 0) {
            this.map.fitBounds(this.markerGroup.getBounds(), {
                padding: [50, 50]
            });
        }

        // 渲染 Lucide Icons
        if (typeof lucide !== 'undefined') {
            setTimeout(() => {
                lucide.createIcons();
            }, 100);
        }
    }

    /**
     * 聚焦到特定事件
     */
    focusEvent(eventId) {
        const marker = this.markers.find(m => m.eventId === eventId);
        if (marker) {
            this.map.setView(marker.getLatLng(), 15, {
                animate: true
            });
            marker.openPopup();
        }
    }

    /**
     * 顯示/隱藏地圖面板
     */
    toggle() {
        const mapSection = document.getElementById('mapSection');
        mapSection.classList.toggle('hidden');

        if (!mapSection.classList.contains('hidden')) {
            // 確保地圖初始化
            if (!this.isInitialized) {
                this.init();
            }
            // 重新整理地圖尺寸
            setTimeout(() => {
                this.map.invalidateSize();
            }, 300);
        }
    }

    /**
     * 隱藏地圖面板
     */
    hide() {
        document.getElementById('mapSection').classList.add('hidden');
    }
}

// 全域地圖管理器實例
window.mapManager = new MapManager();

/**
 * 在地圖上顯示特定事件
 */
function showEventOnMap(eventId) {
    const mapSection = document.getElementById('mapSection');

    // 如果地圖隱藏，先顯示
    if (mapSection.classList.contains('hidden')) {
        mapManager.toggle();
        // 等待動畫完成後聚焦
        setTimeout(() => {
            mapManager.focusEvent(eventId);
        }, 400);
    } else {
        mapManager.focusEvent(eventId);
    }
}
