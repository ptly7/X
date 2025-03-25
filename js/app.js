/**
 * Main Application for Patel Productivity Suite
 * Initializes the application and handles global functionality
 */

class App {
    constructor() {
        this.initialized = false;
        this.offlineReady = false;
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            // Initialize database
            await window.PatelDB.init();
            
            // Load settings
            await this.loadSettings();
            
            // Check feature support
            this.checkFeatureSupport();
            
            // Register service worker if supported
            if (Utils.isFeatureSupported('serviceWorker')) {
                this.registerServiceWorker();
            }
            
            // Initialize PatelBot
            this.initPatelBot();
            
            this.initialized = true;
            console.log('Patel Productivity Suite initialized successfully');
            
            // Show welcome message if first time
            const isFirstVisit = Utils.loadFromLocalStorage('firstVisit', true);
            if (isFirstVisit) {
                this.showWelcomeMessage();
                Utils.saveToLocalStorage('firstVisit', false);
            }
        } catch (error) {
            console.error('Error initializing application:', error);
            this.showErrorMessage('Failed to initialize application. Please refresh the page and try again.');
        }
    }
    
    /**
     * Load application settings
     */
    async loadSettings() {
        try {
            // Get settings from database or create default settings
            let settings = await window.PatelDB.getAll('settings');
            
            if (settings.length === 0) {
                // Create default settings
                const defaultSettings = {
                    id: 'app-settings',
                    theme: 'light',
                    notifications: true,
                    sounds: true,
                    autoBackup: false,
                    backupInterval: 7, // days
                    lastBackup: null,
                    language: 'en',
                    dateFormat: 'YYYY-MM-DD',
                    timeFormat: '24h',
                    startPage: 'dashboard'
                };
                
                await window.PatelDB.add('settings', defaultSettings);
                settings = [defaultSettings];
            }
            
            // Apply settings
            const appSettings = settings[0];
            
            // Apply theme
            Utils.setTheme(appSettings.theme);
            
            return appSettings;
        } catch (error) {
            console.error('Error loading settings:', error);
            return null;
        }
    }
    
    /**
     * Check browser feature support
     */
    checkFeatureSupport() {
        const features = [
            'indexedDB',
            'localStorage',
            'serviceWorker',
            'webSpeech',
            'notifications',
            'vibration',
            'fileSystem'
        ];
        
        const supportStatus = {};
        
        features.forEach(feature => {
            supportStatus[feature] = Utils.isFeatureSupported(feature);
        });
        
        console.log('Feature support status:', supportStatus);
        
        // Show warning for critical features
        if (!supportStatus.indexedDB || !supportStatus.localStorage) {
            this.showErrorMessage('Your browser does not support essential features (IndexedDB or LocalStorage). The application may not function correctly.');
        }
    }
    
    /**
     * Register service worker
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);
                        this.offlineReady = true;
                        this.updateOfflineStatus();
                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                    });
            });
            
            // Listen for service worker updates
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service Worker updated');
            });
        }
    }
    
    /**
     * Update offline status indicator
     */
    updateOfflineStatus() {
        const statusIcon = document.querySelector('.offline-status .status-icon');
        const statusText = document.querySelector('.offline-status .status-text');
        
        if (this.offlineReady) {
            statusIcon.textContent = '🟢';
            statusText.textContent = 'Offline Ready';
        } else {
            statusIcon.textContent = '🟠';
            statusText.textContent = 'Online Only';
        }
    }
    
    /**
     * Initialize PatelBot
     */
    initPatelBot() {
        // Add PatelBot button to bottom right
        const patelBotButton = document.createElement('button');
        patelBotButton.id = 'patelbot-button';
        patelBotButton.className = 'patelbot-button';
        patelBotButton.innerHTML = '<span>🤖</span>';
        patelBotButton.title = 'Open PatelBot';
        document.body.appendChild(patelBotButton);
        
        // Add event listener
        patelBotButton.addEventListener('click', () => {
            window.UI.openModal(document.getElementById('patelbot-modal'));
        });
    }
    
    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const welcomeMessage = `
            <h3>Welcome to Patel Productivity Suite!</h3>
            <p>This is your all-in-one productivity solution that works completely offline.</p>
            <p>Get started by exploring the different modules in the sidebar.</p>
            <p>Need help? Click the PatelBot button in the bottom right corner.</p>
        `;
        
        const welcomeModal = document.createElement('div');
        welcomeModal.className = 'modal active';
        welcomeModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="welcome-content">
                    ${welcomeMessage}
                    <button class="btn primary" id="welcome-ok-btn">Get Started</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(welcomeModal);
        
        // Add event listeners
        welcomeModal.querySelector('.close-modal').addEventListener('click', () => {
            welcomeModal.remove();
        });
        
        welcomeModal.querySelector('#welcome-ok-btn').addEventListener('click', () => {
            welcomeModal.remove();
        });
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showErrorMessage(message) {
        const errorModal = document.createElement('div');
        errorModal.className = 'modal active';
        errorModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="error-content">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button class="btn primary" id="error-ok-btn">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorModal);
        
        // Add event listeners
        errorModal.querySelector('.close-modal').addEventListener('click', () => {
            errorModal.remove();
        });
        
        errorModal.querySelector('#error-ok-btn').addEventListener('click', () => {
            errorModal.remove();
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.PatelApp = new App();
});
