/**
 * Utility Functions for Patel Productivity Suite
 * Contains helper functions used across the application
 */

const Utils = {
    /**
     * Generate a unique ID
     * @returns {string} Unique ID
     */
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    /**
     * Format date to YYYY-MM-DD
     * @param {Date} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate: (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Format time to HH:MM
     * @param {Date} date - Date to format
     * @returns {string} Formatted time
     */
    formatTime: (date) => {
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    /**
     * Format date and time to YYYY-MM-DD HH:MM
     * @param {Date} date - Date to format
     * @returns {string} Formatted date and time
     */
    formatDateTime: (date) => {
        return `${Utils.formatDate(date)} ${Utils.formatTime(date)}`;
    },

    /**
     * Format relative time (e.g., "2 days ago")
     * @param {Date|string} date - Date to format
     * @returns {string} Relative time
     */
    formatRelativeTime: (date) => {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        const diffMonth = Math.floor(diffDay / 30);
        const diffYear = Math.floor(diffMonth / 12);

        if (diffSec < 60) {
            return 'just now';
        } else if (diffMin < 60) {
            return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        } else if (diffHour < 24) {
            return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        } else if (diffDay < 30) {
            return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        } else if (diffMonth < 12) {
            return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
        } else {
            return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
        }
    },

    /**
     * Debounce function to limit how often a function can be called
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function to limit how often a function can be called
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    },

    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, warning, error)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification: (message, type = 'success', duration = 3000) => {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    },

    /**
     * Check if the browser supports a specific feature
     * @param {string} feature - Feature to check
     * @returns {boolean} Whether the feature is supported
     */
    isFeatureSupported: (feature) => {
        switch (feature) {
            case 'indexedDB':
                return !!window.indexedDB;
            case 'localStorage':
                return !!window.localStorage;
            case 'serviceWorker':
                return 'serviceWorker' in navigator;
            case 'webSpeech':
                return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
            case 'notifications':
                return 'Notification' in window;
            case 'vibration':
                return 'vibrate' in navigator;
            case 'fileSystem':
                return 'showOpenFilePicker' in window;
            default:
                return false;
        }
    },

    /**
     * Request permission for a feature
     * @param {string} feature - Feature to request permission for
     * @returns {Promise} Promise that resolves with the permission status
     */
    requestPermission: async (feature) => {
        switch (feature) {
            case 'notifications':
                return await Notification.requestPermission();
            default:
                return 'denied';
        }
    },

    /**
     * Save data to localStorage
     * @param {string} key - Key to save under
     * @param {*} value - Value to save
     */
    saveToLocalStorage: (key, value) => {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    /**
     * Load data from localStorage
     * @param {string} key - Key to load
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Loaded value or default value
     */
    loadFromLocalStorage: (key, defaultValue = null) => {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return defaultValue;
            }
            return JSON.parse(serializedValue);
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Download data as a file
     * @param {Object} data - Data to download
     * @param {string} filename - Filename
     */
    downloadData: (data, filename) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Read a file as text
     * @param {File} file - File to read
     * @returns {Promise} Promise that resolves with the file content
     */
    readFileAsText: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsText(file);
        });
    },

    /**
     * Get the current theme
     * @returns {string} Current theme ('light' or 'dark')
     */
    getCurrentTheme: () => {
        return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    },

    /**
     * Set the theme
     * @param {string} theme - Theme to set ('light', 'dark', or 'system')
     */
    setTheme: (theme) => {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }

        if (theme === 'dark') {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            document.getElementById('theme-stylesheet').href = 'css/dark-mode.css';
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            document.getElementById('theme-stylesheet').href = 'css/light-mode.css';
        }

        Utils.saveToLocalStorage('theme', theme);
    },

    /**
     * Get the day of the week
     * @param {Date} date - Date
     * @returns {string} Day of the week
     */
    getDayOfWeek: (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(date).getDay()];
    },

    /**
     * Get the month name
     * @param {Date} date - Date
     * @returns {string} Month name
     */
    getMonthName: (date) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[new Date(date).getMonth()];
    },

    /**
     * Calculate the difference in days between two dates
     * @param {Date} date1 - First date
     * @param {Date} date2 - Second date
     * @returns {number} Difference in days
     */
    daysBetween: (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    /**
     * Check if a date is today
     * @param {Date} date - Date to check
     * @returns {boolean} Whether the date is today
     */
    isToday: (date) => {
        const today = new Date();
        const d = new Date(date);
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    },

    /**
     * Check if a date is in the past
     * @param {Date} date - Date to check
     * @returns {boolean} Whether the date is in the past
     */
    isPast: (date) => {
        return new Date(date) < new Date();
    },

    /**
     * Check if a date is in the future
     * @param {Date} date - Date to check
     * @returns {boolean} Whether the date is in the future
     */
    isFuture: (date) => {
        return new Date(date) > new Date();
    }
};

window.Utils = Utils; // Make available globally
