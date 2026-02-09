/**
 * Schedule Management - 行程進度與時間軸
 */

class ScheduleManager {
    constructor(itineraryData) {
        this.data = itineraryData;
        this.currentDay = 1;
        this.tripStartDate = new Date(this.data.trip.startDate);
        this.tripEndDate = new Date(this.data.trip.endDate);
    }

    /**
     * 取得目前是旅程的第幾天 (0 = 旅程未開始, -1 = 旅程已結束)
     */
    getCurrentTripDay() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (let i = 0; i < this.data.days.length; i++) {
            const dayDate = new Date(this.data.days[i].date);
            if (today.getTime() === dayDate.getTime()) {
                return i + 1;
            }
        }

        if (today < this.tripStartDate) return 0;
        if (today > this.tripEndDate) return -1;
        return 0;
    }

    /**
     * 取得指定天數的資料
     */
    getDayData(dayNumber) {
        return this.data.days.find(d => d.day === dayNumber);
    }

    /**
     * 計算當天行程進度 (0-100%)
     */
    calculateDayProgress(dayNumber) {
        const dayData = this.getDayData(dayNumber);
        if (!dayData) return 0;

        const now = new Date();
        const today = new Date(dayData.date);

        // 如果不是今天，返回 0% 或 100%
        if (now.toDateString() !== today.toDateString()) {
            return now < today ? 0 : 100;
        }

        const events = dayData.events;
        if (events.length === 0) return 0;

        // 取得第一個和最後一個活動時間
        const firstEventTime = this.parseTime(events[0].time, dayData.date);
        const lastEvent = events[events.length - 1];
        const lastEventEndTime = this.parseTime(lastEvent.endTime, dayData.date);

        if (now < firstEventTime) return 0;
        if (now > lastEventEndTime) return 100;

        // 計算進度
        const totalDuration = lastEventEndTime - firstEventTime;
        const elapsed = now - firstEventTime;
        return Math.round((elapsed / totalDuration) * 100);
    }

    /**
     * 取得當前進行中的活動
     */
    getCurrentEvent(dayNumber) {
        const dayData = this.getDayData(dayNumber);
        if (!dayData) return null;

        const now = new Date();
        const today = new Date(dayData.date);

        // 如果不是今天，返回 null
        if (now.toDateString() !== today.toDateString()) {
            return null;
        }

        for (const event of dayData.events) {
            const startTime = this.parseTime(event.time, dayData.date);
            const endTime = this.parseTime(event.endTime, dayData.date);

            if (now >= startTime && now <= endTime) {
                return event;
            }
        }
        return null;
    }

    /**
     * 取得即將到來的活動 (未來 30 分鐘內)
     */
    getUpcomingEvents(dayNumber, minutesAhead = 30) {
        const dayData = this.getDayData(dayNumber);
        if (!dayData) return [];

        const now = new Date();
        const today = new Date(dayData.date);

        if (now.toDateString() !== today.toDateString()) {
            return [];
        }

        const upcoming = [];
        const cutoffTime = new Date(now.getTime() + minutesAhead * 60000);

        for (const event of dayData.events) {
            const startTime = this.parseTime(event.time, dayData.date);

            if (startTime > now && startTime <= cutoffTime) {
                upcoming.push({
                    ...event,
                    minutesUntil: Math.round((startTime - now) / 60000)
                });
            }
        }
        return upcoming;
    }

    /**
     * 取得活動狀態 (completed, current, upcoming, future)
     */
    getEventStatus(event, dayData) {
        const now = new Date();
        const today = new Date(dayData.date);

        // 不是今天的情況
        if (now.toDateString() !== today.toDateString()) {
            return now > today ? 'completed' : 'future';
        }

        const startTime = this.parseTime(event.time, dayData.date);
        const endTime = this.parseTime(event.endTime, dayData.date);

        if (now > endTime) return 'completed';
        if (now >= startTime && now <= endTime) return 'current';

        // 15 分鐘內即將開始
        const fifteenMinutes = 15 * 60000;
        if (startTime - now <= fifteenMinutes && startTime > now) {
            return 'upcoming';
        }

        return 'future';
    }

    /**
     * 解析時間字串為 Date 物件
     */
    parseTime(timeStr, dateStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date(dateStr);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    /**
     * 格式化時間顯示
     */
    formatTime(date) {
        return date.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    /**
     * 取得進度狀態文字
     */
    getProgressStatusText(dayNumber) {
        const currentTripDay = this.getCurrentTripDay();

        if (currentTripDay === 0) {
            const daysUntil = Math.ceil((this.tripStartDate - new Date()) / (1000 * 60 * 60 * 24));
            return `距離出發還有 ${daysUntil} 天`;
        }

        if (currentTripDay === -1) {
            return '旅程已結束';
        }

        if (dayNumber !== currentTripDay) {
            return dayNumber < currentTripDay ? '已完成' : '尚未開始';
        }

        const currentEvent = this.getCurrentEvent(dayNumber);
        if (currentEvent) {
            return `進行中：${currentEvent.title}`;
        }

        const upcoming = this.getUpcomingEvents(dayNumber, 60);
        if (upcoming.length > 0) {
            return `下一站：${upcoming[0].title} (${upcoming[0].minutesUntil} 分鐘後)`;
        }

        const progress = this.calculateDayProgress(dayNumber);
        if (progress === 100) {
            return '今日行程已完成';
        }

        return '等待下一個行程';
    }
}

/**
 * 渲染時間軸
 */
function renderTimeline(scheduleManager, dayNumber) {
    const timeline = document.getElementById('timeline');
    const dayData = scheduleManager.getDayData(dayNumber);

    if (!dayData) {
        timeline.innerHTML = '<p class="no-events">此日無行程資料</p>';
        return;
    }

    timeline.innerHTML = dayData.events.map(event => {
        const status = scheduleManager.getEventStatus(event, dayData);
        const statusClass = status === 'current' ? 'current' :
            status === 'completed' ? 'completed' : '';

        return `
            <article class="event-card ${statusClass}" data-event-id="${event.id}">
                <div class="event-time">
                    <span>${event.time} - ${event.endTime}</span>
                    ${event.isReserved ? '<span class="reserved-badge">已訂位</span>' : ''}
                </div>
                <div class="event-header">
                    <span class="event-icon">${event.icon}</span>
                    <div class="event-title-group">
                        <h3 class="event-title">${event.title}</h3>
                        <span class="event-title-en">${event.titleEn}</span>
                    </div>
                </div>
                <p class="event-description">${event.description}</p>
                <div class="event-actions">
                    <button class="btn-map-tech" onclick="showEventOnMap('${event.id}')">
                        <span class="btn-map-dot"></span>
                        <span class="btn-map-text">MAP</span>
                        <span class="btn-map-line"></span>
                    </button>
                </div>
            </article>
        `;
    }).join('');
}

/**
 * 更新進度條
 */
function updateProgress(scheduleManager, dayNumber) {
    const progress = scheduleManager.calculateDayProgress(dayNumber);
    const statusText = scheduleManager.getProgressStatusText(dayNumber);

    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressPercent').textContent = `${progress}%`;
    document.getElementById('progressStatus').textContent = statusText;
}

/**
 * 更新當前時間顯示
 */
function updateCurrentTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('currentTime').textContent = timeStr;
}

// 導出供其他模組使用
window.ScheduleManager = ScheduleManager;
window.renderTimeline = renderTimeline;
window.updateProgress = updateProgress;
window.updateCurrentTime = updateCurrentTime;
