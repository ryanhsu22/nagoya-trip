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

        // 使用 Esri World Street Map (類似 Google Maps，資訊豐富)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ',
            maxZoom: 18
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
     * 建立自訂圖標
     */
    createCustomIcon(emoji, isActive = false) {
        const size = isActive ? 40 : 32;
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width: ${size}px;
                height: ${size}px;
                background: ${isActive ? '#FF4500' : '#000000'};
                border: 3px solid ${isActive ? '#000000' : '#FFFFFF'};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${isActive ? '20px' : '16px'};
                box-shadow: 2px 2px 0 rgba(0,0,0,0.3);
            ">${emoji}</div>`,
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
            const icon = this.createCustomIcon(event.icon, isActive);

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
