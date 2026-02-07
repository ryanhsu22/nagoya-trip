/**
 * Notifications Management - 行程提醒功能
 */

class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.scheduledReminders = new Map();
        this.reminderMinutesBefore = 15;
    }

    /**
     * 初始化通知權限
     */
    async init() {
        if (!('Notification' in window)) {
            console.log('此瀏覽器不支援通知功能');
            return false;
        }

        this.permission = Notification.permission;
        return this.permission === 'granted';
    }

    /**
     * 請求通知權限
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            alert('您的瀏覽器不支援通知功能');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === 'granted';
        } catch (error) {
            console.error('請求通知權限失敗:', error);
            return false;
        }
    }

    /**
     * 發送通知
     */
    sendNotification(title, options = {}) {
        if (this.permission !== 'granted') {
            console.log('通知權限未授予');
            return;
        }

        const defaultOptions = {
            icon: '🇯🇵',
            badge: '🇯🇵',
            tag: 'nagoya-trip',
            requireInteraction: false,
            ...options
        };

        try {
            new Notification(title, defaultOptions);
        } catch (error) {
            console.error('發送通知失敗:', error);
        }
    }

    /**
     * 設定行程提醒
     */
    setReminder(event, dateStr) {
        if (this.permission !== 'granted') {
            this.showPermissionModal();
            return false;
        }

        const [hours, minutes] = event.time.split(':').map(Number);
        const eventDate = new Date(dateStr);
        eventDate.setHours(hours, minutes, 0, 0);

        // 提前 15 分鐘提醒
        const reminderTime = new Date(eventDate.getTime() - this.reminderMinutesBefore * 60000);
        const now = new Date();

        if (reminderTime <= now) {
            alert(`此行程已經開始或即將開始，無法設定提醒。`);
            return false;
        }

        // 計算延遲時間
        const delay = reminderTime - now;

        // 清除舊的提醒（如果有的話）
        if (this.scheduledReminders.has(event.id)) {
            clearTimeout(this.scheduledReminders.get(event.id));
        }

        // 設定新提醒
        const timeoutId = setTimeout(() => {
            this.sendNotification(`${event.icon} ${event.title}`, {
                body: `將在 ${this.reminderMinutesBefore} 分鐘後開始\n${event.description}`,
                tag: event.id
            });
            this.scheduledReminders.delete(event.id);
        }, delay);

        this.scheduledReminders.set(event.id, timeoutId);

        // 顯示確認訊息
        const reminderTimeStr = reminderTime.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        alert(`✅ 已設定提醒！\n將在 ${reminderTimeStr} 通知您。`);

        return true;
    }

    /**
     * 取消提醒
     */
    cancelReminder(eventId) {
        if (this.scheduledReminders.has(eventId)) {
            clearTimeout(this.scheduledReminders.get(eventId));
            this.scheduledReminders.delete(eventId);
            return true;
        }
        return false;
    }

    /**
     * 顯示權限請求 Modal
     */
    showPermissionModal() {
        document.getElementById('notificationModal').classList.remove('hidden');
    }

    /**
     * 隱藏權限請求 Modal
     */
    hidePermissionModal() {
        document.getElementById('notificationModal').classList.add('hidden');
    }

    /**
     * 設定當日所有即將到來的行程提醒
     */
    setAllRemindersForDay(events, dateStr) {
        if (this.permission !== 'granted') {
            return 0;
        }

        const now = new Date();
        let count = 0;

        events.forEach(event => {
            const [hours, minutes] = event.time.split(':').map(Number);
            const eventDate = new Date(dateStr);
            eventDate.setHours(hours, minutes, 0, 0);

            // 只設定未來的行程
            if (eventDate > now) {
                this.setReminder(event, dateStr);
                count++;
            }
        });

        return count;
    }
}

// 全域通知管理器實例
window.notificationManager = new NotificationManager();

/**
 * 設定特定事件的提醒
 */
function setReminder(eventId) {
    // 從全域資料中找到事件
    if (!window.itineraryData || !window.currentDayNumber) {
        alert('無法設定提醒：資料未載入');
        return;
    }

    const dayData = window.itineraryData.days.find(d => d.day === window.currentDayNumber);
    if (!dayData) {
        alert('無法設定提醒：找不到當日資料');
        return;
    }

    const event = dayData.events.find(e => e.id === eventId);
    if (!event) {
        alert('無法設定提醒：找不到行程');
        return;
    }

    notificationManager.setReminder(event, dayData.date);
}
