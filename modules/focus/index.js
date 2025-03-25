/* Focus Mode Module for Patel Productivity Suite */

const focusModule = {
    // Store DOM elements
    elements: {},
    
    // Focus data
    focusSession: null,
    timerInterval: null,
    timerRunning: false,
    timerPaused: false,
    focusSessions: [],
    
    // Timer settings
    settings: {
        focusDuration: 25 * 60, // 25 minutes in seconds
        breakDuration: 5 * 60,  // 5 minutes in seconds
        longBreakDuration: 15 * 60, // 15 minutes in seconds
        sessionsBeforeLongBreak: 4,
        autoStartBreaks: true,
        autoStartPomodoros: false,
        playSound: true,
        showNotifications: true,
        whiteNoiseEnabled: false,
        currentWhiteNoise: 'rain'
    },
    
    // Audio elements
    audio: {
        timer: null,
        whiteNoise: null
    },
    
    // Initialize the module
    init: async function(container) {
        console.log('Initializing Focus module');
        
        // Render the module UI
        this.render(container);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load settings
        await this.loadSettings();
        
        // Load focus sessions
        await this.loadFocusSessions();
        
        // Initialize audio
        this.initAudio();
        
        // Update UI
        this.updateUI();
    },
    
    // Render the module UI
    render: function(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>Focus Mode</h2>
                <div class="module-actions">
                    <button id="settings-btn" class="btn">⚙️ Settings</button>
                </div>
            </div>
            
            <div class="focus-container">
                <div class="focus-timer-container">
                    <div class="timer-display">
                        <div class="timer-label" id="timer-label">Focus Time</div>
                        <div class="timer-time" id="timer-time">25:00</div>
                        <div class="timer-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="timer-progress"></div>
                            </div>
                        </div>
                        <div class="timer-session" id="timer-session">Session 1/4</div>
                    </div>
                    
                    <div class="timer-controls">
                        <button id="start-btn" class="btn primary">Start</button>
                        <button id="pause-btn" class="btn" disabled>Pause</button>
                        <button id="reset-btn" class="btn">Reset</button>
                    </div>
                    
                    <div class="white-noise-controls">
                        <div class="white-noise-toggle">
                            <label for="white-noise-toggle">White Noise</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="white-noise-toggle">
                                <span class="toggle-slider"></span>
                            </div>
                        </div>
                        <select id="white-noise-select" disabled>
                            <option value="rain">Rain</option>
                            <option value="waves">Ocean Waves</option>
                            <option value="forest">Forest</option>
                            <option value="cafe">Cafe</option>
                            <option value="whitenoise">White Noise</option>
                        </select>
                        <input type="range" id="white-noise-volume" min="0" max="100" value="50" disabled>
                    </div>
                </div>
                
                <div class="focus-stats-container">
                    <h3>Focus Statistics</h3>
                    <div class="stats-cards">
                        <div class="stats-card">
                            <div class="stats-title">Today</div>
                            <div id="today-stats" class="stats-content">
                                <div class="stats-number">0</div>
                                <div class="stats-label">minutes focused</div>
                            </div>
                        </div>
                        <div class="stats-card">
                            <div class="stats-title">This Week</div>
                            <div id="week-stats" class="stats-content">
                                <div class="stats-number">0</div>
                                <div class="stats-label">minutes focused</div>
                            </div>
                        </div>
                        <div class="stats-card">
                            <div class="stats-title">Total</div>
                            <div id="total-stats" class="stats-content">
                                <div class="stats-number">0</div>
                                <div class="stats-label">sessions completed</div>
                            </div>
                        </div>
                    </div>
                    <div class="stats-chart-container">
                        <canvas id="focus-chart"></canvas>
                    </div>
                </div>
                
                <div class="focus-history-container">
                    <h3>Recent Sessions</h3>
                    <div id="focus-history" class="focus-history">
                        <div class="loading">Loading sessions...</div>
                    </div>
                </div>
            </div>
            
            <!-- Settings Modal -->
            <div id="focus-settings-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Focus Settings</h3>
                    <form id="focus-settings-form">
                        <div class="form-group">
                            <label for="focus-duration">Focus Duration (minutes)</label>
                            <input type="number" id="focus-duration" min="1" max="60" value="25">
                        </div>
                        <div class="form-group">
                            <label for="break-duration">Short Break Duration (minutes)</label>
                            <input type="number" id="break-duration" min="1" max="30" value="5">
                        </div>
                        <div class="form-group">
                            <label for="long-break-duration">Long Break Duration (minutes)</label>
                            <input type="number" id="long-break-duration" min="5" max="60" value="15">
                        </div>
                        <div class="form-group">
                            <label for="sessions-before-long-break">Sessions Before Long Break</label>
                            <input type="number" id="sessions-before-long-break" min="1" max="10" value="4">
                        </div>
                        <div class="form-group">
                            <label for="auto-start-breaks">Auto-start Breaks</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="auto-start-breaks" checked>
                                <span class="toggle-slider"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="auto-start-pomodoros">Auto-start Focus Sessions</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="auto-start-pomodoros">
                                <span class="toggle-slider"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="play-sound">Play Sound</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="play-sound" checked>
                                <span class="toggle-slider"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="show-notifications">Show Notifications</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="show-notifications" checked>
                                <span class="toggle-slider"></span>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="settings-cancel-btn" class="btn">Cancel</button>
                            <button type="submit" id="settings-save-btn" class="btn primary">Save Settings</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Distraction Blocker Modal -->
            <div id="distraction-blocker" class="distraction-blocker">
                <div class="blocker-content">
                    <h2>Focus Mode Active</h2>
                    <div id="blocker-timer" class="blocker-timer">25:00</div>
                    <p>Stay focused! You can do it!</p>
                    <button id="blocker-pause-btn" class="btn">Pause</button>
                    <button id="blocker-stop-btn" class="btn danger">Stop Session</button>
                </div>
            </div>
        `;
        
        // Store DOM elements
        this.elements = {
            timerLabel: document.getElementById('timer-label'),
            timerTime: document.getElementById('timer-time'),
            timerProgress: document.getElementById('timer-progress'),
            timerSession: document.getElementById('timer-session'),
            startBtn: document.getElementById('start-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            resetBtn: document.getElementById('reset-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            whiteNoiseToggle: document.getElementById('white-noise-toggle'),
            whiteNoiseSelect: document.getElementById('white-noise-select'),
            whiteNoiseVolume: document.getElementById('white-noise-volume'),
            todayStats: document.getElementById('today-stats').querySelector('.stats-number'),
            weekStats: document.getElementById('week-stats').querySelector('.stats-number'),
            totalStats: document.getElementById('total-stats').querySelector('.stats-number'),
            focusChart: document.getElementById('focus-chart'),
            focusHistory: document.getElementById('focus-history'),
            settingsModal: document.getElementById('focus-settings-modal'),
            settingsForm: document.getElementById('focus-settings-form'),
            focusDuration: document.getElementById('focus-duration'),
            breakDuration: document.getElementById('break-duration'),
            longBreakDuration: document.getElementById('long-break-duration'),
            sessionsBeforeLongBreak: document.getElementById('sessions-before-long-break'),
            autoStartBreaks: document.getElementById('auto-start-breaks'),
            autoStartPomodoros: document.getElementById('auto-start-pomodoros'),
            playSound: document.getElementById('play-sound'),
            showNotifications: document.getElementById('show-notifications'),
            settingsCancelBtn: document.getElementById('settings-cancel-btn'),
            settingsSaveBtn: document.getElementById('settings-save-btn'),
            closeModal: document.querySelector('#focus-settings-modal .close-modal'),
            distractionBlocker: document.getElementById('distraction-blocker'),
            blockerTimer: document.getElementById('blocker-timer'),
            blockerPauseBtn: document.getElementById('blocker-pause-btn'),
            blockerStopBtn: document.getElementById('blocker-stop-btn')
        };
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Timer controls
        this.elements.startBtn.addEventListener('click', () => {
            this.startTimer();
        });
        
        this.elements.pauseBtn.addEventListener('click', () => {
            this.pauseTimer();
        });
        
        this.elements.resetBtn.addEventListener('click', () => {
            this.resetTimer();
        });
        
        // Settings button
        this.elements.settingsBtn.addEventListener('click', () => {
            this.openSettingsModal();
        });
        
        // White noise controls
        this.elements.whiteNoiseToggle.addEventListener('change', () => {
            this.toggleWhiteNoise();
        });
        
        this.elements.whiteNoiseSelect.addEventListener('change', () => {
            this.changeWhiteNoise();
        });
        
        this.elements.whiteNoiseVolume.addEventListener('input', () => {
            this.adjustWhiteNoiseVolume();
        });
        
        // Close modal
        this.elements.closeModal.addEventListener('click', () => {
            this.closeSettingsModal();
        });
        
        // Cancel button
        this.elements.settingsCancelBtn.addEventListener('click', () => {
            this.closeSettingsModal();
        });
        
        // Settings form submission
        this.elements.settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
        
        // Blocker controls
        this.elements.blockerPauseBtn.addEventListener('click', () => {
            this.pauseTimer();
        });
        
        this.elements.blockerStopBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to stop the focus session?')) {
                this.stopTimer();
            }
        });
        
        // Request notification permission
        if (Utils.isFeatureSupported('notifications') && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    },
    
    // Load settings from database
    loadSettings: async function() {
        try {
            const settings = await window.PatelDB.getAll('settings');
            
            // Find focus settings
            const focusSettings = settings.find(setting => setting.id === 'focus-settings');
            
            if (focusSettings) {
                this.settings = { ...this.settings, ...focusSettings };
            } else {
                // Save default settings
                await window.PatelDB.add('settings', { id: 'focus-settings', ...this.settings });
            }
            
            // Update settings form
            this.updateSettingsForm();
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    },
    
    // Load focus sessions from database
    loadFocusSessions: async function() {
        try {
            this.focusSessions = await window.PatelDB.getAll('focusSessions');
            
            // Update statistics
            this.updateStatistics();
            
            // Render focus history
            this.renderFocusHistory();
            
            // Update chart
            this.updateChart();
        } catch (error) {
            console.error('Error loading focus sessions:', error);
            this.focusSessions = [];
        }
    },
    
    // Initialize audio
    initAudio: function() {
        // Timer sound
        this.audio.timer = new Audio('/assets/timer-complete.mp3');
        
        // White noise
        this.audio.whiteNoise = new Audio('/assets/white-noise/rain.mp3');
        this.audio.whiteNoise.loop = true;
    },
    
    // Update UI
    updateUI: function() {
        // Update timer display
        this.updateTimerDisplay();
        
        // Update session display
        this.updateSessionDisplay();
    },
    
    // Update timer display
    updateTimerDisplay: function() {
        if (!this.focusSession) {
            // Default display
            this.elements.timerLabel.textContent = 'Focus Time';
            this.elements.timerTime.textContent = this.formatTime(this.settings.focusDuration);
            this.elements.timerProgress.style.width = '0%';
            return;
        }
        
        // Calculate remaining time
        const elapsed = Math.floor((Date.now() - this.focusSession.startTime) / 1000);
        let remaining;
        let total;
        let label;
        
        if (this.focusSession.type === 'focus') {
            label = 'Focus Time';
            total = this.settings.focusDuration;
        } else if (this.focusSession.type === 'break') {
            label = 'Short Break';
            total = this.settings.breakDuration;
        } else if (this.focusSession.type === 'longBreak') {
            label = 'Long Break';
            total = this.settings.longBreakDuration;
        }
        
        remaining = Math.max(0, total - elapsed);
        
        // Update display
        this.elements.timerLabel.textContent = label;
        this.elements.timerTime.textContent = this.formatTime(remaining);
        this.elements.blockerTimer.textContent = this.formatTime(remaining);
        
        // Update progress bar
        const progress = Math.min(100, (elapsed / total) * 100);
        this.elements.timerProgress.style.width = `${progress}%`;
        
        // Check if timer is complete
        if (remaining === 0 && this.timerRunning) {
            this.timerComplete();
        }
    },
    
    // Update session display
    updateSessionDisplay: function() {
        const currentSession = this.focusSession ? this.focusSession.session : 1;
        this.elements.timerSession.textContent = `Session ${currentSession}/${this.settings.sessionsBeforeLongBreak}`;
    },
    
    // Start timer
    startTimer: function() {
        if (this.timerRunning && !this.timerPaused) {
            return;
        }
        
        if (this.timerPaused) {
            // Resume timer
            this.focusSession.startTime = Date.now() - this.focusSession.elapsedTime * 1000;
            this.timerPaused = false;
        } else {
            // Start new session
            this.focusSession = {
                type: 'focus',
                startTime: Date.now(),
                elapsedTime: 0,
                session: this.focusSession ? this.focusSession.session : 1
            };
            
            // Show distraction blocker
            this.elements.distractionBlocker.classList.add('active');
        }
        
        // Update UI
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;
        this.timerRunning = true;
        
        // Start interval
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    },
    
    // Pause timer
    pauseTimer: function() {
        if (!this.timerRunning || this.timerPaused) {
            return;
        }
        
        // Calculate elapsed time
        const elapsed = Math.floor((Date.now() - this.focusSession.startTime) / 1000);
        this.focusSession.elapsedTime = elapsed;
        
        // Update UI
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.timerPaused = true;
        
        // Clear interval
        clearInterval(this.timerInterval);
        
        // Hide distraction blocker
        this.elements.distractionBlocker.classList.remove('active');
    },
    
    // Reset timer
    resetTimer: function() {
        // Stop timer
        this.stopTimer();
        
        // Reset session
        this.focusSession = null;
        
        // Update UI
        this.updateUI();
    },
    
    // Stop timer
    stopTimer: function() {
        if (!this.timerRunning) {
            return;
        }
        
        // Clear interval
        clearInterval(this.timerInterval);
        
        // Update UI
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.timerRunning = false;
        this.timerPaused = false;
        
        // Hide distraction blocker
        this.elements.distractionBlocker.classList.remove('active');
    },
    
    // Timer complete
    timerComplete: function() {
        // Stop timer
        this.stopTimer();
        
        // Play sound
        if (this.settings.playSound) {
            this.audio.timer.play().catch(e => console.log('Error playing sound:', e));
        }
        
        // Show notification
        if (this.settings.showNotifications && Notification.permission === 'granted') {
            const title = this.focusSession.type === 'focus' ? 'Focus Session Complete!' : 'Break Complete!';
            const message = this.focusSession.type === 'focus' ? 'Time for a break!' : 'Time to focus!';
            
            const notification = new Notification(title, {
                body: message,
                icon: '/assets/logo.svg'
            });
            
            // Vibrate if supported
            if (Utils.isFeatureSupported('vibration')) {
                navigator.vibrate([200, 100, 200]);
            }
        }
        
        // Save focus session if it was a focus session
        if (this.focusSession.type === 'focus') {
            this.saveFocusSession();
        }
        
        // Start next session
        if (this.focusSession.type === 'focus') {
            // Check if it's time for a long break
            if (this.focusSession.session % this.settings.sessionsBeforeLongBreak === 0) {
                this.focusSession = {
                    type: 'longBreak',
                    startTime: Date.now(),
                    elapsedTime: 0,
                    session: this.focusSession.session
                };
            } else {
                this.focusSession = {
                    type: 'break',
                    startTime: Date.now(),
                    elapsedTime: 0,
                    session: this.focusSession.session
                };
            }
            
            // Auto-start break if enabled
            if (this.settings.autoStartBreaks) {
                this.startTimer();
            }
        } else {
            // Increment session counter
            this.focusSession = {
                type: 'focus',
                startTime: Date.now(),
                elapsedTime: 0,
                session: this.focusSession.session + 1
            };
            
            // Auto-start focus if enabled
            if (this.settings.autoStartPomodoros) {
                this.startTimer();
            }
        }
        
        // Update UI
        this.updateUI();
    },
    
    // Save focus session
    saveFocusSession: async function() {
        try {
            const session = {
                startTime: new Date(this.focusSession.startTime).toISOString(),
                endTime: new Date().toISOString(),
                duration: this.settings.focusDuration,
                completed: true
            };
            
            await window.PatelDB.add('focusSessions', session);
            
            // Reload sessions
            await this.loadFocusSessions();
        } catch (error) {
            console.error('Error saving focus session:', error);
        }
    },
    
    // Update statistics
    updateStatistics: function() {
        // Calculate today's focus time
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayFocusTime = this.focusSessions
            .filter(session => new Date(session.startTime) >= today)
            .reduce((total, session) => total + session.duration, 0);
        
        // Calculate this week's focus time
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);
        
        const weekFocusTime = this.focusSessions
            .filter(session => new Date(session.startTime) >= weekStart)
            .reduce((total, session) => total + session.duration, 0);
        
        // Calculate total sessions
        const totalSessions = this.focusSessions.length;
        
        // Update UI
        this.elements.todayStats.textContent = Math.floor(todayFocusTime / 60);
        this.elements.weekStats.textContent = Math.floor(weekFocusTime / 60);
        this.elements.totalStats.textContent = totalSessions;
    },
    
    // Render focus history
    renderFocusHistory: function() {
        if (this.focusSessions.length === 0) {
            this.elements.focusHistory.innerHTML = '<div class="empty-state">No focus sessions yet</div>';
            return;
        }
        
        // Sort sessions by date (newest first)
        const sortedSessions = [...this.focusSessions].sort((a, b) => {
            return new Date(b.startTime) - new Date(a.startTime);
        });
        
        // Take last 10 sessions
        const recentSessions = sortedSessions.slice(0, 10);
        
        let html = '';
        
        recentSessions.forEach(session => {
            const startTime = new Date(session.startTime);
            const endTime = new Date(session.endTime);
            const duration = session.duration / 60; // Convert to minutes
            
            html += `
                <div class="history-item">
                    <div class="history-date">${Utils.formatDate(startTime)}</div>
                    <div class="history-time">${Utils.formatTime(startTime)} - ${Utils.formatTime(endTime)}</div>
                    <div class="history-duration">${duration} min</div>
                </div>
            `;
        });
        
        this.elements.focusHistory.innerHTML = html;
    },
    
    // Update chart
    updateChart: function() {
        // Load Chart.js dynamically if not already loaded
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                this.createChart();
            };
            document.head.appendChild(script);
        } else {
            this.createChart();
        }
    },
    
    // Create focus chart
    createChart: function() {
        // Get data for last 7 days
        const labels = [];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            // Format date as day name
            const dayName = Utils.getDayOfWeek(date).substr(0, 3);
            labels.push(dayName);
            
            // Calculate focus time for this day
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            const focusTime = this.focusSessions
                .filter(session => {
                    const sessionDate = new Date(session.startTime);
                    return sessionDate >= date && sessionDate < nextDay;
                })
                .reduce((total, session) => total + session.duration, 0);
            
            // Convert to minutes
            data.push(Math.floor(focusTime / 60));
        }
        
        // Create or update chart
        if (this.chart) {
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = data;
            this.chart.update();
        } else {
            this.chart = new Chart(this.elements.focusChart, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Focus Minutes',
                        data: data,
                        backgroundColor: 'rgba(74, 144, 226, 0.7)',
                        borderColor: 'rgba(74, 144, 226, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + ' min';
                                }
                            }
                        }
                    }
                }
            });
        }
    },
    
    // Toggle white noise
    toggleWhiteNoise: function() {
        const enabled = this.elements.whiteNoiseToggle.checked;
        
        this.settings.whiteNoiseEnabled = enabled;
        this.elements.whiteNoiseSelect.disabled = !enabled;
        this.elements.whiteNoiseVolume.disabled = !enabled;
        
        if (enabled) {
            this.audio.whiteNoise.play().catch(e => console.log('Error playing white noise:', e));
        } else {
            this.audio.whiteNoise.pause();
        }
    },
    
    // Change white noise
    changeWhiteNoise: function() {
        const noise = this.elements.whiteNoiseSelect.value;
        
        this.settings.currentWhiteNoise = noise;
        
        // Update audio source
        const wasPlaying = !this.audio.whiteNoise.paused;
        this.audio.whiteNoise.src = `/assets/white-noise/${noise}.mp3`;
        
        if (wasPlaying) {
            this.audio.whiteNoise.play().catch(e => console.log('Error playing white noise:', e));
        }
    },
    
    // Adjust white noise volume
    adjustWhiteNoiseVolume: function() {
        const volume = this.elements.whiteNoiseVolume.value / 100;
        this.audio.whiteNoise.volume = volume;
    },
    
    // Open settings modal
    openSettingsModal: function() {
        this.updateSettingsForm();
        this.elements.settingsModal.classList.add('active');
    },
    
    // Close settings modal
    closeSettingsModal: function() {
        this.elements.settingsModal.classList.remove('active');
    },
    
    // Update settings form
    updateSettingsForm: function() {
        this.elements.focusDuration.value = this.settings.focusDuration / 60;
        this.elements.breakDuration.value = this.settings.breakDuration / 60;
        this.elements.longBreakDuration.value = this.settings.longBreakDuration / 60;
        this.elements.sessionsBeforeLongBreak.value = this.settings.sessionsBeforeLongBreak;
        this.elements.autoStartBreaks.checked = this.settings.autoStartBreaks;
        this.elements.autoStartPomodoros.checked = this.settings.autoStartPomodoros;
        this.elements.playSound.checked = this.settings.playSound;
        this.elements.showNotifications.checked = this.settings.showNotifications;
    },
    
    // Save settings
    saveSettings: async function() {
        try {
            // Get values from form
            const focusDuration = parseInt(this.elements.focusDuration.value) * 60;
            const breakDuration = parseInt(this.elements.breakDuration.value) * 60;
            const longBreakDuration = parseInt(this.elements.longBreakDuration.value) * 60;
            const sessionsBeforeLongBreak = parseInt(this.elements.sessionsBeforeLongBreak.value);
            const autoStartBreaks = this.elements.autoStartBreaks.checked;
            const autoStartPomodoros = this.elements.autoStartPomodoros.checked;
            const playSound = this.elements.playSound.checked;
            const showNotifications = this.elements.showNotifications.checked;
            
            // Validate inputs
            if (isNaN(focusDuration) || isNaN(breakDuration) || isNaN(longBreakDuration) || isNaN(sessionsBeforeLongBreak)) {
                Utils.showNotification('Please enter valid numbers', 'error');
                return;
            }
            
            // Update settings
            this.settings = {
                ...this.settings,
                focusDuration,
                breakDuration,
                longBreakDuration,
                sessionsBeforeLongBreak,
                autoStartBreaks,
                autoStartPomodoros,
                playSound,
                showNotifications
            };
            
            // Save to database
            await window.PatelDB.update('settings', { id: 'focus-settings', ...this.settings });
            
            // Close modal
            this.closeSettingsModal();
            
            // Reset timer
            this.resetTimer();
            
            Utils.showNotification('Settings saved successfully', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            Utils.showNotification('Error saving settings', 'error');
        }
    },
    
    // Format time in MM:SS
    formatTime: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};

// Register module
window['focusModule'] = focusModule;
